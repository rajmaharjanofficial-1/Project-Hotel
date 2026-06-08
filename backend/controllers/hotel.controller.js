import Hotel from "../models/hotel.model.js";

// ------------------- REGISTER HOTEL -------------------
export const registerHotel = async (req, res) => {
  const { id } = req.user; // owner ID

  try {
    const {
      hotelName,
      hotelAddress,
      location,
      landmark,
      minPrice,
      maxPrice,
      amenities,
      contactPhone,
    } = req.body;

    if (
      !hotelName ||
      !hotelAddress ||
      !location ||
      !minPrice ||
      !maxPrice ||
      !amenities ||
      !contactPhone
    ) {
      return res.status(400).json({
        message: "All required fields must be provided",
        success: false,
      });
    }

    const image = req.file?.filename || null; // optional image

    const newHotel = new Hotel({
      hotelName,
      hotelAddress,
      location,
      landmark: landmark || "",
      minPrice: Number(minPrice),
      maxPrice: Number(maxPrice),
      amenities:
        typeof amenities === "string" ? amenities.split(",") : amenities, // support CSV from form
      image,
      owner: id,
      contact: {
        phone: contactPhone,
      },
    });

    await newHotel.save();

    return res.status(201).json({
      message: "Hotel Registered Successfully",
      success: true,
      hotel: newHotel,
    });
  } catch (error) {
    console.error("Register Hotel Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ------------------- GET OWNER HOTELS -------------------
export const getOwnerHotels = async (req, res) => {
  try {
    const ownerId = req.user.id;

    const hotels = await Hotel.find({ owner: ownerId }).populate(
      "owner",
      "name"
    );

    return res.status(200).json({ hotels, success: true });
  } catch (error) {
    console.error("Get Owner Hotels Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      success: false,
      error: error.message,
    });
  }
};

// ------------------- GET ALL HOTELS -------------------
export const getAllHotels = async (req, res) => {
  try {
    const hotels = await Hotel.find().populate("owner", "name");
    return res.status(200).json({ hotels, success: true });
  } catch (error) {
    console.error("Get All Hotels Error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message,
    });
  }
};

// ------------------- DELETE HOTEL -------------------
export const deleteHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const deletedHotel = await Hotel.findByIdAndDelete(hotelId);

    if (!deletedHotel) {
      return res.status(404).json({ message: "Hotel not found", success: false });
    }

    return res.status(200).json({ message: "Hotel deleted successfully", success: true });
  } catch (error) {
    console.error("Delete Hotel Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};

// ------------------- UPDATE HOTEL -------------------
export const updateHotel = async (req, res) => {
  const { hotelId } = req.params;
  try {
    const {
      hotelName,
      hotelAddress,
      location,
      landmark,
      minPrice,
      maxPrice,
      amenities,
      contactPhone,
    } = req.body;

    const image = req.file?.filename;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found", success: false });
    }

    // Update fields if provided
    if (hotelName) hotel.hotelName = hotelName;
    if (hotelAddress) hotel.hotelAddress = hotelAddress;
    if (location) hotel.location = location;
    if (landmark) hotel.landmark = landmark;
    if (minPrice) hotel.minPrice = Number(minPrice);
    if (maxPrice) hotel.maxPrice = Number(maxPrice);
    if (amenities)
      hotel.amenities =
        typeof amenities === "string" ? amenities.split(",") : amenities;
    if (image) hotel.image = image;
    if (contactPhone) hotel.contact.phone = contactPhone;

    await hotel.save();

    return res.status(200).json({
      message: "Hotel updated successfully",
      success: true,
      hotel,
    });
  } catch (error) {
    console.error("Update Hotel Error:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};
