import React from "react";
import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home.jsx";
import Header from "./components/header/Header.jsx";
import Login from "./pages/auth/Login.jsx";
import Register from "./pages/auth/Register.jsx";
import Verify from "./pages/auth/Verify.jsx";
import Footer from "./components/footer/Footer.jsx";
import About from "./pages/about/About.jsx";
import Account from "./pages/account/Account.jsx";
import { UserData } from "./context/UserContext.jsx";
import Loading from "./components/loading/Loading.jsx";
import Courses from "./pages/courses/Courses.jsx";
import CourseDescription from "./pages/coursedescription/CourseDescription.jsx";
import PaymentSuccess from "./pages/paymentsuccess/PaymentSuccess.jsx";
import Dashboard from "./pages/dashboard/dashboard.jsx";
import CourseStudy from "./pages/coursestudy/CourseStudy.jsx";
import Lecture from "./pages/lecture/Lecture.jsx";
import AdminDashboard from "./admin/Dashboard/AdminDashboard.jsx";
import AdminCourses from "./admin/Courses/AdminCourses.jsx";
import AdminUsers from "./admin/Users/AdminUsers.jsx";
import Timetable from "./pages/timetable/Timetable.jsx";
import ToDoList from "./pages/todolist/ToDoList.jsx";
import { Navigate } from "react-router-dom";

const App = () => {
  const { user, isAuth, loading } = UserData();
  console.log(user);

  if (loading) {
    return <Loading />;
  }

  return (
    <BrowserRouter>
      <Header isAuth={isAuth} user={user} />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/about" element={<About />} />
        <Route path="/courses" element={<Courses />} />
        <Route
          path="/account"
          element={isAuth ? <Account user={user} /> : <Login />}
        />
        <Route
          path="/timetable"
          element={
            user && user.role !== "admin" ? <Timetable /> : <Navigate to="/" />
          }
        />
        <Route
          path="/todolist"
          element={isAuth ? <ToDoList user={user} /> : <Login />}
        />
        <Route path="/login" element={isAuth ? <Home /> : <Login />} />
        <Route path="/register" element={isAuth ? <Home /> : <Register />} />
        <Route path="/verify" element={isAuth ? <Home /> : <Verify />} />
        <Route
          path="/course/:id"
          element={isAuth ? <CourseDescription user={user} /> : <Login />}
        />
        <Route
          path="/payment-success/:id"
          element={isAuth ? <PaymentSuccess user={user} /> : <Login />}
        />
        <Route
          path="/:id/dashboard"
          element={isAuth ? <Dashboard user={user} /> : <Login />}
        />
        <Route
          path="/course/study/:id"
          element={isAuth ? <CourseStudy user={user} /> : <Login />}
        />

        <Route
          path="/lectures/:id"
          element={isAuth ? <Lecture user={user} /> : <Login />}
        />

        <Route
          path="/admin/dashboard"
          element={isAuth ? <AdminDashboard user={user} /> : <Login />}
        />

        <Route
          path="/admin/course"
          element={isAuth ? <AdminCourses user={user} /> : <Login />}
        />

        <Route
          path="/admin/users"
          element={isAuth ? <AdminUsers user={user} /> : <Login />}
        />
      </Routes>

      <Footer />
    </BrowserRouter>
  );
};

export default App;

// Hello My 