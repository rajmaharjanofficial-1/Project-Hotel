import { createContext, useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-hot-toast";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_BACKEND_URL;

// Create context
export const AppContext = createContext();

// Provider
const AppContextProvider = ({ children }) => {
  const navigate = useNavigate();

  // ---------------- User, Owner & Admin ----------------
  const [user, setUser] = useState(null);
  const [owner, setOwner] = useState(null);
  const [admin, setAdmin] = useState(null);

  // ---------------- Hotels & Rooms ----------------
  const [hotelsData, setHotelsData] = useState([]);
  const [roomData, setRoomData] = useState([]);

  // ---------------- Recent searched cities ----------------
  const [searchedCities, setSearchedCities] = useState(
    JSON.parse(localStorage.getItem("searchedCities")) || []
  );
  const [recentSearchedCities, setRecentSearchedCities] = useState([]);

  // ---------------- Check if logged in ----------------
  const checkUserLoggedIn = async () => {
    try {
      const { data } = await axios.get("/api/user/is-auth");
      if (data.success) setUser(data.user);
    } catch (error) {
      console.log("User auth check error:", error);
    }
  };

  const checkOwnerLoggedIn = async () => {
    try {
      const { data } = await axios.get("/api/owner/is-auth");
      if (data.success) setOwner(data.owner);
    } catch (error) {
      console.log("Owner auth check error:", error);
    }
  };

  const checkAdminLoggedIn = async () => {
    try {
      const { data } = await axios.get("/api/admin/is-auth");
      if (data.success) setAdmin(data.admin);
    } catch (error) {
      console.log("Admin auth check error:", error);
    }
  };

  // ---------------- Fetch rooms & hotels ----------------
  const fetchRoomData = async () => {
    try {
      const { data } = await axios.get("/api/room/get-all");
      if (data.success) setRoomData(data.rooms);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch rooms");
    }
  };

  const fetchHotelsData = async () => {
    try {
      const { data } = await axios.get("/api/hotel/get-all");
      if (data.success) setHotelsData(data.hotels);
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch hotels");
    }
  };

  // ---------------- Load initial data ----------------
  useEffect(() => {
    checkUserLoggedIn();
    checkOwnerLoggedIn();
    checkAdminLoggedIn();
    fetchRoomData();
    fetchHotelsData();
  }, []);

  // ---------------- Handle search ----------------
  const handleSearch = async (city) => {
    if (!city) return;

    // Navigate to rooms page
    navigate(`/rooms?location=${encodeURIComponent(city)}`);

    // ---------------- Update recent searches (last 5) ----------------
    setRecentSearchedCities((prev) => {
      const updated = [city, ...prev.filter((c) => c !== city)];
      return updated.slice(0, 5);
    });

    // ---------------- Update global searchedCities ----------------
    setSearchedCities((prev) => {
      const updated = [city, ...prev.filter((c) => c !== city)];
      localStorage.setItem("searchedCities", JSON.stringify(updated));
      return updated;
    });

    // ---------------- Send to backend ----------------
    try {
      await axios.post("/api/user/store-recent-search", { recentSearchedCity: city });
    } catch (err) {
      console.error("Error storing recent search in backend:", err);
    }
  };

  // ---------------- Get auth token ----------------
  const getToken = () => {
    return user?.token || owner?.token || admin?.token || null;
  };

  // ---------------- Context value ----------------
  const value = {
    navigate,
    user,
    setUser,
    owner,
    setOwner,
    admin,
    setAdmin,
    hotelsData,
    setHotelsData,
    roomData,
    setRoomData,
    searchedCities,
    recentSearchedCities,
    setSearchedCities,
    setRecentSearchedCities,
    handleSearch,
    axios,
    getToken,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ---------------- Custom hook ----------------
export const useAppContext = () => useContext(AppContext);

export default AppContextProvider;
