import { useState, useEffect } from "react";
import { useAppContext } from "../context/AppContext";
import RoomCard from "./RoomCard";
import axios from "axios";

const RecommendedRooms = () => {
  const { user } = useAppContext(); // get logged-in user
  

  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecommendations = async () => {
      // ✅ If user is not logged in, do nothing
      if (!user  || !user._id) {
        setRecommended([]);
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Fetch personalized rooms for the user
        const res = await axios.get(`/api/recommendation/user/${user._id}`, {
          headers: { Authorization: `Bearer ` },
        });

        // Rooms come with `alreadyBooked` flag from backend
        setRecommended(res.data?.rooms || []);
        console.log("Fetched recommended rooms:", res.data?.rooms);
      } catch (err) {
        console.error("Recommendation fetch error:", err);
        setRecommended([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [user]);

  // ✅ Show loading state
  if (loading) {
    return (
      <div className="flex justify-center py-20 text-gray-500">
        Loading recommended rooms...
      </div>
    );
  }

  // ✅ Show nothing if no recommendations
  if (!recommended.length) return null;

  return (
    <section className="px-6 md:px-16 lg:px-24 py-20 bg-gray-50">
      {/* Section header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800">
          Recommended Rooms
        </h2>
        <p className="mt-2 text-gray-600">
          Based on your past bookings, we picked these rooms for you
        </p>
      </div>

      {/* Rooms grid */}
      <div className="flex flex-wrap justify-center gap-6">
        {recommended.map((room, index) => (
          <div key={room._id} className="relative w-full sm:w-[48%] md:w-[31%]">
            {/* Show badge if room is already booked */}
            {room.alreadyBooked && (
              <span className="absolute top-2 left-2 bg-red-500 text-white px-2 py-1 text-xs rounded z-10">
                Already Booked
              </span>
            )}
            <RoomCard room={room} index={index} />
          </div>
        ))}
      </div>
    </section>
  );
};

export default RecommendedRooms;
