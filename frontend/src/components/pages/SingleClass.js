import React, { useState, useEffect } from "react";
import { NavLink, useParams, useHistory } from "react-router-dom";
import axios from "axios";

const SingleClass = () => {
  const { classId } = useParams();
  const history = useHistory();
  const [students, setStudents] = useState([]);
  const [errorMessage, setErrorMessage] = useState(null);

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

  const studentList = students.map((student) => (
    <li key={student.id}>
      <NavLink to={`/classes/${classId}/${student.id}`}>{student.name}</NavLink>
    </li>
  ));

  useEffect(() => {
    const cancelReq = axios.CancelToken.source();
    const fetchClass = async () => {
      try {
        const response = await axios.get(`/students/year/${classId}`, {
          cancelToken: cancelReq.token,
        });
        setStudents(response.data.students);
      } catch (error) {
        if (error.response && error.response.status === 500) {
          return setErrorMessage("Server error. Please try again later");
        } else if (error.response) {
          setErrorMessage(error.response.data.errorMessage);
        }
      }
    };
    fetchClass();
    // cancel request if user navigates away from page
    return () => cancelReq.cancel("Request Canceled");
  }, [classId]);

  if (errorMessage) {
    return (
      <main>
        <h1>{errorMessage}</h1>
        <button onClick={() => history.push("/")}>Go To Classes</button>
      </main>
    );
  }

  return (
    <main className="singleClass">
      <h1>{formatClassId()}-th grade students</h1>
      <h2>Click on a student to see it's grades</h2>
      <ul>{studentList}</ul>
    </main>
  );
};

export default SingleClass;
