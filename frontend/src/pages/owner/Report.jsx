import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import {
  MapPin,
  Calendar,
  User,
  CreditCard,
  CheckCircle,
  Clock,
  XCircle,
} from "lucide-react";
import { toast } from "react-hot-toast";

const Report = ({ hotelId = "" }) => {
  const { axios: axiosInstance } = useContext(AppContext);
  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState(hotelId);

  // ---------------- STATUS HELPERS ----------------
  const getStatusColor = (status) => {
    switch (status) {
      case "confirmed":
        return "text-green-600";
      case "pending":
        return "text-yellow-600";
      case "cancelled":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "confirmed":
        return CheckCircle;
      case "pending":
        return Clock;
      case "cancelled":
        return XCircle;
      default:
        return Clock;
    }
  };

  // ---------------- FETCH HOTELS ----------------
  const fetchOwnerHotels = async () => {
    try {
      const { data } = await axiosInstance.get("/api/hotel/get");
      if (data.success) setHotels(data.hotels);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  // ---------------- FETCH BOOKINGS ----------------
  const fetchBookings = async (hotelId = "") => {
    try {
      let url = "/api/bookings/hotel";
      if (hotelId) url += `?hotelId=${hotelId}`;
      const { data } = await axiosInstance.get(url);
      if (data.success) setBookings(data.bookings);
      else toast.error(data.message);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  useEffect(() => {
    fetchOwnerHotels();
    fetchBookings(selectedHotel);
  }, [selectedHotel]);

  const handleHotelChange = (e) => {
    setSelectedHotel(e.target.value);
  };

  // ---------------- REPORT STATS ----------------
  const reportStats = {
    total: bookings.length,
    confirmed: bookings.filter((b) => b.status === "confirmed").length,
    pending: bookings.filter((b) => b.status === "pending").length,
    cancelled: bookings.filter((b) => b.status === "cancelled").length,
    paid: bookings.filter((b) => b.isPaid).length,
    unpaid: bookings.filter((b) => !b.isPaid).length,
    totalRevenue: bookings
      .filter((b) => b.isPaid)
      .reduce((sum, b) => sum + (b.totalPrice || 0), 0),
  };

  // ---------------- PRINT ----------------
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto bg-white shadow rounded-lg p-6 print:p-0 print:shadow-none">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-3xl font-bold text-gray-800">Bookings Report</h1>
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-indigo-700"
          >
            Print Report
          </button>
        </div>

        {/* HOTEL FILTER */}
        <div className="mb-6 print:hidden">
          <select
            value={selectedHotel}
            onChange={handleHotelChange}
            className="px-4 py-2 rounded-lg border shadow-sm"
          >
            <option value="">All Hotels</option>
            {hotels.map((hotel) => (
              <option key={hotel._id} value={hotel._id}>
                {hotel.hotelName}
              </option>
            ))}
          </select>
        </div>

        {/* SUMMARY */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 border-b pb-4">
          <div>
            <p className="text-sm text-gray-500">Total Bookings</p>
            <p className="font-bold text-lg">{reportStats.total}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Confirmed</p>
            <p className="font-bold text-lg text-green-600">{reportStats.confirmed}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Pending</p>
            <p className="font-bold text-lg text-yellow-600">{reportStats.pending}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Cancelled</p>
            <p className="font-bold text-lg text-red-600">{reportStats.cancelled}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Paid</p>
            <p className="font-bold text-lg text-green-700">{reportStats.paid}</p>
          </div>
          <div>
            <p className="text-sm text-gray-500">Unpaid</p>
            <p className="font-bold text-lg text-red-700">{reportStats.unpaid}</p>
          </div>
          <div className="col-span-2">
            <p className="text-sm text-gray-500">Total Revenue</p>
            <p className="font-bold text-lg text-indigo-600">रु {reportStats.totalRevenue}</p>
          </div>
        </div>

        {/* BOOKINGS TABLE */}
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse">
            <thead className="bg-gray-100 border-b">
              <tr>
                {[
                  "Hotel & Room",
                  "Location",
                  "Booked By",
                  "Dates",
                  "Payment",
                  "Status",
                ].map((head) => (
                  <th
                    key={head}
                    className="px-4 py-2 text-left font-semibold text-sm"
                  >
                    {head}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {bookings.map((booking) => {
                const StatusIcon = getStatusIcon(booking.status);
                return (
                  <tr key={booking._id} className="border-b hover:bg-gray-50">
                    {/* HOTEL & ROOM */}
                    <td className="px-4 py-2">
                      {booking.hotel?.hotelName || booking.room?.hotel?.hotelName || "—"} <br />
                      <span className="text-sm text-blue-600">
                        {booking.room?.roomType || "—"}
                      </span>
                    </td>

                    {/* LOCATION */}
                    <td className="px-4 py-2">
                      {booking.hotel?.hotelAddress || booking.room?.location || "—"}
                    </td>

                    {/* BOOKED BY */}
                    <td className="px-4 py-2">{booking.user?.name || "—"}</td>

                    {/* DATES */}
                    <td className="px-4 py-2 text-sm text-gray-600">
                      {new Date(booking.checkIn).toLocaleDateString()} -{" "}
                      {new Date(booking.checkOut).toLocaleDateString()}
                    </td>

                    {/* PAYMENT */}
                    <td className="px-4 py-2">
                      {booking.paymentMethod || "—"} <br />
                      <span>रु {booking.totalPrice}</span> <br />
                      <span className={booking.isPaid ? "text-green-700" : "text-red-700"}>
                        {booking.isPaid ? "Paid" : "Unpaid"}
                      </span>
                    </td>

                    {/* STATUS */}
                    <td className="px-4 py-2 flex items-center gap-1">
                      <StatusIcon className={getStatusColor(booking.status)} />
                      <span className={getStatusColor(booking.status)}>
                        {booking.status}
                      </span>
                    </td>
                  </tr>
                );
              })}

              {bookings.length === 0 && (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500">
                    No bookings found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* PRINT STYLES */}
      <style>
        {`
          @media print {
            body * {
              visibility: hidden;
            }
            .print\\:block, .print\\:block * {
              visibility: visible;
            }
            .print\\:hidden {
              display: none;
            }
            .print\\:p-0 {
              padding: 0 !important;
            }
          }
        `}
      </style>
    </div>
  );
};

export default Report;
