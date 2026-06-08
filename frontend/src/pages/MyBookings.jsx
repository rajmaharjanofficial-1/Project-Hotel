import React, { useContext, useEffect, useState } from "react";
import { AppContext } from "../context/AppContext";
import { MapPin, Calendar, User, CreditCard, CheckCircle, Clock, XCircle, Trash2 } from "lucide-react";
import { toast } from "react-hot-toast";

const MyBookings = () => {
  const { axios } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [loadingCancel, setLoadingCancel] = useState(null);
  const [loadingPay, setLoadingPay] = useState(null);

  const fetchBookings = async () => {
    try {
      const { data } = await axios.get("/api/bookings/user");
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  useEffect(() => { fetchBookings(); }, [axios]);

  const handlePayNow = async (bookingId) => {
    try {
      setLoadingPay(bookingId);
      const { data } = await axios.post("/api/payment/khalti/initiate", { bookingId });

      if (data.success && data.payment_url) window.location.href = data.payment_url;
      else toast.error("Unable to initiate payment");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally { setLoadingPay(null); }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm("Are you sure you want to cancel this booking?")) return;
    try {
      setLoadingCancel(bookingId);
      const { data } = await axios.patch(`/api/bookings/cancel/${bookingId}`);
      if (data.success) {
        setBookings(prev => prev.map(b => (b._id === bookingId ? { ...b, status: "cancelled" } : b)));
        toast.success("Booking cancelled");
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    } finally { setLoadingCancel(null); }
  };

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "cancelled": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status?.toLowerCase()) {
      case "confirmed": return CheckCircle;
      case "pending": return Clock;
      case "cancelled": return XCircle;
      default: return Clock;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-24">
      <div className="max-w-7xl mx-auto px-6">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-6">My Bookings</h1>
        <div className="bg-white shadow rounded-xl overflow-hidden">
          <div className="hidden md:grid grid-cols-12 bg-gray-50 px-6 py-4 font-semibold text-gray-700">
            <div className="col-span-4">Hotel & Room</div>
            <div className="col-span-2">Dates</div>
            <div className="col-span-2">Guests</div>
            <div className="col-span-2">Payment</div>
            <div className="col-span-1">Status</div>
            <div className="col-span-1">Action</div>
          </div>

          <div className="divide-y">
            {bookings.length === 0 && <p className="p-6 text-center text-gray-500">No bookings found</p>}

            {bookings.map((booking) => {
              const StatusIcon = getStatusIcon(booking.status);
              return (
                <div key={booking._id} className="p-6 hover:bg-gray-50 grid grid-cols-1 md:grid-cols-12 gap-4 items-center">
                  {/* Hotel */}
                  <div className="md:col-span-4 flex gap-4">
                    <img
                      src={booking.room?.images?.[0] ? `${import.meta.env.VITE_BACKEND_URL}/images/${booking.room.images[0]}` : "/placeholder-room.jpg"}
                      className="w-20 h-20 rounded-lg object-cover"
                    />
                    <div>
                      <h3 className="font-semibold">{booking.room?.hotel?.name}</h3>
                      <p className="text-blue-600">{booking.room?.roomType}</p>
                      <div className="flex items-center gap-1 text-sm text-gray-500">
                        <MapPin size={14} /> {booking.room?.hotel?.hotelAddress}
                      </div>
                    </div>
                  </div>

                  {/* Dates */}
                  <div className="md:col-span-2 text-sm text-gray-600">
                    <div><Calendar size={14} /> {new Date(booking.checkIn).toLocaleDateString()}</div>
                    <div><Calendar size={14} /> {new Date(booking.checkOut).toLocaleDateString()}</div>
                  </div>

                  {/* Guests */}
                  <div className="md:col-span-2 text-sm"><User size={14} /> {booking.persons} Guests</div>

                  {/* Payment */}
                  <div className="md:col-span-2 text-sm">
                    <div className="flex items-center gap-1"><CreditCard size={14} /> {booking.paymentMethod || "Pay at Hotel"}</div>
                    <div className="font-semibold">रु {booking.totalPrice}</div>
                    {!booking.isPaid && booking.status !== "cancelled" && (
                      <button onClick={() => handlePayNow(booking._id)} disabled={loadingPay === booking._id} className="mt-2 px-3 py-1 bg-purple-600 text-white text-xs rounded hover:bg-purple-700">
                        {loadingPay === booking._id ? "Redirecting..." : "Pay with Khalti"}
                      </button>
                    )}
                    {booking.isPaid && <span className="inline-block mt-1 px-2 py-1 text-xs rounded bg-green-100 text-green-800">Paid</span>}
                  </div>

                  {/* Status */}
                  <div className="md:col-span-1 flex items-center gap-1">
                    <StatusIcon size={16} />
                    <span className={`${getStatusColor(booking.status)} px-2 py-1 text-xs rounded-full`}>{booking.status}</span>
                  </div>

                  {/* Action */}
                  <div className="md:col-span-1">
                    {booking.status !== "cancelled" && !booking.isPaid && (
                      <button onClick={() => handleCancelBooking(booking._id)} disabled={loadingCancel === booking._id} className="flex items-center gap-1 text-sm text-red-600">
                        <Trash2 size={14} /> {loadingCancel === booking._id ? "Canceling..." : "Cancel"}
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default MyBookings;
