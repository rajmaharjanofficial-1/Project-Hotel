import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";


export const signup = async (req, res) => {
  try {
    const {name , email ,password ,role} = req.body ;
    if (!name || !email || !password || !role){
        return res.json({message:"ALL fields Are required", success:false});
    }


    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.json({ message: "user already exists", success: false });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User({
      name,
      email,
      password: hashedPassword,
      role,
    });
    await newUser.save();

    return res.json({ message: "user created successfully", success: true });
  } catch (error) {
    return res.json({ message: "internal server error", success: false });
  }
};



export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ message: "All fields are required", success: false });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.json({ message: "User not found", success: false });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.json({ message: "Invalid password", success: false });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user._id, role: user.role }, // use user.role, not useReducer
            process.env.JWT_SECRET,
            { expiresIn: "1d" } // optional: token expiration
        );

        // Cookie
        res.cookie("token",token,{
            httpOnly: true,
            maxAge : 24 * 60 * 60 * 1000,
        });
        return res.json({ message: "Login Successful  ", success: true,user });
       
    } catch (error) {
        console.error(error);
        return res.json({ message: "Internal server error", success: false });
    }
};

export const logout = async (req, res) => {
    try {
        // Clear the token cookie (match options if it was set with them)
        res.clearCookie("token", { httpOnly: true, secure: true, path: "/" });

        return res.json({ message: "Logout successful", success: true });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: "Internal server error", success: false });
    }
};

// is-auth function

export const isAuth = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: "User not authenticated" });
    }

    const user = await User.findById(req.user.id).select("-password");
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.json({ success: true, user });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};