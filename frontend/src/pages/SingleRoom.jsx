import { useContext, useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { motion } from "framer-motion";
import { toast } from "react-hot-toast";
import {
  Bath,
  Building,
  CheckCircle,
  Eye,
  Star,
  MapPin,
  Coffee,
  Utensils,
  Wifi,
  Car,
  Tv,
  TreePine,
  Calendar,
  Lock,
  Users,
} from "lucide-react";
import RelatedRoom from "./relatedRoom";
const SingleRoom = () => {
  const { roomData, axios, user } = useContext(AppContext);
  const { id } = useParams();
  const navigate = useNavigate();

  const room = roomData.find((r) => r._id === id);
  const today = new Date().toISOString().split("T")[0];

  const [selectedImage, setSelectedImage] = useState(0);
  const [isAvailable, setIsAvailable] = useState(false);
  const [loading, setLoading] = useState(false);

  // ✅ FIXED: added contact
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    persons: 1,
    contact: "",
  });

  useEffect(() => {
    setIsAvailable(false);
  }, [bookingData.checkIn, bookingData.checkOut]);

  if (!room)
    return (
      <p className="text-center py-24 text-gray-500 text-xl font-medium">
        Room not found
      </p>
    );

  const onChangeHandler = (e) => {
    setBookingData({ ...bookingData, [e.target.name]: e.target.value });
  };

  const getAmenityIcon = (amenity) => {
    const icons = {
      "Ocean View": Eye,
      "Mountain View": TreePine,
      "City View": Building,
      "Mini Bar": Coffee,
      "Room Service": Utensils,
      "Free WiFi": Wifi,
      Parking: Car,
      "Smart TV": Tv,
      Jacuzzi: Bath,
      "Breakfast Included": Coffee,
    };
    return icons[amenity] || CheckCircle;
  };

  const getImageUrl = (file) =>
    `${import.meta.env.VITE_BACKEND_URL}/images/${file}`;

  const roomAmenities = Array.isArray(room.amenities)
    ? room.amenities
    : room.amenities?.split(",") || [];

  const checkRoomAvailability = async () => {
    if (!bookingData.checkIn || !bookingData.checkOut) {
      toast.error("Please select valid dates");
      return;
    }
    if (bookingData.checkIn >= bookingData.checkOut) {
      toast.error("Check-out must be after check-in");
      return;
    }

    try {
      const { data } = await axios.post("/api/bookings/check-availability", {
        room: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
      });

      setIsAvailable(data.isAvailable);
      toast[data.isAvailable ? "success" : "error"](
        data.isAvailable ? "Room Available 🎉" : "Room Not Available ❌"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const onSubmitHandler = async (e) => {
    e.preventDefault();

    if (!user) {
      toast.error("Login required to book");
      navigate("/login", { state: { from: `/room/${room._id}` } });
      return;
    }

    // ✅ validate contact
    if (!bookingData.contact) {
      return toast.error("Contact number is required");
    }

    if (!isAvailable) return checkRoomAvailability();

    try {
      setLoading(true);

      // ✅ SEND contact to backend
      const { data } = await axios.post("/api/bookings/book", {
        room: room._id,
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        persons: bookingData.persons,
        contact: bookingData.contact,
        paymentMethod: "Pay At Hotel",
      });

      if (data.success) {
        toast.success("Booking Confirmed 🎉");
        navigate("/my-bookings");
      }
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-24 min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="max-w-7xl mx-auto px-4 space-y-12">

        {/* HEADER */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-3xl shadow-2xl p-8 sm:p-12 flex flex-col sm:flex-row justify-between gap-8 border border-gray-100"
        >
          <div>
            <h2 className="text-gray-400 uppercase tracking-wider font-medium text-sm sm:text-base">
              {room.hotel.hotelName}
            </h2>
            <h1 className="text-3xl sm:text-5xl font-extrabold mt-2">
              {room.roomType}
            </h1>
            <div className="flex items-center gap-2 mt-3 text-gray-600 text-sm sm:text-base">
              <MapPin className="w-4 h-4" /> {room.location}
            </div>
          </div>

          <div className="text-right">
            <div className="flex justify-end items-center gap-1 text-yellow-500 text-lg sm:text-xl">
              <Star className="w-5 h-5 sm:w-6 sm:h-6" /> {room.hotel?.rating || 0}
            </div>
            <p className="text-3xl sm:text-4xl font-bold text-green-600 mt-3">
              रु{room.pricePerNight}{" "}
              <span className="text-base font-normal text-gray-400">/night</span>
            </p>
          </div>
        </motion.div>

        {/* IMAGE GALLERY */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
          <div className="grid lg:grid-cols-3 gap-6">
            <motion.div
              key={selectedImage}
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="lg:col-span-2 overflow-hidden rounded-3xl shadow-lg"
            >
              <motion.img
                src={getImageUrl(room.images[selectedImage])}
                className="w-full h-[260px] sm:h-[360px] lg:h-[480px] object-cover rounded-3xl"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.5 }}
              />
            </motion.div>

            <div className="grid grid-cols-4 lg:grid-cols-1 gap-3">
              {room.images.slice(0, 4).map((img, i) => (
                <motion.img
                  key={i}
                  src={getImageUrl(img)}
                  onClick={() => setSelectedImage(i)}
                  className={`cursor-pointer rounded-2xl object-cover h-20 sm:h-24 lg:h-[100px] shadow-md transition transform hover:scale-105 ${
                    selectedImage === i ? "ring-4 ring-blue-400" : ""
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* DESCRIPTION + AMENITIES + BOOKING */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">

          {/* LEFT COLUMN: DESCRIPTION + AMENITIES */}
          <div className="lg:col-span-2 space-y-6">

            {/* ROOM DESCRIPTION */}
            {room.description && (
              <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
                <h2 className="text-2xl sm:text-3xl font-bold mb-3">Room Description</h2>
                <p className="text-gray-600 text-sm sm:text-base whitespace-pre-line">
                  {room.description}
                </p>
              </div>
            )}

            {/* AMENITIES */}
            <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100">
              <h2 className="text-2xl sm:text-3xl font-bold mb-6">Amenities</h2>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-5">
                {roomAmenities.map((a) => {
                  const Icon = getAmenityIcon(a);
                  return (
                    <div
                      key={a}
                      className="flex items-center gap-3 bg-gray-50 p-4 rounded-2xl shadow hover:shadow-lg transition transform hover:-translate-y-1"
                    >
                      <Icon className="w-6 h-6 text-blue-600" />
                      <span className="font-medium">{a}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: BOOKING */}
          <div className="lg:sticky lg:top-28 bg-white/95 backdrop-blur-sm rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-200">
            <h2 className="text-2xl sm:text-3xl font-bold mb-6 text-center">
              Reserve Your Stay
            </h2>

            {!user && (
              <div className="mb-4 flex items-center gap-2 bg-yellow-50 text-yellow-700 p-3 rounded-lg text-sm sm:text-base">
                <Lock className="w-4 h-4 sm:w-5 sm:h-5" /> Login required to book
              </div>
            )}

            <form onSubmit={onSubmitHandler} className="space-y-4">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="checkIn"
                  min={today}
                  value={bookingData.checkIn}
                  onChange={onChangeHandler}
                  className="w-full pl-10 border p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="relative">
                <Calendar className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="date"
                  name="checkOut"
                  min={bookingData.checkIn || today}
                  value={bookingData.checkOut}
                  onChange={onChangeHandler}
                  className="w-full pl-10 border p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>

              <div className="relative">
                <Users className="absolute left-3 top-3 text-gray-400" />
                <input
                  type="number"
                  min={1}
                  name="persons"
                  value={bookingData.persons}
                  onChange={onChangeHandler}
                  className="w-full pl-10 border p-3 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-400 transition"
                />
              </div>
            <div className="relative">

   <input
                type="tel"
                name="contact"
                placeholder="Contact Number *"
                value={bookingData.contact}
                onChange={onChangeHandler}
                className="w-full border p-3 rounded-xl"
              />
</div>

              <motion.button
                whileTap={{ scale: 0.95 }}
                whileHover={{ scale: 1.02 }}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white py-4 rounded-2xl text-lg sm:text-xl font-semibold shadow-lg transition"
              >
                {loading
                  ? "Processing..."
                  : isAvailable
                  ? "BOOK NOW"
                  : "CHECK AVAILABILITY"}
              </motion.button>
            </form>
          </div>
        </div>

        {/* RELATED ROOMS */}
        <div className="bg-white rounded-3xl shadow-2xl p-6 sm:p-8 border border-gray-100 mt-12">
          <RelatedRoom roomId={room._id} />
        </div>

      </div>
    </div>
  );
};

export default SingleRoom;
