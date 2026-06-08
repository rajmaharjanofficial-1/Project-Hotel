import express from "express";
import {isOwner} from "../middlewares/isOwner.js"

import { isAuthenticated } from "../middlewares/isAuthenticated.js";
import { upload } from "../config/multer.js";
import { addRoom, deleteRoom, getAllRooms, getOwnerRooms, toggleRoomAvailability, updateRoom } from "../controllers/room.controller.js";

const roomRouter = express.Router();

roomRouter.post(
  "/add",
  isAuthenticated,
  isOwner,
  upload.array("images", 4),
  addRoom
);

roomRouter.get("/get", isAuthenticated, isOwner, getOwnerRooms);
roomRouter.get("/get-all", getAllRooms);
roomRouter.delete("/delete/:roomId", isAuthenticated, isOwner, deleteRoom);
roomRouter.patch("/toggle-availability/:id", toggleRoomAvailability);

  roomRouter.put("/update/:roomId",
  isAuthenticated,
  isOwner,
  upload.array("images", 4), 
  updateRoom
);


export default roomRouter;