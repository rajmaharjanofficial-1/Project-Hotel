import express from "express";
import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { isOwner } from "../middlewares/isOwner.js";
import {
  bookRoom,
  cancelBooking,
  checkRoomAvailability,
  confirmBooking,
  getHotelBookings,
  getUserBookings,
  markBookingPaid,
} from "../controllers/booking.controller.js";
const bookingRouter = express.Router();

bookingRouter.post("/check-availability", checkRoomAvailability);
bookingRouter.post("/book", isAuthenticated, bookRoom);
bookingRouter.get("/user", isAuthenticated, getUserBookings);
bookingRouter.get("/hotel", isAuthenticated, isOwner, getHotelBookings);
bookingRouter.patch("/cancel/:bookingId", isAuthenticated, cancelBooking);

bookingRouter.put(
  "/confirm/:bookingId",
  isAuthenticated,
  confirmBooking
);

bookingRouter.put(
  "/paid/:bookingId",
  isAuthenticated ,
  markBookingPaid
);

export default bookingRouter;