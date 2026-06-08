import mongoose from "mongoose";

const hotelRoomSchema = new mongoose.Schema(
  {
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    roomType: { type: String, required: true },
    pricePerNight: { type: Number, required: true },
    description: {
      type: String,
      default: "",
      trim: true,
    },
    images: { type: [String], required: true },
    amenities: { type: String, required: true },
    location: {
  type: String,
  required: true,
  trim: true,
},

    isAvailable: { type: Boolean, default: true },
  },
  { timestamps: true }
);
hotelRoomSchema.index({ location: 1 });
hotelRoomSchema.index({ roomType: 1 });
hotelRoomSchema.index({ pricePerNight: 1 });
hotelRoomSchema.index({ amenities: 1 });
hotelRoomSchema.index({ isAvailable: 1 });

const Room = mongoose.model("Room", hotelRoomSchema);
export default Room;