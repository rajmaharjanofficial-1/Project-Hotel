import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { CheckCircle, Clock, XCircle, Printer } from "lucide-react";
import { toast } from "react-hot-toast";

const Bookings = () => {
  const { axios: axiosInstance } = useContext(AppContext);

  const [bookings, setBookings] = useState([]);
  const [hotels, setHotels] = useState([]);
  const [selectedHotel, setSelectedHotel] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [loading, setLoading] = useState(true);

  /* ---------------- STATUS HELPERS ---------------- */
  const getStatusIcon = (status) => {
    if (status === "confirmed") return CheckCircle;
    if (status === "cancelled") return XCircle;
    return Clock;
  };

  const getStatusColor = (status) => {
    if (status === "confirmed") return "text-green-600";
    if (status === "cancelled") return "text-red-600";
    return "text-yellow-600";
  };

  /* ---------------- FETCH HOTELS ---------------- */
  const fetchOwnerHotels = async () => {
    try {
      const { data } = await axiosInstance.get("/api/hotel/get");
      if (data.success) setHotels(data.hotels);
    } catch {
      toast.error("Failed to load hotels");
    }
  };

  /* ---------------- FETCH BOOKINGS ---------------- */
  const fetchBookings = async (hotelId = "") => {
    setLoading(true);
    try {
      let url = "/api/bookings/hotel";
      if (hotelId) url += `?hotelId=${hotelId}`;
      const { data } = await axiosInstance.get(url);
      if (data.success) setBookings(data.bookings);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOwnerHotels();
    fetchBookings();
  }, []);

  /* ---------------- FILTER BOOKINGS ---------------- */
  const filteredBookings = bookings.filter((b) => {
    const ci = new Date(b.checkIn);
    const co = new Date(b.checkOut);
    if (startDate && co < new Date(startDate)) return false;
    if (endDate && ci > new Date(endDate)) return false;
    return true;
  });

  /* ---------------- OWNER ACTIONS (API BASED) ---------------- */
  const markAsPaid = async (bookingId) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/bookings/paid/${bookingId}`
      );

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, isPaid: true } : b
          )
        );
        toast.success("Marked as paid");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to mark paid");
    }
  };

  const markAsConfirmed = async (bookingId) => {
    try {
      const { data } = await axiosInstance.put(
        `/api/bookings/confirm/${bookingId}`
      );

      if (data.success) {
        setBookings((prev) =>
          prev.map((b) =>
            b._id === bookingId ? { ...b, status: "confirmed" } : b
          )
        );
        toast.success("Booking confirmed");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to confirm booking");
    }
  };

  /* ---------------- STATS ---------------- */
  const activeBookings = filteredBookings.filter(
    (b) => b.status !== "cancelled"
  );

  const stats = {
    total: filteredBookings.length,
    confirmed: filteredBookings.filter((b) => b.status === "confirmed").length,
    pending: filteredBookings.filter((b) => b.status === "pending").length,
    cancelled: filteredBookings.filter((b) => b.status === "cancelled").length,
    paidAmount: activeBookings
      .filter((b) => b.isPaid)
      .reduce((s, b) => s + (b.totalPrice || 0), 0),
    unpaidAmount: activeBookings
      .filter((b) => !b.isPaid)
      .reduce((s, b) => s + (b.totalPrice || 0), 0),
  };

  /* ---------------- PRINT ---------------- */
const handlePrint = () => {
  const table = document.getElementById("booking-report");
  if (!table) return;

  // Clone table
  const clonedTable = table.cloneNode(true);

  // ❌ Remove all buttons (Mark Paid, Confirm)
  const buttons = clonedTable.querySelectorAll("button");
  buttons.forEach((btn) => btn.remove());

  // ✅ Add S.N column in header
  const headerRow = clonedTable.querySelector("thead tr");
  const snHeader = document.createElement("th");
  snHeader.innerText = "S.N";
  headerRow.insertBefore(snHeader, headerRow.firstChild);

  // ✅ Add serial numbers in rows
  const rows = clonedTable.querySelectorAll("tbody tr");
  rows.forEach((row, index) => {
    const td = document.createElement("td");
    td.innerText = index + 1;
    row.insertBefore(td, row.firstChild);
  });

  // Get hotel name
  const hotelName =
    hotels.find((h) => h._id === selectedHotel)?.hotelName || "All Hotels";

  // Open print window
  const win = window.open("", "_blank");

  win.document.write(`
    <html>
      <head>
        <title>Booking Report</title>
        <style>
          body { font-family: "Segoe UI", Arial; padding: 40px; background:#f9fafb; }
          .container { background:white; padding:30px; border-radius:12px; }
          h1, p { text-align:center; margin:5px 0; }
          .summary { display:flex; justify-content:space-between; margin:20px 0; }
          .card { flex:1; margin:0 8px; padding:15px; border-radius:10px; text-align:center; background:#eef2ff; }
          table { width:100%; border-collapse:collapse; margin-top:20px; }
          th { background:#4f46e5; color:white; padding:10px; }
          td { padding:10px; border-bottom:1px solid #ddd; text-align:center; }
        </style>
      </head>
      <body>
        <div class="container">
          <h1>Hotel Booking Report</h1>
          <p><b>Hotel:</b> ${hotelName}</p>
          <p>Report: ${startDate || "-"} → ${endDate || "-"}</p>

          <div class="summary">
            <div class="card"><b>Total Paid</b><br/> रु ${stats.paidAmount}</div>
            <div class="card"><b>Total Unpaid</b><br/> रु ${stats.unpaidAmount}</div>
            <div class="card"><b>Total Cancelled</b><br/> ${stats.cancelled}</div>
            <div class="card"><b>Total Bookings</b><br/> ${stats.total}</div>
          </div>

          ${clonedTable.outerHTML}
        </div>
      </body>
    </html>
  `);

  win.document.close();

  win.onload = () => {
    win.focus();
    win.print();
  };
};

  return (
    <div className="min-h-screen bg-gray-100 py-10">
      <div className="max-w-7xl mx-auto px-4">
        {/* HEADER */}
        <div className="flex justify-between items-center mb-6 print:hidden">
          <h1 className="text-3xl font-bold">Bookings Dashboard</h1>
          <button
            onClick={handlePrint}
            className="bg-indigo-600 text-white px-4 py-2 rounded flex gap-2"
          >
            <Printer size={16} /> Print
          </button>
        </div>

        {/* FILTERS */}
        <div className="flex gap-3 mb-6 print:hidden">
          <select
            value={selectedHotel}
            onChange={(e) => {
              setSelectedHotel(e.target.value);
              fetchBookings(e.target.value);
            }}
            className="border px-3 py-2 rounded"
          >
            <option value="">All Hotels</option>
            {hotels.map((h) => (
              <option key={h._id} value={h._id}>
                {h.hotelName}
              </option>
            ))}
          </select>

          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className="border px-2 rounded"
          />
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="border px-2 rounded"
          />
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 print:hidden">
          <Stat title="Total" value={stats.total} />
          <Stat title="Confirmed" value={stats.confirmed} />
          <Stat title="Pending" value={stats.pending} />
          <Stat title="Cancelled" value={stats.cancelled} />
          <Stat title="Paid Amount" value={`रु ${stats.paidAmount}`} />
          <Stat title="Unpaid Amount" value={`रु ${stats.unpaidAmount}`} />
        </div>

        {/* TABLE */}
        <div
          id="booking-report"
          className="bg-white rounded shadow overflow-x-auto"
        >
          {loading ? (
            <p className="p-10 text-center">Loading...</p>
          ) : (
            <table className="min-w-full">
              <thead>
                <tr>
                  
                  <th>Hotel</th>
                  <th>Room</th>
                  <th>Guest</th>
                  <th>Guest Contact</th>
                  <th>Dates</th>
                  <th>Payment</th>
                  <th>Status</th>
      
                </tr>
              </thead>
              <tbody>
                {filteredBookings.map((b) => {
                  const Icon = getStatusIcon(b.status);
                  return (
                    <tr key={b._id} className="border-b hover:bg-gray-50">
                      
                      <td>{b.hotel?.hotelName}</td>
                      <td>{b.room?.roomType}</td>
                      <td>{b.user?.name}</td>
                      <td>{b.contact || "N/A"}</td>
                      <td>
                        {new Date(b.checkIn).toLocaleDateString()} →{" "}
                        {new Date(b.checkOut).toLocaleDateString()}
                      </td>
                      <td>
                        {b.status === "cancelled" ? (
                          <span className="text-red-600">Cancelled</span>
                        ) : b.isPaid ? (
                          <span className="text-green-600">
                            रु {b.totalPrice} (Paid)
                          </span>
                        ) : (
                          <>
                            रु {b.totalPrice} (Unpaid)
                            <button
                              onClick={() => markAsPaid(b._id)}
                              className="ml-2 text-sm text-green-600 hover:underline"
                            >
                              Mark Paid
                            </button>
                          </>
                        )}
                      </td>
                      <td className={getStatusColor(b.status)}>
                        <Icon size={14} /> {b.status}
                        {b.status === "pending" && (
                          <button
                            onClick={() => markAsConfirmed(b._id)}
                            className="ml-2 text-sm text-blue-600 hover:underline"
                          >
                            Confirm
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

/* ---------------- STAT CARD ---------------- */
const Stat = ({ title, value }) => (
  <div className="bg-white p-4 rounded shadow text-center">
    <p className="text-sm text-gray-500">{title}</p>
    <p className="text-xl font-bold">{value}</p>
  </div>
);

export default Bookings;
