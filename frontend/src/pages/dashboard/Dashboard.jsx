import React from "react";
import "./dashboard.css";
import { CourseData } from "../../context/CourseContext";
import CourseCards from "../../components/coursecards/CourseCards";

const Dashboard = () => {
  const { mycourse } = CourseData();
  console.log(mycourse);

  return (
    <div className="student-dashboard">
      <h2>All Enrolled Courses</h2>
      <div className="dashboard-content">
        {mycourse && mycourse.length > 0 ? (
          mycourse.map((e) => <CourseCards key={e._id} course={e} />)
        ) : (
          <p>No courses enrolled yet.</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
