import React, { useContext, useState, useMemo } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useLocation } from "react-router-dom";
import RoomCard from "../components/RoomCard";

/* UI Components */
const CheckBox = ({ label, selected, onChange }) => (
  <label className="flex gap-2 items-center text-sm mt-2 cursor-pointer group">
    <input
      type="checkbox"
      checked={selected}
      onChange={(e) => onChange(e.target.checked)}
      className="accent-blue-500 h-4 w-4"
    />
    <span className="group-hover:text-blue-600 transition-colors">{label}</span>
  </label>
);

const RadioButton = ({ label, selected, onChange }) => (
  <label className="flex gap-2 items-center text-sm mt-2 cursor-pointer group">
    <input
      type="radio"
      checked={selected}
      onChange={() => onChange(label)}
      className="accent-blue-500 h-4 w-4"
    />
    <span className="group-hover:text-blue-600 transition-colors">{label}</span>
  </label>
);

/* Animations */
const containerVariants = {
  hidden: { opacity: 0 },
  show: { 
    opacity: 1, 
    transition: { staggerChildren: 0.1 } 
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 12 } 
  },
};

const headerVariants = {
  hidden: { opacity: 0, y: -50 },
  show: { opacity: 1, y: 0, transition: { duration: 0.8 } },
};

const Rooms = () => {
  const { roomData, navigate } = useContext(AppContext);
  const location = useLocation();

  const selectedLocation = new URLSearchParams(location.search).get("location");

  const [selectedFilters, setSelectedFilters] = useState({
    roomTypes: [],
    priceRanges: [],
  });
  const [selectedSort, setSelectedSort] = useState("");

  const roomTypes = ["Single Bed", "Double Bed", "Luxury Room", "Family Suite"];
  const priceRanges = ["0 to 500", "500 to 1000", "1000 to 2000", "2000 to 4000"];
  const sortOptions = ["Price Low to High", "Price High to Low", "Newest First"];

  const filteredRooms = useMemo(() => {
    return roomData
      .filter((room) => {
        const locationMatch =
          !selectedLocation ||
          room.location?.toLowerCase() === selectedLocation.toLowerCase();

        const typeMatch =
          selectedFilters.roomTypes.length === 0 ||
          selectedFilters.roomTypes.includes(room.roomType);

        const priceMatch =
          selectedFilters.priceRanges.length === 0 ||
          selectedFilters.priceRanges.some((range) => {
            const [min, max] = range.split(" to ").map(Number);
            return room.pricePerNight >= min && room.pricePerNight <= max;
          });

        return locationMatch && typeMatch && priceMatch;
      })
      .sort((a, b) => {
        if (selectedSort === "Price Low to High") return a.pricePerNight - b.pricePerNight;
        if (selectedSort === "Price High to Low") return b.pricePerNight - a.pricePerNight;
        if (selectedSort === "Newest First") return new Date(b.createdAt) - new Date(a.createdAt);
        return 0;
      });
  }, [roomData, selectedFilters, selectedSort, selectedLocation]);

  return (
    <section className="bg-gray-50 min-h-screen">
      {/* Header */}
      <motion.div
        variants={headerVariants}
        initial="hidden"
        animate="show"
        className="bg-white border-b"
      >
        <div className="max-w-7xl mx-auto px-6 py-20 text-center">
          <h1 className="text-5xl lg:text-6xl font-bold text-gray-800">
            {selectedLocation ? `Rooms in ${selectedLocation}` : "Our Rooms"}
          </h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.8 }}
            className="text-gray-500 mt-4 text-lg lg:text-xl max-w-2xl mx-auto"
          >
            Comfort, elegance, and world-class amenities. Discover your perfect stay.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="mt-8 flex justify-center gap-4"
          >
            <button className="px-6 py-3 bg-blue-600 text-white font-medium rounded-lg shadow-md hover:bg-blue-700 transition-all">
              Explore Now
            </button>
          </motion.div>
        </div>
      </motion.div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-6 py-16 lg:py-20 flex flex-col lg:flex-row gap-10">
        {/* Rooms */}
        <div className="flex-1">
          {filteredRooms.length === 0 ? (
            <p className="text-center text-gray-500 mt-12 text-lg">
              No rooms found for this location.
            </p>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8"
            >
              {filteredRooms.map((room) => (
                <motion.div
                  key={room._id}
                  variants={itemVariants}
                  whileHover={{ scale: 1.03, zIndex: 10 }}
                  className="cursor-pointer"
                >
                  <RoomCard room={room} navigate={navigate} />
                </motion.div>
              ))}
            </motion.div>
          )}
        </div>

        {/* Filters */}
        <motion.div
          className="w-full lg:w-80 bg-white border rounded-xl p-6 sticky top-28 h-fit shadow-md"
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
        >
          <h3 className="font-semibold text-lg mb-5 text-gray-700">Filters</h3>

          {/* Room Types */}
          <div className="mb-6">
            <p className="font-medium mb-2 text-gray-600">Room Type</p>
            {roomTypes.map((type) => (
              <CheckBox
                key={type}
                label={type}
                selected={selectedFilters.roomTypes.includes(type)}
                onChange={(checked) =>
                  setSelectedFilters((p) => ({
                    ...p,
                    roomTypes: checked
                      ? [...p.roomTypes, type]
                      : p.roomTypes.filter((t) => t !== type),
                  }))
                }
              />
            ))}
          </div>

          {/* Price Ranges */}
          <div className="mb-6">
            <p className="font-medium mb-2 text-gray-600">Price Range</p>
            {priceRanges.map((range) => (
              <CheckBox
                key={range}
                label={`रू ${range}`}
                selected={selectedFilters.priceRanges.includes(range)}
                onChange={(checked) =>
                  setSelectedFilters((p) => ({
                    ...p,
                    priceRanges: checked
                      ? [...p.priceRanges, range]
                      : p.priceRanges.filter((r) => r !== range),
                  }))
                }
              />
            ))}
          </div>

          {/* Sort */}
          <div>
            <p className="font-medium mb-2 text-gray-600">Sort By</p>
            {sortOptions.map((opt) => (
              <RadioButton
                key={opt}
                label={opt}
                selected={selectedSort === opt}
                onChange={setSelectedSort}
              />
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default Rooms;
