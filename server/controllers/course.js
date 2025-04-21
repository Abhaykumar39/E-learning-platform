import { instance } from "../index.js";
import TryCatch from "../middleware/tryCatch.js";
import { Courses } from "../models/courses.js";
import { Lecture } from "../models/lecture.js";
import { User } from "../models/user.js";
import crypto from "crypto";
import { Payment } from "../models/payment.js";


// Get all courses
export const getAllCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find();
  res.json({
    courses,
  });
});

// Get single course
export const getSingleCourse = TryCatch(async (req, res) => {
  const course = await Courses.findById(req.params.id);
  res.json({
    course,
  });
});

// Fetch lectures for a specific course
export const fetchLectures = TryCatch(async (req, res) => {
  const lectures = await Lecture.find({ course: req.params.id });
  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lectures });
  }

  if (!user.subscription.includes(req.params.id)) {
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });
  }

  res.json({ lectures });
});

// Fetch a single lecture
export const fetchLecture = TryCatch(async (req, res) => {
  const lecture = await Lecture.findById(req.params.id);
  const user = await User.findById(req.user._id);

  if (user.role === "admin") {
    return res.json({ lecture });
  }

  if (!user.subscription.includes(lecture.course)) {
    return res.status(400).json({
      message: "You have not subscribed to this course",
    });
  }

  res.json({ lecture });
});

// Get courses that the user has subscribed to
export const getMyCourses = TryCatch(async (req, res) => {
  const courses = await Courses.find({ _id: req.user.subscription });

  res.json({ courses });
});

// Checkout and create Razorpay order
export const checkout = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);
  const course = await Courses.findById(req.params.id);

  if (user.subscription.includes(course._id)) {
    return res.status(400).json({
      message: "You already have this course",
    });
  }

  const options = {
    amount: Number(course.price * 100), 
    currency: "INR",
  };

  const order = await instance.orders.create(options);

  res.status(201).json({
    order,
    course,
  });
});

// Payment verification for Razorpay
export const paymentVerification = TryCatch(async (req, res) => {
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;

  // Verify the payment signature
  const body = razorpay_order_id + "|" + razorpay_payment_id;
  const expectedSignature = crypto
    .createHmac("sha256", process.env.Razorpay_Secret)
    .update(body)
    .digest("hex");

  const isAuthentic = expectedSignature === razorpay_signature;

  if (isAuthentic) {
    // Store payment details in the Payment model
    await Payment.create({
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
    });

    // Fetch user and course details
    const user = await User.findById(req.user._id);
    const course = await Courses.findById(req.params.id);

    // Ensure user is not already subscribed to the course
    if (user.subscription.includes(course._id)) {
      return res.status(400).json({
        message: "You are already subscribed to this course",
      });
    }

    // Add the course to user's subscriptions
    user.subscription.push(course._id);


    // Save the user subscription
    await user.save();

    res.status(200).json({
      message: "Course Purchased Successfully",
    });
  } else {
    res.status(400).json({
      message: "Payment Failed",
    });
  }
});
