import React from 'react';
import './courses.css';
import { CourseData } from '../../context/CourseContext';
import CourseCards from '../../components/coursecards/CourseCards';

const Courses = () => {
  const { courses } = CourseData();
  console.log(courses);

  return (
    <div className="courses">
      <h2>Available Courses</h2>
      <div className="course-content">
        {courses && courses.length > 0 ? (
          courses.map((course) => (
            <CourseCards key={course._id} course={course} /> 
          ))
        ) : (
          <p>No Courses Yet!</p>
        )}
      </div>
    </div>
  );
};

export default Courses;
