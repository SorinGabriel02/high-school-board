import React, { useReducer, useEffect } from "react";
import { useParams, useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import "./Student.css";
import useRequest from "../../hooks/useRequest";

const initialState = {
  isLoading: false,
  name: "",
  math: [],
  biology: [],
  sports: [],
  history: [],
  chosenSubject: "math",
  grade: 5,
  addGrade: false,
};

const studentReducer = (state, action) => {
  switch (action.type) {
    case "isLoading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "loadStudent":
      return {
        ...state,
        isLoading: false,
        name: action.payload.name,
        math: action.payload.math,
        biology: action.payload.biology,
        sports: action.payload.sports,
        history: action.payload.history,
      };
    // add a new grade action taken
    case "addGrade":
      return {
        ...state,
        addGrade: action.payload,
      };
    case "grade":
      return {
        ...state,
        grade: action.payload,
      };
    case "chosenSubject":
      return {
        ...state,
        chosenSubject: action.payload,
      };
    default:
      return state;
  }
};

const Student = ({ isAuthenticated, teacher }) => {
  const { studentId } = useParams();
  const history = useHistory();
  const [data, errorMessage, makeReq, cancelReq] = useRequest();
  const [state, dispatch] = useReducer(studentReducer, initialState);

  const displayGrades = (subject) => {
    let grades = "|";
    if (subject) {
      subject.forEach((grade) => (grades += ` ${grade} |`));
    }
    return grades === "|" ? "No grades yet." : grades;
  };

  // submit new grade
  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch({ type: "isLoading", payload: true });
    makeReq(
      "patch",
      `/students/${studentId}`,
      { subject: state.chosenSubject, grade: state.grade },
      { headers: { Authorization: `Bearer ${isAuthenticated}` } }
    );
    dispatch({ type: "addGrade", payload: false });
    dispatch({ type: "grade", payload: 5 });
  };

  useEffect(() => {
    if (data && data.student)
      dispatch({ type: "loadStudent", payload: data.student });
  }, [data]);

  // get student data from backend
  useEffect(() => {
    dispatch({ type: "isLoading", payload: true });
    makeReq("get", `/students/${studentId}`);
  }, [studentId, makeReq]);

  // cancel request -> cleanup
  useEffect(() => {
    return () => cancelReq && cancelReq.cancel();
  }, [cancelReq]);

  if (errorMessage) {
    return (
      <main className="errorDisplay">
        <h1>{errorMessage}</h1>
        <button className="clearErrBtn" onClick={() => history.goBack()}>
          Go Back
        </button>
      </main>
    );
  }

  return (
    <main>
      {state.isLoading && <h1 className="loading">Loading...</h1>}
      <h1>Student: {state.name}</h1>
      <h3>Grades:</h3>
      <ul>
        <li>Mathematics: {displayGrades(state.math)} </li>
        <li>Biology: {displayGrades(state.biology)} </li>
        <li>Sports: {displayGrades(state.sports)} </li>
        <li>History: {displayGrades(state.history)} </li>
      </ul>
      {!state.addGrade && teacher && (
        <button onClick={() => dispatch({ type: "addGrade", payload: true })}>
          Add Grade
        </button>
      )}
      {state.addGrade && teacher && (
        <form onSubmit={(e) => handleSubmit(e)} className="gradeForm">
          <label htmlFor="subjects">Choose a Subject</label>
          <select
            onChange={(e) =>
              dispatch({ type: "chosenSubject", payload: e.target.value })
            }
            name="subjects"
          >
            <option value="math">Math</option>
            <option value="biology">Biology</option>
            <option value="sports">Sports</option>
            <option value="history">History</option>
          </select>
          <label htmlFor="grade">Choose a grade</label>
          <input
            name="grade"
            value={state.grade}
            onChange={(e) =>
              dispatch({ type: "grade", payload: e.target.value })
            }
            type="number"
            required
            min="1"
            max="10"
          />
          <button>Submit</button>
        </form>
      )}
    </main>
  );
};

Student.propTypes = {
  isAuthenticated: PropTypes.string.isRequired,
  teacher: PropTypes.bool.isRequired,
};

export default Student;
