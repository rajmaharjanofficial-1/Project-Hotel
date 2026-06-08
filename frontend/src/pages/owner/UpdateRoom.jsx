import React, { useContext, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ImagePlus, BedDouble, X, MapPin, Building2, IndianRupee } from "lucide-react";
import { AppContext } from "../../context/AppContext";
import { useParams } from "react-router-dom";
import toast from "react-hot-toast";

const MAX_IMAGES = 4;

const UpdateRoom = () => {
  const { axios, navigate } = useContext(AppContext);
  const { roomId } = useParams();

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
  const [existingImages, setExistingImages] = useState([]);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // ---------------- FETCH DATA ----------------
  const fetchData = async () => {
    try {
      const [hotelRes, roomRes] = await Promise.all([
        axios.get("/api/hotel/get"),
        axios.get(`/api/room/get-all`),
      ]);

      if (hotelRes.data.success) setHotels(hotelRes.data.hotels);

      const room = roomRes.data.rooms.find(r => r._id === roomId);

      if (!room) return toast.error("Room not found");

      setForm({
        hotelId: room.hotel._id,
        roomType: room.roomType,
        description: room.description,
        location: room.location,
        pricePerNight: room.pricePerNight,
        amenities: room.amenities || [],
      });

      setExistingImages(room.images || []);
    } catch (err) {
      toast.error("Failed to load data");
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // ---------------- IMAGE HANDLERS ----------------
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);

    if (images.length + files.length + existingImages.length > MAX_IMAGES) {
      return setError(`Maximum ${MAX_IMAGES} images allowed`);
    }

    const newPreviews = files.map((file) => URL.createObjectURL(file));

    setImages((prev) => [...prev, ...files]);
    setPreviews((prev) => [...prev, ...newPreviews]);
  };

  const removeNewImage = (index) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const removeExistingImage = (index) => {
    setExistingImages(prev => prev.filter((_, i) => i !== index));
  };

  // ---------------- FORM ----------------
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

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

    const formData = new FormData();

    Object.entries(form).forEach(([key, value]) =>
      key === "amenities"
        ? formData.append(key, JSON.stringify(value))
        : formData.append(key, value)
    );

    images.forEach((img) => formData.append("images", img));

    try {
      setLoading(true);

      const { data } = await axios.put(`/api/room/update/${roomId}`, formData);

      if (data.success) {
        toast.success("Room updated successfully");
        navigate("/owner/rooms");
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Update failed");
    } finally {
      setLoading(false);
    }
  };

  // ---------------- UI ----------------
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-3xl mx-auto bg-white p-10 rounded-3xl shadow-xl space-y-6"
      >
        <h1 className="text-2xl font-bold text-center">Update Room</h1>

        {/* HOTEL */}
        <select name="hotelId" value={form.hotelId} onChange={handleChange} className="input w-full">
          <option value="">Select Hotel</option>
          {hotels.map(h => (
            <option key={h._id} value={h._id}>{h.hotelName}</option>
          ))}
        </select>

        {/* ROOM TYPE */}
        <input name="roomType" value={form.roomType} onChange={handleChange} placeholder="Room Type" className="input w-full" />

        {/* LOCATION */}
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="input w-full" />

        {/* DESCRIPTION */}
        <textarea name="description" value={form.description} onChange={handleChange} className="input w-full" />

        {/* PRICE */}
        <input type="number" name="pricePerNight" value={form.pricePerNight} onChange={handleChange} className="input w-full" />

        {/* EXISTING IMAGES */}
        <div className="grid grid-cols-3 gap-3">
          {existingImages.map((img, i) => (
            <div key={i} className="relative">
              <img src={`/uploads/${img}`} className="h-24 w-full object-cover rounded" />
              <button onClick={() => removeExistingImage(i)} className="absolute top-1 right-1 bg-black text-white p-1">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        {/* NEW IMAGES */}
        <input type="file" multiple onChange={handleImageChange} />

        <div className="grid grid-cols-3 gap-3">
          {previews.map((src, i) => (
            <div key={i} className="relative">
              <img src={src} className="h-24 w-full object-cover rounded" />
              <button onClick={() => removeNewImage(i)} className="absolute top-1 right-1 bg-black text-white p-1">
                <X size={12} />
              </button>
            </div>
          ))}
        </div>

        <button className="w-full bg-indigo-600 text-white py-3 rounded-xl">
          {loading ? "Updating..." : "Update Room"}
        </button>
      </motion.form>
    </div>
  );
};

export default UpdateRoom;