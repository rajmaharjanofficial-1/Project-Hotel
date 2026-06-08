import React, { useContext, useState } from "react";
import { assets } from "../assets/assets.js";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";

const Navbar = () => {
  const { navigate, user, setUser, axios } = useContext(AppContext);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", path: "/" },
    { name: "Hotels", path: "/hotels" },
    { name: "Rooms", path: "/rooms" },
    { name: "About", path: "/about" },
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout");

      if (data.success) {
        toast.success(data.message);
        setUser(null);
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <nav className="fixed top-0 left-0 w-full z-50 px-6 md:px-16 xl:px-32 py-4 backdrop-blur-lg bg-black/70 border-b border-black/30 shadow-lg flex items-center justify-between transition-all duration-300">
      
      {/* Logo */}
      <Link to="/" className="flex items-center gap-2 z-50">
        <img src={assets.logo} alt="logo" className="h-10" />
      </Link>

      {/* Desktop Nav Links */}
      <div className="hidden md:flex items-center gap-8">
        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            className="relative text-white font-medium hover:text-primary transition-colors group"
          >
            {link.name}
            <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
          </Link>
        ))}
      </div>

      {/* Desktop Right Section */}
   <div className="hidden md:flex items-center gap-4">
  {user ? (
    <div className="relative group z-50 flex items-center gap-2">
      {/* Profile Image */}
      <img
        src={assets.profile_icon}
        alt="Profile"
        className="h-11 w-11 rounded-full cursor-pointer border border-gray-500 shadow-md"
      />
      {/* User Name */}
      <span className="text-white font-medium">{user.name}</span>

      {/* Dropdown Menu */}
      <div
        className="absolute right-0 mt-12 w-44 bg-black/90 backdrop-blur-md shadow-lg rounded-lg
                   opacity-0 invisible translate-y-2
                   group-hover:opacity-100 group-hover:visible group-hover:translate-y-0
                   transition-all duration-200 z-50"
      >
              <ul className="py-2 text-sm text-white">
                <li>
                  <Link
                    to="/my-bookings"
                    className="block px-4 py-2 hover:bg-white/20 rounded-md"
                  >
                    My Bookings
                  </Link>
                </li>
                <li>
                  <button
                    onClick={logout}
                    className="w-full text-left px-4 py-2 hover:bg-red-600/50 rounded-md text-red-400"
                  >
                    Logout
                  </button>
                </li>
              </ul>
            </div>
          </div>
        ) : (
          <button
            onClick={() => navigate("/login")}
            className="px-6 py-2 rounded-full bg-primary text-white font-semibold hover:bg-white hover:text-black transition-all"
          >
            Login
          </button>
        )}
      </div>

      {/* Mobile Menu Button */}
      <div className="md:hidden z-50">
        <svg
          onClick={() => setIsMenuOpen(true)}
          className="h-6 w-6 text-white cursor-pointer"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          viewBox="0 0 24 24"
        >
          <line x1="4" y1="6" x2="20" y2="6" />
          <line x1="4" y1="12" x2="20" y2="12" />
          <line x1="4" y1="18" x2="20" y2="18" />
        </svg>
      </div>

      {/* Mobile Menu */}
      <div
        className={`fixed top-0 left-0 w-full h-screen bg-black/90 backdrop-blur-lg flex flex-col items-center justify-center gap-8 transition-transform duration-500 md:hidden ${
          isMenuOpen ? "translate-x-0" : "-translate-x-full"
        } z-40`}
      >
        <button
          className="absolute top-6 right-6 text-3xl text-white font-bold"
          onClick={() => setIsMenuOpen(false)}
        >
          ✕
        </button>

        {navLinks.map((link, i) => (
          <Link
            key={i}
            to={link.path}
            onClick={() => setIsMenuOpen(false)}
            className="text-white text-xl font-medium hover:text-primary transition-colors"
          >
            {link.name}
          </Link>
        ))}

        {/* Mobile Auth Section */}
        {user ? (
          <>
            <Link
              to="/my-bookings"
              onClick={() => setIsMenuOpen(false)}
              className="border border-white/50 px-6 py-2 rounded-full w-40 text-center text-white hover:bg-primary hover:text-black transition-all"
            >
              My Bookings
            </Link>
            <button
              onClick={() => {
                logout();
                setIsMenuOpen(false);
              }}
              className="border border-red-500 px-6 py-2 rounded-full w-40 text-center text-red-400 hover:bg-red-600/50 hover:text-white transition-all"
            >
              Logout
            </button>
          </>
        ) : (
          <button
            onClick={() => {
              navigate("/login");
              setIsMenuOpen(false);
            }}
            className="border border-white/50 px-6 py-2 rounded-full w-40 text-center text-white hover:bg-primary hover:text-black transition-all"
          >
            Login
          </button>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
