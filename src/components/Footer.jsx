import React from 'react';
import '../styles/Footer.css';
import logo from '../assets/logo.jpg'; // Import the logo image

const Footer = () => {
  return (
    <footer>
      <div className="container">
        <div className="footer-content">
          <div className="logo">
            {/* Replace emoji with image */}
            <img src={logo} alt="Medical Clinic Logo" className="footer-logo" />
            <span>Medical Clinic</span>
          </div>
          <div className="footer-links">
            <a href="#privacy">Privacy Policy</a>
            <a href="#terms">Terms of Service</a>
            <a href="#contact">Contact Us</a>
            <a href="#faq">FAQ</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;