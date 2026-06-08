import React, { useState, useContext } from "react";
import { motion } from "framer-motion";
import { ImagePlus, XCircle, Check } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { toast } from "react-hot-toast";

/* ------------------ CONSTANT DATA ------------------ */
const LOCATIONS = [
  "Lalitpur",
  "Kathmandu",
  "Pokhara",
  "Chitwan",
  "Lumbini",
  "Nagarkot",
  "Bhaktapur",
  "Biratnagar",
  "Birgunj",
  "Bharatpur",
  "Butwal",
  "Nepalgunj",
  "Mustang",
  "Manang",
  "Namche",
  "Rara",
];

const HOTEL_AMENITIES = [
  "📶 Free Wi-Fi",
  "🅿️ Parking",
  "🛎️ 24-Hour Front Desk",
  "🧳 Luggage Storage",
  "🔒 Security / CCTV",
  "🔌 Power Backup",
  "♿ Wheelchair Accessible",
  "🍳 Restaurant",
  "☕ Cafe",
  "🍸 Bar",
  "🥐 Breakfast Included",
  "🍽️ Room Service",
  "🏊 Swimming Pool",
  "💪 Gym / Fitness Center",
  "🧖 Spa",
  "🧘 Yoga / Meditation",
  "🎮 Game Room",
  "🚕 Airport Pickup",
  "🚐 Shuttle Service",
  "🚗 Car Rental",
  "🗺️ Tour Desk",
  "🧑‍💼 Conference Hall",
  "🖨️ Business Center",
  "👶 Child Friendly",
  "🐶 Pet Friendly",
  "🧺 Laundry Service",
  "🧼 Housekeeping",
  "🌳 Garden",
  "🔥 Bonfire",
  "🎶 Live Music",
];

/* ------------------ COMPONENT ------------------ */
const RegisterHotel = () => {
  const { axios, navigate } = useContext(AppContext);

  const [data, setData] = useState({
    hotelName: "",
    hotelAddress: "",
    location: "",
    landmark: "",
    minPrice: "",
    maxPrice: "",
    amenities: [],
    contactPhone: "",
    image: null,
  });

  const [preview, setPreview] = useState(null);

  /* ------------------ HANDLERS ------------------ */
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setData((prev) => ({ ...prev, image: file }));
    setPreview(URL.createObjectURL(file));
  };

  const toggleAmenity = (amenity) => {
    setData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!data.location) return toast.error("Please select a location");
    if (!data.minPrice || !data.maxPrice)
      return toast.error("Please provide min and max price");
    if (Number(data.minPrice) > Number(data.maxPrice))
      return toast.error("Min price cannot be greater than max price");
    if (!data.contactPhone) return toast.error("Please enter contact phone");

    const formData = new FormData();
    formData.append("hotelName", data.hotelName);
    formData.append("hotelAddress", data.hotelAddress);
    formData.append("location", data.location);
    formData.append("landmark", data.landmark);
    formData.append("minPrice", data.minPrice);
    formData.append("maxPrice", data.maxPrice);
    formData.append("amenities", data.amenities.join(","));
    formData.append("contactPhone", data.contactPhone);
    if (data.image) formData.append("image", data.image);

    try {
      const res = await axios.post("/api/hotel/register", formData);
      if (res.data.success) {
        toast.success(res.data.message);
        navigate("/owner");
      } else toast.error(res.data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    }
  };

  /* ------------------ UI ------------------ */
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-3xl mx-auto bg-white rounded-3xl shadow-2xl p-8 space-y-8"
      >
        <h1 className="text-4xl font-extrabold text-center text-gray-800">
          Register Your Hotel 🏨
        </h1>

        {/* IMAGE */}
        <div className="flex flex-col items-center">
          <label className="w-full border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer hover:bg-gray-50">
            <ImagePlus className="mx-auto w-10 h-10 text-gray-400" />
            <p className="text-gray-500 mt-2">Upload Hotel Image</p>
            <input type="file" hidden accept="image/*" onChange={handleImageChange} />
          </label>

          {preview && (
            <div className="relative mt-4 w-full h-56 rounded-xl overflow-hidden">
              <img src={preview} className="w-full h-full object-cover" alt="Preview" />
              <XCircle
                className="absolute top-3 right-3 text-red-500 cursor-pointer"
                onClick={() => {
                  setPreview(null);
                  setData((p) => ({ ...p, image: null }));
                }}
              />
            </div>
          )}
        </div>

        {/* BASIC INFO */}
        <input
          className="input"
          placeholder="Hotel Name"
          value={data.hotelName}
          onChange={(e) => setData({ ...data, hotelName: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Hotel Address"
          value={data.hotelAddress}
          onChange={(e) => setData({ ...data, hotelAddress: e.target.value })}
          required
        />

        <input
          className="input"
          placeholder="Landmark (e.g., Near Pashupatinath)"
          value={data.landmark}
          onChange={(e) => setData({ ...data, landmark: e.target.value })}
          required
        />

        {/* CONTACT PHONE */}
        <input
          type="tel"
          className="input"
          placeholder="Contact Phone"
          value={data.contactPhone}
          onChange={(e) => setData({ ...data, contactPhone: e.target.value })}
          required
        />

        {/* LOCATION */}
        <select
          className="input"
          value={data.location}
          onChange={(e) => setData({ ...data, location: e.target.value })}
          required
        >
          <option value="">Select Location</option>
          {LOCATIONS.map((loc) => (
            <option key={loc} value={loc}>
              {loc}
            </option>
          ))}
        </select>

        {/* PRICE RANGE */}
        <div className="grid grid-cols-2 gap-4">
          <input
            type="number"
            min="0"
            className="input"
            placeholder="Min Price / Night"
            value={data.minPrice}
            onChange={(e) => setData({ ...data, minPrice: e.target.value })}
            required
          />
          <input
            type="number"
            min="0"
            className="input"
            placeholder="Max Price / Night"
            value={data.maxPrice}
            onChange={(e) => setData({ ...data, maxPrice: e.target.value })}
            required
          />
        </div>

        {/* AMENITIES */}
        <div>
          <h3 className="text-xl font-bold mb-3 text-gray-700">
            Hotel Amenities
          </h3>
          <div className="flex flex-wrap gap-3">
            {HOTEL_AMENITIES.map((amenity) => {
              const active = data.amenities.includes(amenity);
              return (
                <button
                  type="button"
                  key={amenity}
                  onClick={() => toggleAmenity(amenity)}
                  className={`px-4 py-2 rounded-full text-sm font-medium border transition
                    ${active
                      ? "bg-indigo-600 text-white border-indigo-600"
                      : "bg-gray-100 text-gray-700 hover:bg-indigo-50"
                    }`}
                >
                  {active && <Check className="inline w-4 h-4 mr-1" />}
                  {amenity}
                </button>
              );
            })}
          </div>
        </div>

        {/* SUBMIT */}
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.97 }}
          className="w-full bg-indigo-600 hover:bg-indigo-700 text-white py-4 rounded-2xl font-semibold text-lg"
        >
          Register Hotel
        </motion.button>
      </motion.form>
    </div>
  );
};

export default RegisterHotel;
