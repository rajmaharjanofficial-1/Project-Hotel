import mongoose from "mongoose";

const hotelSchema = new mongoose.Schema(
  {
    hotelName: { type: String, required: true },
    hotelAddress: { type: String, required: true },
    landmark: { type: String }, // optional, but recommended
    location: { type: String, required: true }, // city/location of hotel
    minPrice: { type: Number, required: true },
    maxPrice: { type: Number, required: true },
    amenities: { type: [String], default: [] }, // store as array
    image: { type: String }, // image filename or URL
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
     contact: {
      phone: { type: String, required: true },},
  },
  { timestamps: true }
);

const Hotel = mongoose.model("Hotel", hotelSchema);

export default Hotel;
