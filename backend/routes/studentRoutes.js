const express = require("express");
const passport = require("passport");
const { body } = require("express-validator");

const {
  registerStudent,
  deleteStudent,
  getStudentsByYear,
  getStudentById,
  gradeStudent,
} = require("../controllers/studentsController");

const router = express.Router();

const jwtAuthRequired = passport.authenticate("jwt", { session: false });

// get all students for a given year;
router.get("/year/:yearId", getStudentsByYear);

// get student by id
router.get("/:studentId", getStudentById);

// grade a student, auth required, has to be teacher
router.patch(
  "/:studentId",
  [
    body("subject").isIn(["math", "biology", "sports", "history"]),
    body("grade").isInt({ min: 1, max: 10 }),
  ],
  jwtAuthRequired,
  gradeStudent
);

// add student to class, auth required, has to be teacher
router.post(
  "/new",
  [
    body("name").isString().isLength({ min: 6, max: 200 }).trim().escape(),
    body("studyYear").isInt({ min: 9, max: 12 }),
  ],
  jwtAuthRequired,
  registerStudent
);

// delete student by given id, auth required, has to be teacher
router.delete("/:studentId", jwtAuthRequired, deleteStudent);

module.exports = router;
