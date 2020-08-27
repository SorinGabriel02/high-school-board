import React from "react";
import { Switch, Route, Redirect } from "react-router-dom";

import "./App.css";
import Header from "./components/shared/Header";
import SchoolClasses from "./components/pages/SchoolClasses";
import SingleClass from "./components/pages/SingleClass";
import Student from "./components/pages/Student";

function App() {
  return (
    <div className="App">
      <Header />
      <Switch>
        <Route exact path="/">
          <SchoolClasses />
        </Route>
        <Route exact path="/classes/:classId">
          <SingleClass />
        </Route>
        <Route exact path="/classes/:classId/:studentId">
          <Student />
        </Route>
        <Redirect to="/" />
      </Switch>
    </div>
  );
}

export default App;
