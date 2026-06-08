import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import { Star, MapPin, Trash2, Edit2 } from "lucide-react"; // Added Edit2 icon
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const tableRowVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const AllHotels = () => {
  const { navigate, axios } = useContext(AppContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // ---------------- FETCH ALL HOTELS ----------------
  const fetchAllHotels = async () => {
    try {
      const res = await axios.get("/api/hotel/get"); // ✅ Correct backend route
      if (res.data.success) {
        setHotels(res.data.hotels);
      } else {
        toast.error(res.data.message || "No hotels found");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to load hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllHotels();
  }, []);

  // ---------------- DELETE HOTEL ----------------
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this hotel?")) return;
    try {
      const { data } = await axios.delete(`/api/hotel/delete/${id}`);
      if (data.success) {
        toast.success(data.message);
        fetchAllHotels();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  // ---------------- UPDATE HOTEL ----------------
  const handleUpdate = (id) => {
    // Navigate to update form with hotelId as param
    navigate(`/owner/update-hotel/${id}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 bg-white rounded-2xl shadow-xl p-6 flex flex-col md:flex-row justify-between gap-4"
        >
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Hotels Collection</h1>
            <p className="text-gray-600">Manage all registered hotels 🏨</p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => navigate("/owner/register-hotel")}
            className="bg-indigo-600 text-white px-6 py-2 rounded-xl shadow-lg"
          >
            + Register Hotel
          </motion.button>
        </motion.div>

        {/* Content */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {loading ? (
            <p className="text-center py-10 text-gray-500">Loading hotels...</p>
          ) : hotels.length === 0 ? (
            <p className="text-center py-10 text-gray-500">No hotels found 🏨</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                  <tr>
                    {["Hotel", "Location", "Owner", "Price", "Amenities", "Action"].map(
                      (head) => (
                        <th key={head} className="px-6 py-4 text-left font-semibold">
                          {head}
                        </th>
                      )
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y">
                  {hotels.map((hotel, index) => (
                    <motion.tr
                      key={hotel._id}
                      custom={index}
                      variants={tableRowVariant}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ backgroundColor: "#EEF2FF" }}
                    >
                      {/* Hotel */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-4">
                          <img
                            src={`${import.meta.env.VITE_BACKEND_URL}/images/${hotel.image}`}
                            alt={hotel.hotelName}
                            className="w-20 h-16 rounded-xl object-cover shadow"
                          />
                          <span className="font-semibold text-gray-800">{hotel.hotelName}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="px-6 py-4 text-gray-600  items-center gap-2">
                        <MapPin className="w-4 h-4 mt-1" />
                        {hotel.hotelAddress || "N/A"}
                      </td>

                      {/* Owner */}
                      <td className="px-6 py-4 text-gray-600">{hotel.owner?.name || "N/A"}</td>

                      {/* Price */}
                      <td className="px-6 py-4 font-semibold text-indigo-600">
                        {hotel.minPrice && hotel.maxPrice
                          ? `रु ${hotel.minPrice} - रु ${hotel.maxPrice}`
                          : `रु ${hotel.price || "N/A"}`}
                      </td>

                      {/* Amenities */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {Array.isArray(hotel.amenities)
                            ? hotel.amenities.map((item, i) => (
                                <span
                                  key={i}
                                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs"
                                >
                                  {item.trim()}
                                </span>
                              ))
                            : hotel.amenities
                            ? hotel.amenities.split(",").map((item, i) => (
                                <span
                                  key={i}
                                  className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs"
                                >
                                  {item.trim()}
                                </span>
                              ))
                            : "N/A"}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="px-6 py-4 flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleUpdate(hotel._id)}
                          className="flex items-center gap-1 bg-yellow-500 text-white px-4 py-1 rounded-full shadow"
                        >
                          <Edit2 className="w-4 h-4" />
                          Update
                        </motion.button>

                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          onClick={() => handleDelete(hotel._id)}
                          className="flex items-center gap-1 bg-red-600 text-white px-4 py-1 rounded-full shadow"
                        >
                          <Trash2 className="w-4 h-4" />
                          Delete
                        </motion.button>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AllHotels;
