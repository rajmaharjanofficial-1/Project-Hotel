import React, { useContext, useMemo } from "react";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const MostPicked = () => {
  const { hotelsData } = useContext(AppContext);
  const navigate = useNavigate(); // ✅ initialize navigation

  // Randomly pick 3 hotels using useMemo to avoid reshuffling on every render
  const randomHotels = useMemo(() => {
    if (hotelsData.length <= 3) return hotelsData;

    const shuffled = [...hotelsData].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, 3);
  }, [hotelsData]);

  const handleClick = (id) => {
    navigate(`/hotel/${id}`); // Redirect to hotel detail page
  };

  return (
    <section className="py-16 max-w-7xl mx-auto px-6">
      {/* Heading */}
      <h1 className="text-heading text-3xl md:text-4xl font-bold text-center">
        Hotels We Have
      </h1>

      <p className="text-paragraph text-sm md:text-base text-center max-w-lg mx-auto mt-3 text-gray-600">
        Discover a selection of our finest hotels, perfect for a comfortable stay.
      </p>

      {randomHotels.length === 0 ? (
        <p className="text-center text-gray-500 mt-12">Loading hotels 🏨.....</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 mt-12">
          {randomHotels.map((hotel, index) => (
            <motion.div
              key={hotel._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.03 }}
              className="relative group rounded-2xl overflow-hidden shadow-lg cursor-pointer"
              onClick={() => handleClick(hotel._id)} // ✅ clickable card
            >
              <img
                src={`${import.meta.env.VITE_BACKEND_URL}/images/${hotel.image}`}
                alt={hotel.hotelName}
                className="h-64 w-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              <div
                className="absolute inset-0 flex flex-col justify-end p-4 text-white
                bg-gradient-to-t from-black/80 via-black/40 to-transparent
                opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              >
                <h3 className="text-lg font-semibold">{hotel.hotelName}</h3>
                <p className="text-sm opacity-90">{hotel.hotelAddress}</p>
                {hotel.minPrice && hotel.maxPrice && (
                  <p className="text-base font-medium mt-1">
                    रु {hotel.minPrice} - रु {hotel.maxPrice}
                  </p>
                )}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </section>
  );
};

export default MostPicked;
