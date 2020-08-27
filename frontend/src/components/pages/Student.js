import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const Student = () => {
  const { studentId } = useParams();
  const [student, setStudent] = useState({});
  const [errorMessage, setErrorMessage] = useState("");

  const displayGrades = (subject) => {
    let grades = "|";
    if (subject) {
      subject.forEach((grade) => (grades += ` ${grade} |`));
    }
    return grades === "|" ? "No grades yet." : grades;
  };

  useEffect(() => {
    const cancelReq = axios.CancelToken.source();
    const getStudent = async () => {
      try {
        const response = await axios.get(`/students/${studentId}`, {
          cancelToken: cancelReq.token,
        });
        setStudent(response.data.student);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          setErrorMessage("Server error. Please try again later");
        } else if (error.response) {
          setErrorMessage(error.response.data.errorMessage);
        }
      }
    };
    getStudent();

    return () => cancelReq.cancel("Request Canceled");
  }, [studentId]);

  return (
    <main>
      <h1>Student: {student.name}</h1>
      <h3>Grades:</h3>
      <ul>
        <li>Mathematics: {displayGrades(student.math)}</li>
        <li>Biology: {displayGrades(student.biology)}</li>
        <li>Sports: {displayGrades(student.sports)}</li>
        <li>History: {displayGrades(student.history)}</li>
      </ul>
    </main>
  );
};

export default Student;
