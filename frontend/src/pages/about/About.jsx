import React from "react";
import "./about.css";
import img1 from "./img1.avif";

const About = () => {
  return (
    <section className="about modern-about">
      <div className="about-container">
        <div className="about-text">
          <h2 className="about-title">Who We Are</h2>
          <p className="about-description">
            At <strong>E-Learning</strong>, we’re passionate about education.
            We offer top-notch online courses designed to empower learners with
            the skills they need to succeed. Whether you're looking to master a
            new technology, develop soft skills, or pursue a career change —
            we’ve got you covered.
          </p>
          <ul className="about-features">
            <li>✅ Expert Instructors</li>
            <li>✅ Practical Learning Approach</li>
            <li>✅ Lifetime Access to Courses</li>
            <li>✅ Community Support</li>
          </ul>
        </div>
        <div className="about-image">
          <img src={img1} alt="About Us" />
        </div>
      </div>
    </section>
  );
};

export default About;
