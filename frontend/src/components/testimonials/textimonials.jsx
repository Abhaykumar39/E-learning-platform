import React from "react";
import "./testimonials.css";

const Testimonials = () => {
  const testimonialsData = [
    {
      id: 1,
      name: "Carry Minati",
      position: "Student",
      message:
        "This platform helped me learn so effectively. The courses are amazing and the instructors are top-notch.",
      image:
        "https://m.media-amazon.com/images/M/MV5BYzI4NTQ4Y2MtOWI0Yy00MDljLWEzN2MtODBjNjE1Y2MzMzI2XkEyXkFqcGc@._V1_FMjpg_UX1000_.jpg",
    },
    {
      id: 2,
      name: "Jane Smith",
      position: "Student",
      message:
        "I've learned more here than in any other place. The interactive lessons and quizzes make learning enjoyable.",
      image:
        "https://th.bing.com/th/id/OIP.GKAiW3oc2TWXVEeZAzrWOAHaJF?w=135&h=180&c=7&r=0&o=5&dpr=1.3&pid=1.7",
    },
    {
      id: 3,
      name: "John Doe",
      position: "Student",
      message:
        "The personalized learning path helped me gain confidence in my skills. Highly recommend this platform.",
      image:
        "https://randomuser.me/api/portraits/men/32.jpg",
    },
    {
      id: 4,
      name: "Aisha",
      position: "Student",
      message:
        "Best learning experience ever! The video lessons and practice tests really made a difference.",
      image:
        "https://randomuser.me/api/portraits/women/44.jpg",
    },
  ];

  return (
    <section className="testimonials-section">
      <h2 className="section-title">💬 What Our Students Say</h2>
      <div className="testimonials-grid">
        {testimonialsData.map((t) => (
          <div className="testimonial-card" key={t.id}>
            <img src={t.image} alt={t.name} className="testimonial-img" />
            <p className="testimonial-message">“{t.message}”</p>
            <div className="testimonial-info">
              <h4>{t.name}</h4>
              <span>{t.position}</span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Testimonials;
