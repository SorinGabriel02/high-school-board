import React from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";

import "./Header.css";

const Header = ({ isAuthenticated, logout }) => {
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
            {!isAuthenticated ? (
              <NavLink to="/login">Login</NavLink>
            ) : (
              <button onClick={() => logout()}>Logout</button>
            )}
          </li>
        </ul>
      </nav>
    </header>
  );
};

Header.propTypes = {
  isAuthenticated: PropTypes.string.isRequired,
  logout: PropTypes.func.isRequired,
};

export default Header;
