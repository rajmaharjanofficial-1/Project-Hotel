
import Booking from "../models/booking.model.js";
import Room from "../models/room.model.js";
import Hotel from "../models/hotel.model.js";
import User from "../models/user.model.js";
import transporter from "../config/nodemailer.js";

/* -----------------------------------
   Check room availability (HELPER)
----------------------------------- */
export const checkAvailability = async ({ room, checkIn, checkOut }) => {
  const checkInDate = new Date(checkIn);
  const checkOutDate = new Date(checkOut);

  const overlappingBookings = await Booking.find({
    room,
    checkIn: { $lt: checkOutDate },
    checkOut: { $gt: checkInDate },
  });

  return overlappingBookings.length === 0;
};

/* -----------------------------------
   API: Check room availability
----------------------------------- */
export const checkRoomAvailability = async (req, res) => {
  try {
    const { room, checkIn, checkOut } = req.body;

    if (!room || !checkIn || !checkOut) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isAvailable = await checkAvailability({ room, checkIn, checkOut });
    return res.json({ success: true, isAvailable });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* -----------------------------------
   API: Book a room
----------------------------------- */
export const bookRoom = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const user = await User.findById(userId);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    // ✅ ADD contact here
    const { room, checkIn, checkOut, persons, paymentMethod, contact } = req.body;

    // ✅ ADD contact validation
    if (!room || !checkIn || !checkOut || !persons || !paymentMethod || !contact) {
      return res
        .status(400)
        .json({ success: false, message: "All fields are required" });
    }

    const isAvailable = await checkAvailability({ room, checkIn, checkOut });
    if (!isAvailable) {
      return res
        .status(400)
        .json({ success: false, message: "Room is not available" });
    }

    const roomData = await Room.findById(room).populate("hotel");
    if (!roomData) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    const totalPrice = roomData.pricePerNight * nights;

    // ✅ ADD contact in booking
    const booking = await Booking.create({
      user: userId,
      room: roomData._id,
      hotel: roomData.hotel._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      persons,
      contact, 
      totalPrice,
      paymentMethod,
      isPaid: false,
      status: "pending",
    });

    /* -------- SEND EMAIL -------- */
   const mailOptions = {
  from: process.env.SENDER_EMAIL,
  to: user.email,
  subject: "🏨 Booking Confirmation - QuickStay",
  html: `
  <div style="font-family: Arial, sans-serif; background-color: #f4f6f8; padding: 20px;">
    <div style="max-width: 600px; margin: auto; background: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 12px rgba(0,0,0,0.1);">
      
      <!-- Header -->
      <div style="background: #1e3a8a; color: #ffffff; padding: 20px; text-align: center;">
        <h1 style="margin: 0;">QuickStay</h1>
        <p style="margin: 5px 0 0;">Booking Confirmation</p>
      </div>

      <!-- Body -->
      <div style="padding: 25px;">
        <h2 style="color: #16a34a; margin-top: 0;">🎉 Booking Confirmed!</h2>
        <p>Dear <strong>${user.name}</strong>,</p>
        <p>Your room booking has been successfully confirmed. Below are your booking details:</p>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <h3 style="margin-bottom: 10px;">📄 Booking Details</h3>
        <table style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 8px 0;"><strong>Booking ID:</strong></td>
            <td style="padding: 8px 0;">${booking._id}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Hotel Name:</strong></td>
            <td style="padding: 8px 0;">${roomData.hotel.hotelName}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Location:</strong></td>
            <td style="padding: 8px 0;">${roomData.hotel.hotelAddress}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Room Type:</strong></td>
            <td style="padding: 8px 0;">${roomData.roomType}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Check-In:</strong></td>
            <td style="padding: 8px 0;">${checkIn}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Check-Out:</strong></td>
            <td style="padding: 8px 0;">${checkOut}</td>
          </tr>
          
            <td style="padding: 8px 0;"><strong>Payment Method:</strong></td>
            <td style="padding: 8px 0;">${paymentMethod}</td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Payment Status:</strong></td>
            <td style="padding: 8px 0; color: ${
              booking.isPaid ? "#16a34a" : "#dc2626"
            };">
              ${booking.isPaid ? "Paid" : "Unpaid"}
            </td>
          </tr>
          <tr>
            <td style="padding: 8px 0;"><strong>Total Price:</strong></td>
            <td style="padding: 8px 0; font-size: 18px; font-weight: bold;">
              ${process.env.CURRENCY || "₹"} ${totalPrice}
            </td>
          </tr>
        </table>

        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />

        <p style="margin-bottom: 0;">
          📍 Please arrive at the hotel at your scheduled check-in time.  
          If you need to modify or cancel your booking, please contact us.
        </p>
      </div>

      <!-- Footer -->
      <div style="background: #f9fafb; padding: 15px; text-align: center; font-size: 12px; color: #6b7280;">
        <p style="margin: 0;">Need help? Contact us at support@quickstay.com</p>
        <p style="margin: 5px 0 0;">© ${new Date().getFullYear()} QuickStay. All rights reserved.</p>
      </div>

    </div>
  </div>
  `,
};

    // 
transporter.sendMail(mailOptions)
  .then(() => console.log("Booking email sent"))
  .catch((err) => console.error("Email error:", err));

return res.status(201).json({
  success: true,
  message: "Room booked successfully",
  booking,
});

} catch (error) {
  console.error(error.message);
  return res.status(500).json({
    success: false,
    message: "Internal server error",
  });
}
};

/* -----------------------------------
   API: Get user bookings
----------------------------------- */
export const getUserBookings = async (req, res) => {
  try {
    const { id: userId } = req.user;

    const bookings = await Booking.find({ user: userId })
      .populate({
        path: "room",
        populate: { path: "hotel" },
      })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};

/* -----------------------------------
   API: Get hotel bookings (OWNER)
----------------------------------- */
export const getHotelBookings = async (req, res) => {
  try {
    const { id: ownerId } = req.user;

    const hotels = await Hotel.find({ owner: ownerId }).select("_id");
    const hotelIds = hotels.map((h) => h._id);

    const bookings = await Booking.find({ hotel: { $in: hotelIds } })
      .populate("hotel", "hotelName owner")   // ⭐ FIX ADDED
      .populate("room", "roomType")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    return res.json({ success: true, bookings });
  } catch (error) {
    console.error(error.message);
    return res
      .status(500)
      .json({ success: false, message: "Internal server error" });
  }
};


export const cancelBooking = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("room")
      .populate("hotel")
      .populate("user");

    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    if (booking.user._id.toString() !== userId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Already cancelled" });
    }

    // Store payment info BEFORE updating
    const wasPaid = booking.isPaid;
    const refundAmount = wasPaid ? booking.totalPrice : 0;

    // Update booking
    booking.status = "cancelled";
    booking.isPaid = false;
    await booking.save();

    /* -------- SEND EMAIL -------- */

    const mailOptions = {
      from: process.env.SENDER_EMAIL,
      to: booking.user.email,
      subject: "❌ Booking Cancelled - QuickStay",
      html: `
      <div style="font-family: Arial; background:#f4f6f8; padding:20px;">
        <div style="max-width:600px;margin:auto;background:#fff;border-radius:10px;overflow:hidden;">
          
          <div style="background:#b91c1c;color:#fff;padding:20px;text-align:center;">
            <h2 style="margin:0;">Booking Cancelled</h2>
          </div>

          <div style="padding:20px;">
            <p>Dear <strong>${booking.user.name}</strong>,</p>
            <p>Your booking has been successfully cancelled.</p>

            <hr/>

            <p><strong>Booking ID:</strong> ${booking._id}</p>
            <p><strong>Hotel:</strong> ${booking.hotel.hotelName}</p>
            <p><strong>Location:</strong> ${booking.hotel.hotelAddress}</p>
            <p><strong>Room:</strong> ${booking.room.roomType}</p>
            <p><strong>Check-In:</strong> ${booking.checkIn.toDateString()}</p>
            <p><strong>Check-Out:</strong> ${booking.checkOut.toDateString()}</p>
            <p><strong>Payment Method:</strong> ${booking.paymentMethod}</p>

            <p><strong>Refund Status:</strong> ${
              wasPaid
                ? "Refund will be processed within 3-7 business days."
                : "No payment was made."
            }</p>

            <p><strong>Refund Amount:</strong> ${
              process.env.CURRENCY || "₹"
            } ${refundAmount}</p>

            <hr/>

            <p>If this was a mistake, feel free to book again anytime.</p>
          </div>

          <div style="background:#f9fafb;padding:10px;text-align:center;font-size:12px;color:#666;">
            © ${new Date().getFullYear()} QuickStay
          </div>

        </div>
      </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    return res.json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });

  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};



export const confirmBooking = async (req, res) => {
  try {
    const { id: ownerId } = req.user;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("hotel");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check ownership
    if (booking.hotel.owner.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cancelled booking cannot be confirmed" });
    }

    booking.status = "confirmed";
    await booking.save();

    return res.json({
      success: true,
      message: "Booking confirmed",
      booking,
    });
  } catch (error) {
    console.error("Confirm booking error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};

/* -----------------------------------
   OWNER: Mark Booking as Paid
----------------------------------- */
export const markBookingPaid = async (req, res) => {
  try {
    const { id: ownerId } = req.user;
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId).populate("hotel");
    if (!booking) {
      return res.status(404).json({ success: false, message: "Booking not found" });
    }

    // Check ownership
    if (booking.hotel.owner.toString() !== ownerId) {
      return res.status(403).json({ success: false, message: "Unauthorized" });
    }

    if (booking.status === "cancelled") {
      return res.status(400).json({ success: false, message: "Cancelled booking cannot be paid" });
    }

    if (booking.isPaid) {
      return res.status(400).json({ success: false, message: "Booking already paid" });
    }

    booking.isPaid = true;
    await booking.save();

    return res.json({
      success: true,
      message: "Booking marked as paid",
      booking,
    });
  } catch (error) {
    console.error("Mark paid error:", error.message);
    return res.status(500).json({ success: false, message: "Internal server error" });
  }
};