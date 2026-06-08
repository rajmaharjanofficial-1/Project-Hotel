import Room from "../models/room.model.js";
import Booking from "../models/booking.model.js";
import User from "../models/user.model.js";



/**
 * GET /api/recommendation/user/:userId
 * Personalized room recommendations based on user's previous bookings
 */
export const getPersonalizedRecommendations = async (req, res) => {
  try {
    const { userId } = req.params;

    // 1️⃣ Get all bookings for this user, populate room & hotel
    const bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 }) // latest first
      .limit(3) // last 3 bookings
      .populate("room");

    // ❌ If user has no bookings, show nothing
    if (!bookings.length) {
      return res.json({ success: true, rooms: [] });
    }

    const bookedRoomIds = bookings.map((b) => b.room?._id).filter(Boolean);

    // 2️⃣ Collect hotels, roomTypes, and price ranges from last 3 bookings
    const hotels = [];
    const roomTypes = [];
    const priceRanges = [];

    bookings.forEach((b) => {
      const room = b.room;
      if (!room) return;

      hotels.push(room.hotel);
      roomTypes.push(room.roomType);
      priceRanges.push({
        min: room.pricePerNight * 0.8,
        max: room.pricePerNight * 1.2,
      });
    });

    // 3️⃣ Find similar rooms
    const similarRooms = await Room.find({
      _id: { $nin: bookedRoomIds }, // exclude already booked
      isAvailable: true,
      $or: [
        { hotel: { $in: hotels } },
        { roomType: { $in: roomTypes } },
        ...priceRanges.map((range) => ({
          pricePerNight: { $gte: range.min, $lte: range.max },
        })),
      ],
    })
      .limit(10)
      .populate("hotel");

    res.json({
      success: true,
      rooms: similarRooms,
    });
  } catch (error) {
    console.error("Recommendation Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};


/* ======================================================
   2️⃣ SIMILAR ROOMS
   GET /api/recommend/similar/:roomId
====================================================== */
export const getSimilarRooms = async (req, res) => {
  try {
    const { roomId } = req.params;

    // Find the reference room
    const room = await Room.findById(roomId).populate("hotel");
    if (!room)
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });

    // Find similar rooms with same roomType or same hotel
    const similarRooms = await Room.find({
      _id: { $ne: room._id }, // exclude the current room
      isAvailable: true,
      $or: [
        { roomType: room.roomType },
        { hotel: room.hotel._id },
      ],
    })
      .limit(6)
      .populate("hotel");

    res.json({ success: true, rooms: similarRooms });
  } catch (error) {
    console.error("Similar Room Error:", error);
    res
      .status(500)
      .json({ success: false, message: "Server error" });
  }
};
/* ======================================================
   3️⃣ TRENDING ROOMS (Cold Start)
   GET /api/recommend/trending
====================================================== */
export const getTrendingRooms = async (req, res) => {
  try {
    const rooms = await Room.aggregate([
      {
        $lookup: {
          from: "bookings",
          localField: "_id",
          foreignField: "room",
          as: "bookingData",
        },
      },
      {
        $addFields: {
          popularityScore: { $size: "$bookingData" },
        },
      },
      { $sort: { popularityScore: -1 } },
      { $limit: 10 },
    ]);

    res.json({ success: true, type: "trending", rooms });
  } catch (error) {
    console.error("Trending Error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

export const storeRecentSearch = async (req, res) => {
  try {
    const { id: userId } = req.user;
    const { recentSearchedCity } = req.body;

    if (!recentSearchedCity) {
      return res.status(400).json({ success: false, message: "City required" });
    }

    // Add to user document (prevent duplicates)
    const user = await User.findById(userId);
    if (!user.recentSearches) user.recentSearches = [];

    if (!user.recentSearches.includes(recentSearchedCity)) {
      user.recentSearches.push(recentSearchedCity);
      await user.save();
    }

    return res.json({ success: true, recentSearches: user.recentSearches });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
