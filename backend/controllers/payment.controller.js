import axios from "axios";
import Booking from "../models/booking.model.js";

const KHALTI_INITIATE_URL =
  process.env.NODE_ENV === "production"
    ? "https://khalti.com/api/v2/epayment/initiate/"
    : "https://dev.khalti.com/api/v2/epayment/initiate/";

const KHALTI_LOOKUP_URL =
  process.env.NODE_ENV === "production"
    ? "https://khalti.com/api/v2/epayment/lookup/"
    : "https://dev.khalti.com/api/v2/epayment/lookup/";

/* -----------------------------------
   INITIATE PAYMENT
----------------------------------- */
export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;
    if (!bookingId)
      return res.status(400).json({ success: false, message: "Booking ID required" });

    const booking = await Booking.findById(bookingId)
      .populate("user")
      .populate({
        path: "room",
        populate: { path: "hotel" },
      });

    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.isPaid)
      return res.status(400).json({ success: false, message: "Already paid" });

    const frontendUrl = process.env.FRONTEND_URL.replace(/\/+$/, "");

    const hotelName =
      booking.room?.hotel?.hotelName || "Hotel Booking";

    const payload = {
      return_url: `${frontendUrl}/payment-success?bookingId=${booking._id}`,
      website_url: frontendUrl,
      amount: booking.totalPrice * 100,
      purchase_order_id: booking._id.toString(),
      purchase_order_name: `Booking - ${hotelName}`,
      customer_info: {
        name: booking.user.name,
        email: booking.user.email,
        phone: booking.user.phone || "9800000000",
      },
    };

    const response = await axios.post(KHALTI_INITIATE_URL, payload, {
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
    });

    return res.json({
      success: true,
      payment_url: response.data.payment_url,
    });
  } catch (error) {
    console.error("Khalti initiation error:", error.response?.data || error.message);
    return res.status(400).json({
      success: false,
      message: "Khalti initiation failed",
    });
  }
};

/* -----------------------------------
   VERIFY PAYMENT
----------------------------------- */
export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, bookingId } = req.body;

    if (!pidx || !bookingId) {
      return res.status(400).json({
        success: false,
        message: "Missing pidx or bookingId",
      });
    }

    const booking = await Booking.findById(bookingId);
    if (!booking)
      return res.status(404).json({ success: false, message: "Booking not found" });

    if (booking.isPaid)
      return res.json({ success: true, message: "Already paid" });

    const response = await axios.post(
      KHALTI_LOOKUP_URL,
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (response.data.status !== "Completed") {
      return res.status(400).json({
        success: false,
        message: "Payment not completed",
      });
    }

    booking.isPaid = true;
    booking.paymentMethod = "Khalti";
    booking.status = "confirmed";
    await booking.save();

    return res.json({
      success: true,
      message: "Payment verified successfully",
    });
  } catch (error) {
    console.error("Khalti verify error:", error.response?.data || error.message);
    return res.status(400).json({
      success: false,
      message: "Payment verification failed",
    });
  }
};
