import React from "react";
import "./header.css";
import { Link } from "react-router-dom";

const Header = ({ isAuth, user }) => {
  return (
    <header>
      <div className="logo">E-learning</div>

      <div className="link">
        <Link to={"/"}>Home</Link>
        <Link to={"/courses"}>Courses</Link>
        {user && user.role !== "admin" && (
          <Link to={"/timetable"}>Timetable</Link>
          
        )}
        {user && user.role !== "admin" && (
           <Link to="/todolist">To-Do List</Link>
          
        )}

        <Link to={"/about"}>About</Link>
        {isAuth ? (
          <Link to={"/account"}>Account</Link>
        ) : (
          <Link to={"/login"}>Login</Link>
        )}
      </div>
    </header>
  );
};

export default Header;
