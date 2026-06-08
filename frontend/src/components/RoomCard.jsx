import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const RoomCard = ({ room }) => {
  const navigate = useNavigate();

  // ✅ Use the first image from room.images array
  let firstImage = "/placeholder-room.jpg";

  if (room?.images && room.images.length > 0) {
    firstImage = `${import.meta.env.VITE_BACKEND_URL}/images/${room.images[0]}`;
  }

  return (
    <motion.div
      whileHover={{ y: -10 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="cursor-pointer"
    >
      <div className="group max-w-80 rounded-2xl overflow-hidden bg-white shadow-md hover:shadow-2xl transition-all duration-300">

        {/* Image */}
        <div className="relative overflow-hidden">
          <img
            src={firstImage}
            alt={room?.roomType || "Room"}
            className="w-full h-56 object-cover transition-transform duration-500 group-hover:scale-110"
            onError={(e) => {
              e.currentTarget.src = "/placeholder-room.jpg";
            }}
            loading="lazy"
          />

          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

          {/* Price badge */}
          <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-lg text-sm font-semibold shadow">
            रु{room?.pricePerNight} <span className="text-xs font-normal text-gray-500">/ night</span>
          </div>
        </div>

        {/* Content */}
        <div className="p-4">
          <h2 className="truncate text-lg font-semibold">{room?.roomType}</h2>
          <p className="mt-1 text-sm text-gray-500 line-clamp-2">
            {room?.description}
          </p>

          <button
            onClick={() => {
              navigate(`/room/${room._id}`);
              window.scrollTo({ top: 0, behavior: "smooth" });
            }}
            className="mt-4 w-full rounded-lg bg-primary py-2 text-white transition-all duration-300 hover:bg-primary/90 active:scale-[0.98]"
          >
            View Details
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default RoomCard;
