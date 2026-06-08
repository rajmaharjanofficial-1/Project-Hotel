import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import axios from "axios";
import RoomCard from "./RoomCard";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.15 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: { opacity: 1, y: 0 },
};

const PopularRooms = () => {
  const [popularRooms, setPopularRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTrendingRooms = async () => {
      try {
        setLoading(true);
        const res = await axios.get("/api/recommendation/trending"); // ✅ your backend route
        if (res.data.success && res.data.rooms) {
          // Pick top 3 rooms
          setPopularRooms(res.data.rooms.slice(0, 3));
        } else {
          setPopularRooms([]);
        }
      } catch (error) {
        console.error("Trending Rooms Fetch Error:", error);
        setPopularRooms([]);
      } finally {
        setLoading(false);
      }
    };

    fetchTrendingRooms();
  }, []);

  if (loading)
    return (
      <p className="text-center text-gray-500 mt-12">
        Loading popular rooms...
      </p>
    );

  if (!popularRooms.length)
    return (
      <p className="text-center text-gray-500 mt-12">
        No popular rooms available
      </p>
    );

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      <h1 className="text-heading text-3xl font-semibold text-center">
        Popular Rooms
      </h1>

      <p className="text-paragraph text-sm text-center max-w-lg mx-auto mt-2">
        Explore our top-rated rooms, loved by guests for comfort and amenities.
      </p>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true }}
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12"
      >
        {popularRooms.map((room) => (
          <motion.div key={room._id} variants={itemVariants}>
            <RoomCard room={room} />
          </motion.div>
        ))}
      </motion.div>
    </section>
  );
};

export default PopularRooms;
