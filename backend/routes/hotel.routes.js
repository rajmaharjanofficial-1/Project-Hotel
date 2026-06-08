import express from "express";
import {isOwner} from "../middlewares/isOwner.js"

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { deleteHotel, getAllHotels, getOwnerHotels, registerHotel, updateHotel } from "../controllers/hotel.controller.js";
import { upload } from "../config/multer.js";

const hotelRouter = express.Router();

// Register a new hotel with a single image upload
hotelRouter.post(
  "/register",
  upload.single("image"), // Expects a file field named "image"
  isAuthenticated,
  isOwner,
  registerHotel
);

// Fetching hotels
hotelRouter.get("/get", isAuthenticated, isOwner, getOwnerHotels);
hotelRouter.get("/get-all", getAllHotels);

// Delete a hotel
// Note: Changed 'deletHotel' to 'deleteHotel' to match standard naming
hotelRouter.delete("/delete/:hotelId", isAuthenticated, isOwner, deleteHotel);

hotelRouter.put(
  "/update/:hotelId",
  isAuthenticated,
  isOwner,
  upload.single("image"),
  updateHotel
);


export default hotelRouter;