import { User } from "../models/user.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import sendMail from "../middleware/sendMail.js";
import TryCatch from "../middleware/tryCatch.js";

// ======================= REGISTER USER ============================
export const register = TryCatch(async (req, res) => {
  const { email, name, password } = req.body;

  const existingUser = await User.findOne({ email });
  if (existingUser) {
    return res.status(400).json({ message: "User already exists" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);
  const user = { name, email, password: hashedPassword };

  const otp = Math.floor(100000 + Math.random() * 900000);

  const activationToken = jwt.sign(
    { user, otp },
    process.env.Activation_Secret,
    { expiresIn: "10m" }
  );

  await sendMail(email, "E-Learning OTP Verification", { name, otp });

  return res.status(200).json({
    message: "OTP sent successfully. Please check your email.",
    activationToken,
  });
});

// ======================= VERIFY USER ============================
export const verifyUser = TryCatch(async (req, res) => {
  const { otp, activationToken } = req.body;

  let verify;
  try {
    verify = jwt.verify(activationToken, process.env.Activation_Secret);
  } catch (error) {
    return res.status(401).json({ message: "OTP expired or invalid" });
  }

  if (String(verify.otp) !== String(otp)) {
    return res.status(401).json({ message: "Wrong OTP" });
  }

  await User.create({
    name: verify.user.name,
    email: verify.user.email,
    password: verify.user.password,
  });

  return res.status(201).json({ message: "User registered successfully" });
});

// ======================= LOGIN USER ============================
export const loginUser = TryCatch(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(401).json({ message: "No user with this email" });
  }

  const matchPassword = await bcrypt.compare(password, user.password);
  if (!matchPassword) {
    return res.status(401).json({ message: "Wrong password" });
  }

  const token = jwt.sign({ _id: user._id }, process.env.Jwt_Sec, {
    expiresIn: "15d",
  });

  return res.status(200).json({
    message: `Welcome back, ${user.name}`,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
    },
  });
});


// ======================= GET MY PROFILE ============================
export const myProfile = TryCatch(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (!user) {
    return res.status(404).json({ message: "User not found" });
  }

  return res.status(200).json({ user });
});
