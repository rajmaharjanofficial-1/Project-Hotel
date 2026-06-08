import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import RoomCard from "../components/RoomCard";

const RelatedRoom = ({ roomId }) => {
  const { axios } = useContext(AppContext);

  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSimilarRooms = async () => {
      if (!roomId) return;
      try {
        setLoading(true);
        const { data } = await axios.get(
          `/api/recommendation/similar/${roomId}`
        );
        setRooms(data.rooms || []);
      } catch (err) {
        console.error("Failed to fetch related rooms:", err);
        setRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSimilarRooms();
  }, [roomId, axios]);

  if (loading) {
    return (
      <p className="text-gray-500 py-6 text-center">Loading related rooms...</p>
    );
  }

  if (!rooms.length) {
    return (
      <p className="text-gray-500 py-6 text-center">
        No related rooms found.
      </p>
    );
  }

  return (
    <section className="px-6 md:px-16 lg:px-24 py-10 bg-gray-50">
      <div className="text-center mb-8">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-800">
          Recommend Rooms
        </h2>
        <p className="text-gray-600 mt-1">Rooms similar to what you booked</p>
      </div>

      <div className="flex flex-wrap justify-center gap-6">
        {rooms.map((room, index) => (
          <motion.div
            key={room._id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="relative"
          >
            <RoomCard room={room} index={index} />
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default RelatedRoom;
