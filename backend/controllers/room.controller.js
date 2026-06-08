import Room from "../models/room.model.js";
import promptAI from "../utils/ai.js";
import { ROOM_DESCRIPTION_PROMPT } from "../utils/prompt.js";
import Hotel from "../models/hotel.model.js";


export const addRoom = async (req, res) => {
  try {
    const {
      hotelId,
      roomType,
      description,
      location,
      pricePerNight,
      amenities,
      isAvailable,
    } = req.body;

    // ✅ VALIDATION
    if (!hotelId || !roomType || !location || !pricePerNight) {
      return res.status(400).json({
        success: false,
        message: "Missing required fields",
      });
    }

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Room images are required",
      });
    }

    const images = req.files.map((file) => file.filename);

    // ✅ GET HOTEL NAME
    const hotel = await Hotel.findById(hotelId).select("name");
    const hotelName = hotel?.hotelName || "Hotel";

    // ✅ AI DESCRIPTION
    let roomDescription = description;

    if (!roomDescription || roomDescription.trim() === "") {
      const promptMessage = ROOM_DESCRIPTION_PROMPT
        .replace("%s", hotelName)
        .replace("%s", roomType)
        .replace("%s", pricePerNight)
        .replace("%s", location)
        .replace("%s", amenities || "");

      roomDescription = await promptAI(promptMessage);
    }

    // ✅ FALLBACK SAFETY
    roomDescription =
      roomDescription && roomDescription.trim()
        ? roomDescription
        : "Comfortable hotel room with modern amenities.";

    const newRoom = await Room.create({
      hotel: hotelId,
      roomType,
      description: roomDescription,
      location,
      pricePerNight,
      amenities,
      isAvailable,
      images,
    });

    return res.status(201).json({
      success: true,
      message: "Room added successfully",
      room: newRoom,
    });
  } catch (error) {
    console.error("ADD ROOM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


export const getOwnerRooms = async (req, res) => {
  try {
    const { id } = req.user;

    // 1. Find rooms where the hotel belongs to the owner
    // Note: This requires your Room schema to have a reference to the Hotel
    // If you can't query by hotel.owner directly, use the approach below:
    
    const rooms = await Room.find().populate({
      path: "hotel",
      match: { owner: id },
      select: "hotelName hotelAddress rating amenities owner",
    });

    // 2. Filter out rooms where the hotel didn't match the owner (hotel is null)
    const ownerRooms = rooms.filter(room => room.hotel !== null);

    return res.status(200).json({ 
      rooms: ownerRooms, 
      success: true 
    });
    
  } catch (error) {
    console.error(error); // Always good to log the actual error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find()
      .populate({
        path: "hotel",
        select: "hotelName hotelAddress amenities rating owner",
        populate: {
          path: "owner", // populate the owner from the hotel model
          select: "name email", // choose which owner fields to return
        },
      })
      .exec();

    res.json({ success: true, rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const deletedRoom = await Room.findByIdAndDelete(roomId);

    if (!deletedRoom) {
      return res
        .status(404)
        .json({ success: false, message: "Room not found" });
    }

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const toggleRoomAvailability = async (req, res) => {
  try {
    const { id } = req.params;

    const room = await Room.findById(id);
    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // Toggle availability
    room.isAvailable = !room.isAvailable;
    await room.save();

    return res.json({
      success: true,
      message: "Availability updated",
      isAvailable: room.isAvailable,
    });
  } catch (error) {
    console.error("TOGGLE AVAILABILITY ERROR:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to update availability",
    });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const { roomId } = req.params;

    const {
      roomType,
      description,
      location,
      pricePerNight,
      amenities,
      isAvailable,
    } = req.body;

    // 🔍 Find existing room
    const room = await Room.findById(roomId);

    if (!room) {
      return res.status(404).json({
        success: false,
        message: "Room not found",
      });
    }

    // 🖼️ Handle image updates (optional)
    let images = room.images; // keep old images by default

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => file.filename);
    }

    // 🤖 AI Description (only if description is empty)
    let updatedDescription = description;

    if (!updatedDescription || updatedDescription.trim() === "") {
      const hotel = await Hotel.findById(room.hotel).select("hotelName");
      const hotelName = hotel?.hotelName || "Hotel";

      const promptMessage = ROOM_DESCRIPTION_PROMPT
        .replace("%s", hotelName)
        .replace("%s", roomType || room.roomType)
        .replace("%s", pricePerNight || room.pricePerNight)
        .replace("%s", location || room.location)
        .replace("%s", amenities || room.amenities || "");

      updatedDescription = await promptAI(promptMessage);
    }

    // 🛡️ Fallback description
    updatedDescription =
      updatedDescription && updatedDescription.trim()
        ? updatedDescription
        : room.description;

    // ✏️ Update fields
    room.roomType = roomType || room.roomType;
    room.description = updatedDescription;
    room.location = location || room.location;
    room.pricePerNight = pricePerNight || room.pricePerNight;
    room.amenities = amenities || room.amenities;
    room.isAvailable =
      isAvailable !== undefined ? isAvailable : room.isAvailable;
    room.images = images;

    await room.save();

    return res.status(200).json({
      success: true,
      message: "Room updated successfully",
      room,
    });
  } catch (error) {
    console.error("UPDATE ROOM ERROR:", error);
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};