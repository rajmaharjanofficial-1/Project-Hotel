import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../../context/AppContext";
import {
  Trash2,
  BedDouble,
  MapPin,
  Hotel,
  IndianRupee,
  CheckCircle,
  XCircle,
} from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";

const rowVariant = {
  hidden: { opacity: 0, y: 10 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.05 },
  }),
};

const AllRooms = () => {
  const { navigate, axios } = useContext(AppContext);
  const [rooms, setRooms] = useState([]);
  const [hotels, setHotels] = useState([]); // for dropdown
  const [selectedHotel, setSelectedHotel] = useState(""); // selected hotel filter

  /* ---------------- FETCH ROOMS ---------------- */
  const fetchRooms = async (hotelId = "") => {
    try {
      const { data } = await axios.get("/api/room/get");
      if (data.success) {
        let filteredRooms = data.rooms;
        if (hotelId) {
          filteredRooms = filteredRooms.filter(
            (room) => room.hotel?._id === hotelId
          );
        }
        setRooms(filteredRooms);
      } else toast.error(data.message);
    } catch (err) {
      toast.error("Failed to load rooms");
    }
  };

  /* ---------------- FETCH HOTELS ---------------- */
  const fetchHotels = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get");
      if (data.success) setHotels(data.hotels);
    } catch (err) {
      console.error("Failed to fetch hotels");
    }
  };

  useEffect(() => {
    fetchHotels();
    fetchRooms();
  }, []);

  /* ---------------- TOGGLE AVAILABILITY ---------------- */
  const toggleAvailability = async (id) => {
    try {
      const { data } = await axios.patch(`/api/room/toggle-availability/${id}`);
      if (data.success) {
        setRooms((prev) =>
          prev.map((r) => (r._id === id ? { ...r, isAvailable: data.isAvailable } : r))
        );
        toast.success("Availability updated");
      }
    } catch {
      toast.error("Failed to update availability");
    }
  };

  /* ---------------- DELETE ROOM ---------------- */
  const deleteRoom = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    try {
      const { data } = await axios.delete(`/api/room/delete/${id}`);
      if (data.success) {
        setRooms((prev) => prev.filter((r) => r._id !== id));
        toast.success("Room deleted");
      }
    } catch {
      toast.error("Delete failed");
    }
  };

  /* ---------------- HANDLE HOTEL FILTER ---------------- */
  const handleHotelFilter = (hotelId) => {
    setSelectedHotel(hotelId);
    fetchRooms(hotelId);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* HEADER */}
        <div className="bg-white rounded-2xl shadow-xl p-6 flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Room Management</h1>
            <p className="text-gray-500">Manage, enable or disable your hotel rooms</p>
          </div>

          <button
            onClick={() => navigate("/owner/add-room")}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-6 py-3 rounded-xl font-semibold shadow"
          >
            + Add Room
          </button>
        </div>

        {/* HOTEL FILTER DROPDOWN */}
        <div className="flex gap-3 mb-6">
          <select
            value={selectedHotel}
            onChange={(e) => handleHotelFilter(e.target.value)}
            className="border px-3 py-2 rounded w-full max-w-xs"
          >
            <option value="">All Hotels</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.hotelName}
              </option>
            ))}
          </select>
        </div>

        {/* TABLE */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-indigo-600 text-white">
                <tr>
                  {["Room", "Hotel", "Location", "Amenities", "Price", "Status", "Action"].map((h) => (
                    <th key={h} className="px-6 py-4 text-left font-semibold">{h}</th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y">
                {rooms.map((room, index) => {
                  const amenities =
                    typeof room.amenities === "string"
                      ? room.amenities.split(",")
                      : room.amenities || [];

                  return (
                    <motion.tr
                      key={room._id}
                      custom={index}
                      variants={rowVariant}
                      initial="hidden"
                      animate="visible"
                      whileHover={{ backgroundColor: "#EEF2FF" }}
                    >
                      {/* ROOM */}
                      <td className="px-6 py-4">
                        <div className="flex gap-4 items-center">
                          <img
                            src={`http://localhost:4000/images/${room.images?.[0]}`}
                            className="w-20 h-14 rounded-lg object-cover"
                            alt=""
                          />
                          <div>
                            <p className="font-semibold text-gray-800">{room.roomType}</p>
                            <span className="flex items-center gap-1 text-xs text-gray-500">
                              <BedDouble size={14} /> Room
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* HOTEL */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <Hotel size={14} className="text-indigo-600" />
                          {room.hotel?.hotelName || "—"}
                        </div>
                      </td>

                      {/* LOCATION */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-2">
                          <MapPin size={14} className="text-red-500" />
                          {room.location}
                        </div>
                      </td>

                      {/* AMENITIES */}
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-2">
                          {amenities.slice(0, 3).map((a, i) => (
                            <span key={i} className="bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full text-xs font-medium">
                              {a}
                            </span>
                          ))}
                        </div>
                      </td>

                      {/* PRICE */}
                      <td className="px-6 py-4 font-semibold text-green-600">
                        <div className="flex items-center gap-1">
                          <IndianRupee size={14} />
                          {room.pricePerNight}
                        </div>
                      </td>

                      {/* STATUS */}
                      <td className="px-6 py-4">
                        <button
                          onClick={() => toggleAvailability(room._id)}
                          className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold transition
                            ${room.isAvailable ? "bg-green-100 text-green-700 hover:bg-green-200" : "bg-red-100 text-red-700 hover:bg-red-200"}`}
                        >
                          {room.isAvailable ? (
                            <>
                              <CheckCircle size={14} /> Available
                            </>
                          ) : (
                            <>
                              <XCircle size={14} /> Unavailable
                            </>
                          )}
                        </button>
                      </td>

                      {/* ACTION */}
                      <td className="px-6 py-4">
                        
                        <button
                          onClick={() => deleteRoom(room._id)}
                          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-full"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                        
                      </td>
                    </motion.tr>
                  );
                })}
              </tbody>
            </table>

            {rooms.length === 0 && (
              <p className="text-center py-10 text-gray-500">
                No rooms found 🏨
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AllRooms;
