import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import bcrypt from "bcryptjs";


// Get all owners and admins
export const getAllAdminsAndOwners = async (req, res) => {
  try {
    // Find users where role is either 'owner' or 'admin'
    const users = await User.find({ role: { $in: ["owner", "admin"] } }).select(
      "name email role"
    );

    return res.json({ success: true, users });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

export const updatePassword = async (req, res) => {
  try {
    const { userId, newPassword } = req.body;

    // Validate input
    if (!userId || !newPassword) {
      return res
        .status(400)
        .json({ success: false, message: "User ID and new password are required" });
    }

    // Check if user exists
    const user = await User.findById(userId);
    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update user's password
    user.password = hashedPassword;
    await user.save();

    return res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error in updatePassword:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

export const getAllHotelsWithOwner = async (req, res) => {
  try {
    // Fetch all hotels and populate owner details (name and email)
    const hotels = await Hotel.find()
      .populate("owner", "name email") // only get owner's name and email
      .sort({ createdAt: -1 }); // optional: newest first

    return res.json({
      success: true,
      hotels,
    });
  } catch (error) {
    console.error("Error in getAllHotelsWithOwner:", error);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};