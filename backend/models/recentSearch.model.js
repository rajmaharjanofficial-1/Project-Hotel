import mongoose from "mongoose";

const recentSearchSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: [true, "User reference is required"],
      unique: true, // Each user has only one recent search record
    },
    cities: {
      type: [String],
      default: [],
      validate: {
        validator: (arr) => arr.every((c) => typeof c === "string" && c.trim() !== ""),
        message: "Cities must be non-empty strings",
      },
    },
  },
  { timestamps: true }
);

export default mongoose.model("RecentSearch", recentSearchSchema);
