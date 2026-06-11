import React, { useContext } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";

const Hotels = () => {
  const { hotelsData } = useContext(AppContext);
  const navigate = useNavigate();

  if (!Array.isArray(hotelsData)) return null;

  return (
    <section className="bg-slate-50 min-h-screen">
      {/* Hero Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-6xl mx-auto px-6 py-16 text-center relative">
          <h1 className="text-5xl sm:text-6xl font-extrabold text-gray-800">
            All Hotels
          </h1>
          <p className="text-gray-500 mt-4 max-w-2xl mx-auto text-lg sm:text-xl">
            Discover premium stays, luxury hotels, and curated experiences that
            redefine comfort and style.
          </p>
          <div className="mt-6 h-1 w-24 bg-blue-500 mx-auto rounded-full"></div>
        </div>
      </div>

      {/* Hotels Grid */}
      <div className="max-w-7xl mx-auto px-6 py-14">
        {hotelsData.length === 0 ? (
          <p className="text-center text-gray-500 text-lg">
           🏨 hotels Loading...  
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
            {hotelsData.map((hotel, index) => (
              <motion.div
                key={hotel._id || index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative bg-white rounded-3xl overflow-hidden shadow-lg hover:shadow-2xl transition-shadow duration-500 cursor-pointer"
                onClick={() => navigate(`/hotel/${hotel._id}`)}
              >
                {/* Hotel Image */}
                <div className="relative overflow-hidden rounded-t-3xl">
                  <img
                    src={`${import.meta.env.VITE_BACKEND_URL}/images/${hotel.image}`}
                    alt={hotel.hotelName}
                    className="h-64 sm:h-72 lg:h-80 w-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-4 py-1 rounded-xl text-sm font-semibold text-gray-800 shadow-sm">
                     {hotel.minPrice && hotel.maxPrice
                          ? `रु ${hotel.minPrice} - रु ${hotel.maxPrice}`
                          : `रु ${hotel.price || "N/A"}`}
                    <span className="text-xs font-normal text-gray-500"> /night</span>
                  </div>
                </div>

                {/* Hotel Info */}
                <div className="p-6 sm:p-8 flex flex-col gap-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 truncate">
                    {hotel.hotelName}
                  </h3>
                  <p className="text-gray-500 text-sm sm:text-base">
                    📍 {hotel.hotelAddress}
                  </p>
                  <div className="mt-4">
                    <button className="w-full text-white bg-blue-600 hover:bg-blue-700 transition-colors duration-300 rounded-xl py-3 text-sm sm:text-base font-semibold shadow-lg">
                      View Hotel
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default Hotels;
