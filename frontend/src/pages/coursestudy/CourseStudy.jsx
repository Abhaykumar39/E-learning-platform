import React, { useEffect } from 'react';
import "./coursestudy.css";
import { useParams, Navigate, Link } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { UserData } from "../../context/UserContext";
import { server } from '../../main';

const CourseStudy = () => {
  const params = useParams();

  const { fetchCourse, course } = CourseData();
  const { user } = UserData();

  useEffect(() => {
    fetchCourse(params.id);
  }, [fetchCourse, params.id]);

  if (user && user.role !== "admin" && !user.subscription.includes(params.id))
    return <Navigate to="/" />;

  return (
    <>
      {course && (
        <div className='course-study-page'>
          <img src={`${server}/${course.image}`} alt="" width={350} />
          <h2>{course.title}</h2>
          <h4>{course.description}</h4>
          <h5>by- {course.createdBy}</h5>
          <h5>{course.duration}</h5>
          <Link to={`/lectures/${course._id}`}><h2>Lectures</h2></Link>
        </div>
      )}
    </>
  );
};

export default CourseStudy;
