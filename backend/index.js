import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import { connectDB } from "./config/connectDB.js";

import userRouter from "./routes/user.routes.js";
import hotelRouter from "./routes/hotel.routes.js";
import roomRouter from "./routes/room.routes.js";
import bookingRouter from "./routes/booking.routes.js";
import adminRouter from "./routes/admin.routes.js";
import paymentRoutes from "./routes/payment.routes.js";
import Rerouter from "./routes/recentSearch.routes.js";

dotenv.config();

const app = express();
connectDB();

app.use(express.json());
app.use(cookieParser());

// ✅ PRODUCTION SAFE CORS
const allowedOrigins = [
  "http://localhost:5174/",
  "http://localhost:5173",
  "http://localhost:5174",
  "http://localhost:3000",
  "https://project-hotel-frontend.onrender.com"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // allow Postman / server-to-server / same-origin requests
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      } else {
        return callback(new Error("CORS blocked for this origin: " + origin));
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
  })
);

// API routes
app.get("/", (req, res) => {
  res.send("HELLO FROM SERVER");
});

app.use("/images", express.static("uploads"));
app.use("/api/user", userRouter);
app.use("/api/hotel", hotelRouter);
app.use("/api/room", roomRouter);
app.use("/api/bookings", bookingRouter);
app.use("/api/recommendation", Rerouter);
app.use("/api/admin", adminRouter);
app.use("/api/payment", paymentRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`SERVER IS RUNNING ON PORT ${PORT}`);
});