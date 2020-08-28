import React, { useEffect, useReducer, useRef } from "react";
import { useHistory } from "react-router-dom";
import PropTypes from "prop-types";

import "./Login.css";
import useRequest from "../../hooks/useRequest";

const initialState = {
  isLoading: false,
  loginMode: true,
  email: "",
  password: "",
};

const loginReducer = (state, action) => {
  switch (action.type) {
    case "isLoading":
      return {
        ...state,
        isLoading: action.payload,
      };
    case "loginMode":
      return {
        ...state,
        loginMode: !state.loginMode,
      };
    case "email":
      return {
        ...state,
        email: action.payload,
      };
    case "password":
      return {
        ...state,
        password: action.payload,
      };
    default:
      return state;
  }
};

const Login = ({ login }) => {
  const emailRef = useRef(null);
  const history = useHistory();
  const [state, dispatch] = useReducer(loginReducer, initialState);
  const [data, errorMessage, makeReq, cancelReq, clearError] = useRequest();

  const { isLoading, loginMode, password, email } = state;

  const handleSwitch = () => dispatch({ type: "loginMode" });

  const handleChange = (event) => {
    const { name, value } = event.target;
    dispatch({ type: name, payload: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    dispatch({ type: "isLoading", payload: true });
    const url = loginMode ? "/users/login" : "users/signup";
    await makeReq("post", url, {
      email: state.email,
      password: state.password,
    });
    dispatch({ type: "email", payload: "" });
    dispatch({ type: "password", payload: "" });
    dispatch({ type: "isLoading", payload: false });
    login();
  };

  useEffect(() => {
    if (!errorMessage) emailRef.current.focus();
  }, [errorMessage]);

  useEffect(() => {
    if (data && data.token) {
      localStorage.setItem("token", data.token);
    }
    if (data && data.teacher) {
      localStorage.setItem("teacher", true);
    } else {
      localStorage.setItem("teacher", false);
    }
    if (data) history.goBack("/");
  }, [data, history]);

  useEffect(() => {
    return () => cancelReq && cancelReq.cancel();
  }, [cancelReq]);

  if (errorMessage) {
    return (
      <main className="errorDisplay">
        <h1>{errorMessage}</h1>
        <button className="clearErrBtn" onClick={() => clearError()}>
          Try Again
        </button>
      </main>
    );
  }

  if (isLoading) return <h1>Submitting...</h1>;

  return (
    <main className="loginContainer">
      <h1>{loginMode ? "Login" : "Create Account"}</h1>
      <form className="loginForm" onSubmit={(e) => handleSubmit(e)}>
        <input
          name="email"
          value={email}
          onChange={(e) => handleChange(e)}
          ref={emailRef}
          required
          type="email"
          placeholder="Enter Email"
        />
        <input
          name="password"
          value={password}
          onChange={(e) => handleChange(e)}
          type="password"
          required
          minLength="8"
          maxLength="200"
          placeholder="Enter Password"
        />
        <button>{loginMode ? "Login" : "Create"}</button>
      </form>
      <p>
        {loginMode ? "Don't have an account? " : "Already have an account? "}
        <span className="loginSwitch" onClick={handleSwitch}>
          {loginMode ? "Create One" : "Login"}
        </span>
      </p>
    </main>
  );
};

Login.propTypes = {
  login: PropTypes.func.isRequired,
};

export default Login;
