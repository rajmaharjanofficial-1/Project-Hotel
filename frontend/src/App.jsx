import { Routes, Route, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "./context/AppContext";
import { Toaster } from "react-hot-toast";
import { ToastContainer } from "react-toastify";

// Public Pages
import Home from "./pages/Home";
import Hotels from "./pages/Hotels";
import Rooms from "./pages/Rooms";
import SingleRoom from "./pages/SingleRoom";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import MyBookings from "./pages/MyBookings";
import About from "./pages/About";
import HotelDetail from "./pages/HotelDetail";
import PaymentSuccess from "./pages/PaymentSuccess";

// Components
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";

// Owner Pages/Layout
import OwnerLayout from "./pages/owner/OwnerLayout";
import AllHotels from "./pages/owner/AllHotels";
import RegisterHotel from "./pages/owner/RegisterHotel";
import AllRooms from "./pages/owner/AllRooms";
import AddRoom from "./pages/owner/AddRoom";
import Bookings from "./pages/owner/Bookings";
import Report from "./pages/owner/Report";

// Admin Pages/Layout
import AdminLayout from "./pages/admin/AdminLayout";
import ManageUser from "./pages/admin/manageUser";
import AdminHotels from "./pages/admin/adminHotels";
import AddUser from "./pages/admin/addUser";
import UpdateHotel from "./pages/owner/UpdateHotel";

const App = () => {
  const { owner, admin, loading } = useContext(AppContext);
  const location = useLocation();

  // Determine if we are on owner/admin route
  const ownerPath = location.pathname.includes("owner");
  const adminPath = location.pathname.includes("admin");

  // Show loading while auth info is fetched
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  return (
    <div className="w-full max-auto">
      <Toaster />
      {!ownerPath && !adminPath && <Navbar />}

      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/hotels" element={<Hotels />} />
        <Route path="/rooms" element={<Rooms />} />
        <Route path="/room/:id" element={<SingleRoom />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/hotel/:id" element={<HotelDetail />} />
        <Route path="/my-bookings" element={<MyBookings />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />

        {/* Owner Routes with Nested Routes */}
        <Route
          path="/owner/*"
          element={owner ? <OwnerLayout /> : <Login />}
        >
          <Route index element={<AllHotels />} />
          <Route path="register-hotel" element={<RegisterHotel />} />
          <Route path="rooms" element={<AllRooms />} />
          <Route path="add-room" element={<AddRoom />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="report" element={<Report />} />
          <Route path="update-hotel/:hotelId" element={<UpdateHotel />} />
        </Route>

        {/* Admin Routes with Nested Routes */}
        <Route
          path="/admin/*"
          element={admin ? <AdminLayout /> : <Login />}
        >
          <Route index element={<AdminHotels />} />
          <Route path="manageUser" element={<ManageUser />} />
          <Route path="add" element={<AddUser />} />
        </Route>
      </Routes>

      {!ownerPath && !adminPath && <Footer />}
      <ToastContainer />
    </div>
  );
};

export default App;
