import React from 'react';
import "./courseCards.css";
import { server } from '../../main';
import { UserData } from '../../context/UserContext';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { CourseData } from '../../context/CourseContext';
import axios from 'axios'; 

const CourseCards = ({ course }) => {
  const navigate = useNavigate();
  const { user, isAuth } = UserData();
  const { fetchCourses } = CourseData();

  const isSubscribed = user?.subscription?.includes(course._id);

  const deleteHandler = async (id) => {
    if (confirm("Are you sure you want to delete this course?")) {
      try {
        const { data } = await axios.delete(`${server}/api/course/${id}`, {
          headers: {
            token: localStorage.getItem("token"), 
          },
        });
        toast.success(data.message);
        fetchCourses();
      } catch (error) {
        toast.error(error?.response?.data?.message || "Deletion failed");
      }
    }
  };

  return (
    <div className="course-card">
      <img
        src={`${server}/${course.image}`}
        alt={course.title}
        className="course-image"
      />
      <h3>{course.title}</h3>
      <p>Instructor - {course.createdBy}</p>
      <p>Duration - {course.duration} weeks</p>
      <p>Price - ₹{course.price}</p>

      {isAuth ? (
        user?.role !== "admin" ? (
          isSubscribed ? (
            <button
              onClick={() => navigate(`/course/study/${course._id}`)}
              className="common-btn"
            >
              Study
            </button>
          ) : (
            <button
              onClick={() => navigate(`/course/${course._id}`)}
              className="common-btn"
            >
              Enroll Now
            </button>
          )
        ) : (
          <button
            onClick={() => navigate(`/course/study/${course._id}`)}
            className="common-btn"
          >
            Study
          </button>
        )
      ) : (
        <button onClick={() => navigate("/login")} className="common-btn">
          Login to Enroll
        </button>
      )}

      <br />

      {user?.role === "admin" && (
        <button
          onClick={() => deleteHandler(course._id)}
          className="common-btn"
          style={{ backgroundColor: "red" }}
        >
          Delete
        </button>
      )}
    </div>
  );
};

export default CourseCards;
