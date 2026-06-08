import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv  from "dotenv";
import { connectDB } from "./config/connectDB.js";
import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";

import router from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import Rerouter from "./routes/recentSearch.routes.js";
dotenv.config();

const app = express();
//database connections/
connectDB();


app.use(express.json());
app.use(cors({origin:"http://localhost:5173",credentials:true}));
app.use(cookieParser());

//API
app.get("/",(req,res)=>{
    res.send("HELLO FROM SERVER");
});
//////////////////////////
app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/recommendation",Rerouter);
app.use("/api/admin",router);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT,()=>{
    console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
    
});