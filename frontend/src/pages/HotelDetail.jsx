import React, { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { Star, MapPin, Phone, Mail } from "lucide-react";

const HotelDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { roomData, hotelsData } = useContext(AppContext);

  const hotel = hotelsData.find((h) => h._id === id);
  const [rooms, setRooms] = useState([]);
  const [sortByPriceHigh, setSortByPriceHigh] = useState(false);

  useEffect(() => {
    const hotelRooms = roomData.filter((r) => r.hotel._id === id);
    setRooms(hotelRooms);
  }, [roomData, id]);

  const handleSort = () => {
    setSortByPriceHigh(!sortByPriceHigh);
    setRooms((prev) =>
      [...prev].sort((a, b) =>
        !sortByPriceHigh
          ? b.pricePerNight - a.pricePerNight
          : a.pricePerNight - b.pricePerNight
      )
    );
  };

  if (!hotel)
    return (
      <p className="text-center py-24 text-gray-500 font-semibold">
        Hotel not found
      </p>
    );

  return (
    <section className="bg-slate-50 min-h-screen py-16">
      <div className="max-w-6xl mx-auto px-6 space-y-8">
        {/* Hotel Header */}
        <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
          <div className="space-y-2">
            <h1 className="text-4xl font-extrabold">{hotel.hotelName}</h1>
            <p className="text-gray-600 flex items-center gap-2">
              <MapPin className="w-4 h-4" /> {hotel.hotelAddress}{" "}
              {hotel.landmark && `• ${hotel.landmark}`}
            </p>

            {/* Contact Info */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 mt-2 text-gray-700">
              {hotel.contact?.phone && (
                <p className="flex items-center gap-1">
                  <Phone className="w-4 h-4 text-green-600" /> {hotel.contact.phone}
                </p>
              )}
              {hotel.contact?.email && (
                <p className="flex items-center gap-1">
                  <Mail className="w-4 h-4 text-blue-600" /> {hotel.contact.email}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3 mt-4 sm:mt-0">
            <Star className="text-yellow-500" />
            <span className="text-lg font-semibold">{hotel.rating || 0}</span>
          </div>
        </div>

        {/* Sort Button */}
        <div className="flex justify-end">
          <button
            onClick={handleSort}
            className="bg-blue-600 text-white px-4 py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow"
          >
            {sortByPriceHigh ? "Sort: Low → High" : "Sort: High → Low"}
          </button>
        </div>

        {/* Rooms Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rooms.length === 0 ? (
            <p className="text-center text-gray-500 col-span-full">
              No rooms available for this hotel.
            </p>
          ) : (
            rooms.map((room, index) => (
              <motion.div
                key={room._id || index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="bg-white rounded-3xl shadow-lg overflow-hidden group hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
              >
                <div className="relative">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${room.images[0]}`}
                    alt={room.roomType}
                    className="h-64 w-full object-cover group-hover:scale-105 transform transition-transform duration-500"
                  />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-lg text-sm font-semibold text-gray-800 shadow-sm">
                    रु{room.pricePerNight}
                    <span className="text-xs text-gray-500"> /night</span>
                  </div>
                </div>
                <div className="p-5 flex flex-col gap-2">
                  <h3 className="text-lg font-bold">{room.roomType}</h3>
                  <p className="text-gray-500 truncate">
                    {room.description || "Luxury room with all amenities."}
                  </p>
                  <button
                    onClick={() => navigate(`/room/${room._id}`)}
                    className="mt-2 w-full bg-blue-600 text-white py-2 rounded-xl hover:bg-blue-700 transition-colors font-semibold shadow"
                  >
                    View Room
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default HotelDetail;
