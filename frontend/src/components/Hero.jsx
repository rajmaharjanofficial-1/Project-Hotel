import { motion } from "framer-motion";
import { useState } from "react";
import { assets, homePageData } from "../assets/assets";
import { useAppContext } from "../context/AppContext";

const LOCATIONS = [
  "Lalitpur", "Kathmandu", "Pokhara", "Chitwan", "Lumbini",
  "Nagarkot", "Bhaktapur", "Biratnagar", "Birgunj", "Bharatpur",
  "Butwal", "Nepalgunj", "Mustang", "Manang", "Namche", "Rara",
];

const Hero = () => {
  const { navigate, axios, searchedCities, setSearchedCities } = useAppContext();
  const [destination, setDestination] = useState("");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);

  // ✅ Updated onSearch
  const onSearch = async (e) => {
    e.preventDefault();
    if (!destination) return;

    // Navigate to rooms page
    navigate(`/rooms?location=${encodeURIComponent(destination)}`);

    try {
      // 1️⃣ Store recent search in backend
      await axios.post("/api/recommendation/store", {
        recentSearchedCity: destination,
      });

      // 2️⃣ Update context
      setSearchedCities((prev) => {
        if (!prev.includes(destination)) return [...prev, destination];
        return prev;
      });

      // 3️⃣ Persist in localStorage
      const updatedCities = searchedCities.includes(destination)
        ? searchedCities
        : [...searchedCities, destination];
      localStorage.setItem("searchedCities", JSON.stringify(updatedCities));

    } catch (err) {
      console.error("Error storing recent search:", err);
    }
  };

  return (
    <section className="relative min-h-screen text-white">
      {/* Background */}
      <div className="absolute inset-0 bg-[url('/src/assets/heroImage.jpg')] bg-cover bg-center -z-10" />
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/35 -z-10" />

      <div className="relative min-h-screen flex flex-col justify-center px-6 md:px-16 xl:px-32 -mt-12">
        <p className="bg-[#49B9FF]/50 px-4 py-1 rounded-full w-fit mt-16 text-sm">
          Authentic Nepalese Hospitality
        </p>

        <motion.h1
          className="font-playfair text-3xl md:text-5xl font-extrabold max-w-xl mt-4"
          initial={{ opacity: 0, x: -40 }}
          animate={{ opacity: 1, x: 0 }}
        >
          Forget Busy Work,
          <br />
          Start Your Next Vacation
        </motion.h1>

        <p className="max-w-lg mt-3 text-sm md:text-base text-white/90">
          Enjoy memorable moments with your family across Nepal’s Himalayas,
          culture, and serenity.
        </p>

        {/* Stats */}
        <div className="flex gap-10 mt-7 flex-wrap">
          {homePageData.map((item, index) => (
            <motion.div
              key={index}
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 3, repeat: Infinity }}
              className="flex flex-col items-center"
            >
              <img src={item.icon} alt="" className="w-5 h-5" />
              <div className="flex gap-1 mt-1 text-xs">
                <p className="font-semibold">{item.value}</p>
                <p>{item.title}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Search Form */}
        <form
          onSubmit={onSearch}
          className="mt-8 bg-white/15 backdrop-blur-md border border-white/20 rounded-lg px-4 py-3 max-w-3xl shadow-md"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-3 items-end">
            {/* Location */}
            <div className="md:col-span-2">
              <label className="block text-[11px] mb-1 text-white/70">Location</label>
              <select
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-md text-sm text-black bg-white/90 focus:outline-none focus:ring-1 focus:ring-blue-400"
              >
                <option value="">Select location</option>
                {LOCATIONS.map((city) => (
                  <option key={city}>{city}</option>
                ))}
              </select>
            </div>

            {/* Check-in */}
            <div>
              <label className="block text-[11px] mb-1 text-white/70">Check-in</label>
              <input
                type="date"
                value={checkIn}
                onChange={(e) => setCheckIn(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm text-black bg-white/90 focus:outline-none"
              />
            </div>

            {/* Check-out */}
            <div>
              <label className="block text-[11px] mb-1 text-white/70">Check-out</label>
              <input
                type="date"
                value={checkOut}
                onChange={(e) => setCheckOut(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm text-black bg-white/90 focus:outline-none"
              />
            </div>

            {/* Guests */}
            <div>
              <label className="block text-[11px] mb-1 text-white/70">Guests</label>
              <input
                type="number"
                min={1}
                max={4}
                value={guests}
                onChange={(e) => setGuests(e.target.value)}
                className="w-full px-3 py-2 rounded-md text-sm text-black bg-white/90 focus:outline-none"
              />
            </div>
          </div>

          <div className="mt-3 flex justify-end">
            <button
              type="submit"
              className="px-6 py-2 rounded-md bg-black/90 hover:bg-black transition text-sm font-semibold text-white"
            >
              Search
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default Hero;
