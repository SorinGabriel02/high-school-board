import React from "react";
import { NavLink } from "react-router-dom";

import "./SchoolClasses.css";

const SchoolClasses = () => {
  return (
    <main className="schoolClasses">
      <h1>These are our classes</h1>
      <h2>Click on a class to see it's students</h2>
      <NavLink to="/classes/9">
        <h3>IX-th Grade</h3>
      </NavLink>
      <NavLink to="/classes/10">
        <h3>X-th Grade</h3>
      </NavLink>
      <NavLink to="/classes/11">
        <h3>XI-th Grade</h3>
      </NavLink>
      <NavLink to="/classes/12">
        <h3>XII-th Grade</h3>
      </NavLink>
    </main>
  );
};

export default SchoolClasses;
