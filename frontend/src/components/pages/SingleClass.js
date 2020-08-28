import React, { useState, useEffect } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import "./SingleClass.css";
import useRequest from "../../hooks/useRequest";

const SingleClass = ({ isAuthenticated, teacher }) => {
  const { classId } = useParams();
  const history = useHistory();
  const [studentList, setStudentList] = useState([]);
  const [addStudent, setAddStudent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [data, errorMessage, makeReq, cancelReq] = useRequest();

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsLoading(true);
    makeReq(
      "post",
      "/students/new",
      { name, studyYear: classId },
      { headers: { Authorization: `Bearer ${isAuthenticated}` } }
    );
  };

  const removeStudent = (studentId) => {
    setIsLoading(true);
    makeReq("delete", `/students/${studentId}`, {
      headers: { Authorization: `Bearer ${isAuthenticated}` },
    });
  };

  const formatClassId = () => {
    switch (classId) {
      case "9":
        return "IX";
      case "10":
        return "X";
      case "11":
        return "XI";
      case "12":
        return "XII";
      default:
        return null;
    }
  };

  const studentsJsx =
    studentList &&
    studentList.map((student) => (
      <li key={student.id}>
        <NavLink to={`/classes/${classId}/${student.id}`}>
          {student.name}
        </NavLink>
        {teacher && (
          <button
            className="removeStudentBtn"
            onClick={() => removeStudent(student.id)}
          >
            Remove Student
          </button>
        )}
      </li>
    ));

  useEffect(() => {
    if (data && data.students) {
      setStudentList(data.students);
      setIsLoading(false);
    }
    if (data && data.newStudent) {
      setStudentList((prevStudents) => [...prevStudents, data.newStudent]);
      setName("");
      setAddStudent(false);
      setIsLoading(false);
    }
    if (data && data.deleted) {
      setStudentList((prevStudents) =>
        prevStudents.filter((student) => student.id !== data.studentId)
      );
      setIsLoading(false);
    }
  }, [data]);

  useEffect(() => {
    setIsLoading(true);
    makeReq("get", `/students/year/${classId}`);
  }, [classId, makeReq]);

  useEffect(() => {
    // cancel request if user navigates away from page
    return () => cancelReq && cancelReq.cancel("Request Canceled");
  }, [cancelReq]);

  if (errorMessage) {
    return (
      <main className="errorDisplay">
        <h1>{errorMessage}</h1>
        <button className="clearErrBtn" onClick={() => history.push("/")}>
          Go To Classes
        </button>
      </main>
    );
  }

  if (isLoading) return <h1>Loading...</h1>;
  console.log(teacher);
  return (
    <main className="singleClass">
      <h1>{formatClassId()}-th grade students</h1>
      <h2>Click on a student to see it's grades</h2>
      <ol>{studentsJsx}</ol>
      {teacher && !addStudent && (
        <button onClick={() => setAddStudent(true)}>
          Add Student to Class
        </button>
      )}
      {teacher && addStudent && (
        <form onSubmit={handleSubmit} className="addStudentForm">
          <label htmlFor="name">Student's Full Name</label>
          <input
            onChange={(e) => setName(e.target.value)}
            value={name}
            required
            minLength="6"
            maxLength="200"
            name="name"
            type="text"
            placeholder="Student's full name"
          />
          <button>Add Student</button>
        </form>
      )}
    </main>
  );
};

SingleClass.propTypes = {
  isAuthenticated: PropTypes.string.isRequired,
  teacher: PropTypes.bool.isRequired,
};

export default SingleClass;
