import React from "react";
import "../styles/AboutUs.css";

function AboutUs() {
  return (
    <section id="about" className="about-section">

      <div className="container about-container">

        <div className="about-text">
          <h2>About Our Clinic</h2>

          <p>
            At Medical Clinic, we are dedicated to providing high-quality
            healthcare services with compassion and professionalism.
          </p>

          <p>
            Our experienced doctors and medical staff are committed to
            delivering personalized care and ensuring every patient receives
            the best possible treatment.
          </p>

          <p>
            We combine modern medical technology with a patient-centered
            approach to create a comfortable and trusted healthcare experience.
          </p>
        </div>

        <div className="about-image">
          <img
            src="https://images.unsplash.com/photo-1582750433449-648ed127bb54"
            alt="Medical clinic"
          />
        </div>

      </div>

    </section>
  );
}

export default AboutUs;