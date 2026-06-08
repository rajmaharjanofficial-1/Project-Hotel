import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
    },
    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
    },
    checkIn: {
      type: Date,
      required: true,
    },
    checkOut: {
      type: Date,
      required: true,
    },
    persons:{
        type: Number,
        required : true,
    },
     contact:{
        type: Number,
        required : true,
    },
    status:{
        type :String,
        enum:["confirmed","pending","cancelled"],
        default: "pending",
    },
    totalPrice:{
        type : Number,
        required: true,
    },
 paymentMethod: {
  type: String,
  enum: ["Pay At Hotel", "Khalti"],
  default: "Pay At Hotel",
},
    
    isPaid:{
        type :Boolean,
        default: false,
    },
    
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
