import express from 'express';
import dotenv from "dotenv";
import { connectDB } from './database/db.js';
import Razorpay from "razorpay";
import cors from "cors";

dotenv.config();

export const instance = new Razorpay({
    key_id: process.env.Razorpay_key,
    key_secret:process.env.Razorpay_Secret,
})
const app = express();
const port = process.env.PORT;

//using middlewares
app.use(express.json());
app.use(cors());

app.get("/",(req,res)=>{
    res.send("Server is working");
})

app.use("/uploads",express.static("uploads"));


//importing  routes 
import userRoutes from "./routes/user.js"
import coursesRoutes from "./routes/course.js"
import adminRotes from "./routes/admin.js"
import timetableRoutes from "./routes/Timetable.js";
import todoRoutes from "./routes/todoRoutes.js";

//using routes
app.use('/api',userRoutes);
app.use('/api',coursesRoutes);
app.use('/api',adminRotes);
app.use("/api/timetable", timetableRoutes);
app.use("/api/todo", todoRoutes);


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
    connectDB();
});
