import React from "react";
import "../styles/Services.css";

const servicesList = [
  { title: 'General Consultation', description: 'Comprehensive health check-ups.' },
  { title: 'Pediatrics', description: 'Child healthcare services.' },
  { title: 'Dental Care', description: 'Teeth cleaning and treatment.' },
  { title: 'Laboratory Services', description: 'Blood tests, diagnostics, and more.' },
  // Add more services if needed
];

function Services() {
  return (
    <section id="services" className="services-section">
      <div className="container">
        <h2 className="section-title">Our Services</h2>

        <div className="services-container">
          {servicesList.map((service, index) => (
            <div className="service-card" key={index}>
              <h3>{service.title}</h3>
              <p>{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Services;