import React, { useState, useEffect } from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Header from "./components/shared/Header";
import SchoolClasses from "./components/pages/SchoolClasses";
import SingleClass from "./components/pages/SingleClass";
import Student from "./components/pages/Student";
import Login from "./components/pages/Login";

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState("");
  const [teacher, setTeacher] = useState(false);

  const login = () => {
    setIsAuthenticated(localStorage.getItem("token"));
    if (localStorage.getItem("teacher") === "true") {
      setTeacher(true);
    }
  };

  const logout = () => {
    localStorage.setItem("token", "");
    localStorage.setItem("teacher", false);
    setIsAuthenticated("");
    setTeacher(false);
  };

  // load auth from localStorage on page refresh
  useEffect(() => {
    if (localStorage.getItem("token")) {
      login();
    }
  }, [isAuthenticated]);

  //console.log(teacher);
  return (
    <div className="App">
      <Header isAuthenticated={isAuthenticated} logout={logout} />
      <Switch>
        <Route exact path="/">
          <SchoolClasses />
        </Route>
        <Route path="/login">
          {!isAuthenticated ? <Login login={login} /> : <Redirect to="/" />}
        </Route>
        <Route exact path="/classes/:classId">
          <SingleClass isAuthenticated={isAuthenticated} teacher={teacher} />
        </Route>
        <Route exact path="/classes/:classId/:studentId">
          <Student isAuthenticated={isAuthenticated} teacher={teacher} />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
};

export default App;
