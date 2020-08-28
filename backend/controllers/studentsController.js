const Student = require("../models/studentModel");
const { validationResult } = require("express-validator");

const getStudentsByYear = async (req, res) => {
  try {
    const { yearId } = req.params;
    const students = await Student.find({ studyYear: yearId });
    if (!students.length) {
      return res.status(404).json({
        errorMessage: `No students were found in this class.`,
      });
    }
    const studentsMap = students.map((s) => ({
      id: s._id,
      name: s.name,
      studyYear: s.studyYear,
    }));
    res.json({ students: studentsMap });
  } catch (error) {
    res.sendStatus(500);
  }
};

// get one student by id
const getStudentById = async (req, res) => {
  const { studentId } = req.params;
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res.status(404).json({ errorMessage: "Student not found." });
    }
    res.json({ student: student.toObject({ getters: true }) });
  } catch (error) {
    res.sendStatus(500);
  }
};

// give a student a new grade (by id)
const gradeStudent = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: "Invalid data. Pease check your data and try again.",
    });
  }
  const { studentId } = req.params;
  const { subject, grade } = req.body;
  if (!req.user.teacher) {
    return res.status(401).json({ errorMessage: "Invalid credentials." });
  }
  try {
    const student = await Student.findById(studentId);
    if (!student) {
      return res
        .status(404)
        .json({ errorMessage: "This student could not be found." });
    }
    student[subject].push(grade);
    const savedGrade = await student.save();
    res.json({ student: savedGrade });
  } catch (error) {
    console.log(error);
    res.sendStatus(500);
  }
};

// add a new student to a highschool class
const registerStudent = async (req, res) => {
  // check to see if there are error in the req.body
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({
      errorMessage: "Invalid data. Pease check your data and try again.",
    });
  }
  const { name, studyYear } = req.body;
  // user is authenticated, only save new student if user is a teacher
  if (!req.user.teacher) {
    return res.status(401).json({ errorMessage: "Invalid credentials." });
  }
  try {
    const newStudent = new Student({ name, studyYear });
    const savedStudent = await newStudent.save();
    res.status(201).send({
      newStudent: {
        name: savedStudent.name,
        id: savedStudent._id,
        studyYear: savedStudent.studyYear,
      },
    });
  } catch (error) {
    res.sendStatus(500);
  }
};

// delete student by id
const deleteStudent = async (req, res) => {
  if (!req.user.teacher) {
    return res.status(401).json({ errorMessage: "Invalid credentials." });
  }
  const { studentId } = req.params;
  try {
    const deletedStudent = await Student.findByIdAndDelete(studentId);
    if (!deletedStudent) {
      return res.status(404).json({
        errorMessage: "This student could not be found. Unable to delete.",
      });
    }
    res.json({ deleted: "success", studentId });
  } catch (error) {
    res.sendStatus(500);
  }
};

module.exports = {
  registerStudent,
  deleteStudent,
  getStudentsByYear,
  getStudentById,
  gradeStudent,
};
