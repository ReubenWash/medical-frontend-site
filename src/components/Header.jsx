
import React, { useState } from "react";
import "../styles/Header.css";
import logo from "../assets/logo.jpg";

const Header = ({ user, onLoginClick, onSignupClick }) => {

  const [menuOpen, setMenuOpen] = useState(false);

  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <header className="header">
      <div className="container header-content">

        {/* LEFT: LOGO */}
        <div className="logo">
          <img src={logo} alt="Medical Clinic Logo" className="header-logo" />
          <span className="logo-text">Medical Clinic</span>
        </div>

        {/* HAMBURGER BUTTON */}
        <div className="hamburger" onClick={toggleMenu}>
          ☰
        </div>

        {/* CENTER NAV */}
        <nav className={`nav ${menuOpen ? "active" : ""}`}>
          <ul className="nav-links">
            <li><a href="#home" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#services" onClick={() => setMenuOpen(false)}>Services</a></li>
            <li><a href="#about" onClick={() => setMenuOpen(false)}>About Us</a></li>
            
            
          </ul>
        </nav>

        {/* RIGHT USER */}
        <div className="auth-buttons">
          {user ? (
            <div className="user-info">
              <div className="avatar">
                {user.full_name?.charAt(0).toUpperCase()}
              </div>
              <span className="username">{user.full_name}</span>
            </div>
          ) : (
            <>
              <button className="btn btn-login" onClick={onLoginClick}>Login</button>
              <button className="btn btn-signup" onClick={onSignupClick}>Sign Up</button>
            </>
          )}
        </div>

      </div>
    </header>
  );
};

export default Header;
