import React, { useEffect, useState } from "react";
import "./coursedescription.css";
import { useParams, useNavigate } from "react-router-dom";
import { CourseData } from "../../context/CourseContext";
import { server } from "../../main";
import axios from "axios";
import toast from "react-hot-toast";
import { UserData } from "../../context/UserContext";
import Loading from "../../components/loading/Loading";

const CourseDescription = ({ user }) => {
  const { id } = useParams(); 
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const { fetchCourse, course, fetchCourses,fetchMycourse } = CourseData();
  const { fetchUser } = UserData(); 

  useEffect(() => {
    fetchCourse(id); 
  }, [fetchCourse, id]);

  const checkoutHandler = async () => {
    const token = localStorage.getItem("token");
    setLoading(true);

    try {
      const { data } = await axios.post(
        `${server}/api/course/checkout/${id}`,
        {},
        { headers: { token } }
      );

      const { order } = data;

      const options = {
        key: "rzp_test_AAomMEUYSgZiuK",
        amount: order.amount,
        currency: "INR",
        name: "E-Learning",
        description: "Learn with Us",
        order_id: order.id,
        handler: async function (response) {
          const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
          } = response;

          try {
            const result = await axios.post(
              `${server}/api/verification/${id}`,
              {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
              },
              { headers: { token } }
            );

            await fetchUser(); 
            await fetchCourses(); 
            await fetchMycourse();
            toast.success(result.data.message);
            navigate(`/payment-success/${razorpay_payment_id}`);
          } catch (error) {
            toast.error(error?.response?.data?.message || "Verification failed");
          } finally {
            setLoading(false);
          }
        },
        theme: { color: "#8a4baf" },
      };

      const razorpay = new window.Razorpay(options);
      razorpay.open();
    } catch (error) {
      toast.error(error?.response?.data?.message || "Checkout failed");
      setLoading(false);
    }
  };

  
  if (loading || !course) {
    return <Loading />;
  }

  return (
    <div className="course-description">
      <div className="course-header">
        <img
          src={`${server}/${course?.image}`}
          alt={course?.title}
          className="course-image"
        />
        <div className="cour-info">
          <h2>{course?.title}</h2>
          <p>Instructor: {course?.createdBy}</p>
          <p>Duration: {course?.duration} weeks</p>
        </div>
      </div>
      <p className="course-desc">{course?.description}</p>
      <p className="course-price">
        Let's get started with this course at ₹{course?.price}
      </p>

      {/* Check if the user is subscribed to this course */}
      {user?.subscription?.includes(course?._id) ? (
        <button
          className="common-btn"
          onClick={() => navigate(`/course/study/${course?._id}`)}
        >
          Study
        </button>
      ) : (
        <button onClick={checkoutHandler} className="common-btn">
          Buy Now
        </button>
      )}
    </div>
  );
};

export default CourseDescription;
