import React from "react";
import { useNavigate } from "react-router-dom";
import "./home.css";
import hero from "../home/hero.svg";
import Testimonials from "../../components/testimonials/textimonials";

const Home = () => {
  const navigate = useNavigate();

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-text">
          <h1>
            Welcome to <span>E-learning</span>
          </h1>
          <p>
            Master new skills, boost your career, and unlock your potential.
          </p>
          <button
            onClick={() => navigate("/courses")}
            className="get-started-btn"
          >
            🚀 Get Started
          </button>
        </div>
        <div className="hero-image">
          <img
            src={hero}
            alt="E-learning Illustration"
          />
        </div>
      </section>

      <Testimonials />
    </div>
  );
};

export default Home;
