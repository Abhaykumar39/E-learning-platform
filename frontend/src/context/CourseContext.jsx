import axios from "axios";
import { createContext, useContext, useEffect, useState } from "react";
import { server } from "../main";

const CourseContext = createContext();

export const CourseContextProvider = ({ children }) => {
  const [courses, setCourses] = useState([]);
  const [course, setCourse] = useState(null); 
  const[mycourse,setmyCourse]=useState([])

  // Fetch all courses
  async function fetchCourses() {
    try {
      const { data } = await axios.get(`${server}/api/course/all`);
      setCourses(data.courses);
    } catch (error) {
      console.error("Error fetching courses:", error);
    }
  }

  // Fetch single course
  async function fetchCourse(id) {
    try {
      const { data } = await axios.get(`${server}/api/course/${id}`);
      setCourse(data.course);
    } catch (error) {
      console.error(`Error fetching course with id ${id}:`, error);
    }
  }

  async function fetchMycourse() {

    try{
        const {data} = await axios.get(`${server}/api/mycourse`,{
          headers:{
            token: localStorage.getItem("token")
          }
        });

        setmyCourse(data.courses);
    }
    catch(error)
    {    
      console.log(error)
    }
    
  }

  useEffect(() => {
    fetchCourses();
    fetchMycourse();
  }, []);

  return (
    <CourseContext.Provider
      value={{ courses, fetchCourses, fetchCourse, course,mycourse,fetchMycourse }}
    >
      {children}
    </CourseContext.Provider>
  );
};

export const CourseData = () => useContext(CourseContext);
