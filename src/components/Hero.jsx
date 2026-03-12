import React from 'react';
import '../styles/Hero.css';

const Hero = ({ onStartBooking }) => {
  return (
    <section className="hero" id="home">
      <div className="container">
        <h1>Your Health, Our Priority</h1>
        <p>Book an Appointment with Our Expert Doctors</p>
        <button className="btn btn-hero" onClick={onStartBooking}>
          Schedule Your Visit
        </button>
        
        <div className="booking-steps">
          <div className="step">
            <div className="step-number">1</div>
            <span>Choose Your Doctor</span>
          </div>
          <div className="step">
            <div className="step-number">2</div>
            <span>Select a Time Slot</span>
          </div>
          <div className="step">
            <div className="step-number">3</div>
            <span>Confirm Appointment</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;