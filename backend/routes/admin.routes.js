import express from "express";
import { getAllAdminsAndOwners, getAllHotelsWithOwner, updatePassword } from "../controllers/admin.controller.js";
import { isAuthenticated } from "../middlewares/isAuthenticated.js"; // make sure only admin can access

const router = express.Router();

// Only admin should access these routes
router.get("/users", isAuthenticated, getAllAdminsAndOwners);
router.put("/update-password", isAuthenticated, updatePassword);
router.get("/hotels", isAuthenticated, getAllHotelsWithOwner);

export default router;
