import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ImagePlus,
  BedDouble,
  X,
  MapPin,
  Building2,
  IndianRupee,
} from "lucide-react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const MAX_IMAGES = 4;

const AddRoom = () => {
  const { axios, navigate } = useContext(AppContext);

  const [hotels, setHotels] = useState([]);
  const [form, setForm] = useState({
    hotelId: "",
    roomType: "",
    description: "",
    location: "",
    pricePerNight: "",
    amenities: [],
  });
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // ---------------- FETCH OWNER HOTELS ----------------
  const fetchOwnerHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get"); // your owner-only route
      if (data.success) setHotels(data.hotels);
      else toast.error(data.message || "Failed to load hotels");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to load hotels");
    }
  };

  useEffect(() => {
    fetchOwnerHotels();
  }, []);

  // ---------------- IMAGE HANDLERS ----------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > MAX_IMAGES) {
      return setError(`Maximum ${MAX_IMAGES} images allowed`);
    }
    const newPreviews = files.map((file) => URL.createObjectURL(file));
    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
    setError("");
  };

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    return () => previews.forEach((url) => URL.revokeObjectURL(url));
  }, [previews]);

  // ---------------- FORM HANDLERS ----------------
  const handleChange = (e) => {
    const { name, value } = e.target;
    setError("");
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const amenitiesOptions = [
    "📶 Free Wi-Fi (High-Speed)",
"❄️ Air Conditioning",
"🔥 Heater",
"📺 Flat-Screen TV",
"🚿 Hot Shower",
"🛁 Bathtub",
"🧊 Mini Fridge",
"☕ Tea / Coffee Maker",
"🔐 In-Room Safe",
"🛏️ Premium Bedding",
"🪟 Balcony",
"🌄 Mountain View",
"🪞 Dressing Mirror",
"💡 Bedside Reading Lights",
"🔌 Multiple Charging Points",
"🧴 Luxury Toiletries",
"🧺 Wardrobe / Closet",
"🛎️ In-Room Service Access",
"🧼 Daily Housekeeping"
  ];

  const toggleAmenity = (amenity) => {
    setForm((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.hotelId) return setError("Please select your hotel");
    if (!form.roomType) return setError("Room type is required");
    if (!form.location) return setError("Location is required");
    if (!form.pricePerNight) return setError("Price is required");
    if (images.length === 0) return setError("Upload at least 1 image");

    const formData = new FormData();
    Object.entries(form).forEach(([key, value]) =>
      key === "amenities"
        ? formData.append(key, JSON.stringify(value))
        : formData.append(key, value)
    );
    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);
      const { data } = await axios.post("/api/room/add", formData);
      if (data.success) {
        toast.success("Room added successfully");
        navigate("/owner/rooms");
      } else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || "Room creation failed");
    } finally {
      setLoading(false);
    }
  };

  const roomTypeOptions = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const locationOptions = [
    "Kathmandu", "Pokhara", "Chitwan", "Lumbini", "Nagarkot", "Bhaktapur",
    "Biratnagar", "Birgunj", "Bharatpur", "Butwal", "Nepalgunj",
    "Mustang", "Manang", "Namche", "Rara", "Lalitpur"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="mx-auto max-w-3xl bg-white/95 backdrop-blur-md rounded-3xl shadow-xl p-10 space-y-10"
      >
        {/* HEADER */}
        <div className="text-center">
          <BedDouble className="mx-auto w-12 h-12 text-indigo-600 mb-2" />
          <h1 className="text-3xl font-bold text-gray-800">Add New Room</h1>
          <p className="text-gray-500 mt-1">Create and manage your hotel rooms</p>
        </div>

        {/* HOTEL & ROOM TYPE */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="label font-medium text-gray-700">
              <Building2 size={16} className="inline mr-1" /> Hotel
            </label>
            <select
              name="hotelId"
              value={form.hotelId}
              onChange={handleChange}
              className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Your Hotel</option>
              {hotels.map((h) => (
                <option key={h._id} value={h._id}>{h.hotelName}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="label font-medium text-gray-700">Room Type</label>
            <select
              name="roomType"
              value={form.roomType}
              onChange={handleChange}
              className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="">Select Room Type</option>
              {roomTypeOptions.map((type) => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>
        </section>

        {/* LOCATION */}
        <section>
          <label className="label font-medium text-gray-700">
            <MapPin className="inline mr-1" size={16} /> Location
          </label>
          <select
            name="location"
            value={form.location}
            onChange={handleChange}
            className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">Select Location</option>
            {locationOptions.map((loc) => (
              <option key={loc} value={loc}>{loc}</option>
            ))}
          </select>
        </section>

        {/* DESCRIPTION */}
    <section className="space-y-2">
  <label className="font-medium text-gray-700">
    Description
    <span className="text-sm text-gray-400 ml-1">
      (Leave empty to auto-generate)
    </span>
  </label>

  <textarea
    name="description"
    value={form.description || ""}
    onChange={handleChange}
    placeholder="Describe the room... (or leave blank to generate automatically)"
    rows={5}
    className="
      w-full
      rounded-xl
      border
      border-gray-300
      p-3
      text-sm
      shadow-sm
      resize-none
      focus:outline-none
      focus:ring-2
      focus:ring-indigo-500
      focus:border-indigo-500
    "
  />
</section>

        {/* IMAGES */}
        <section>
          <label className="label font-medium text-gray-700">Images ({previews.length}/{MAX_IMAGES})</label>
          <label className="border-2 border-dashed rounded-xl p-5 flex flex-col items-center cursor-pointer bg-gray-50 hover:bg-gray-100 transition shadow-sm">
            <ImagePlus className="w-8 h-8 text-gray-400" />
            <span className="text-sm text-gray-500 mt-1">Upload room images</span>
            <input type="file" multiple accept="image/*" hidden onChange={handleImageChange} />
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mt-4">
            <AnimatePresence>
              {previews.map((src, i) => (
                <motion.div
                  key={src}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  className="relative rounded-xl overflow-hidden shadow-sm"
                >
                  <img src={src} alt="preview" className="h-28 w-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute top-1 right-1 bg-black/70 text-white rounded-full p-1"
                  >
                    <X size={14} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </section>

        {/* AMENITIES */}
        <section>
          <label className="label font-medium text-gray-700">Amenities</label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 max-h-60 overflow-y-auto">
            {amenitiesOptions.map((amenity) => (
              <button
                type="button"
                key={amenity}
                onClick={() => toggleAmenity(amenity)}
                className={`text-sm p-2 rounded-lg border ${
                  form.amenities.includes(amenity)
                    ? "bg-indigo-600 text-white border-indigo-600"
                    : "bg-gray-100 text-gray-700 border-gray-300"
                } hover:bg-indigo-500 hover:text-white transition`}
              >
                {amenity}
              </button>
            ))}
          </div>
        </section>

        {/* PRICE */}
        <section>
          <label className="label font-medium text-gray-700">Price / Night</label>
          <div className="relative">
            <IndianRupee className="absolute left-3 top-3 text-gray-400" />
            <input
              type="number"
              name="pricePerNight"
              value={form.pricePerNight}
              onChange={handleChange}
              placeholder="Enter price per night"
              className="input w-full rounded-xl border-gray-300 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 pl-10"
            />
          </div>
        </section>

        {error && <p className="text-red-600 text-sm text-center">{error}</p>}

        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          disabled={loading}
          type="submit"
          className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold shadow-lg disabled:opacity-60"
        >
          {loading ? "Adding Room..." : "Add Room"}
        </motion.button>
      </motion.form>
    </div>
  );
};

export default AddRoom;
