import React from "react";
import { NavLink } from "react-router-dom";

import "./Header.css";

const Header = () => {
  return (
    <header className="mainHeader">
      <NavLink to="/">
        <p>Home</p>
      </NavLink>
      <nav className="mainNav">
        <ul>
          <li>
            <NavLink to="/">All Classes</NavLink>
          </li>
          <li>
            <NavLink to="/login">Login</NavLink>
          </li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
