import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";

const AdminHotels = () => {
  const { axios } = useContext(AppContext);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch all hotels with owner info
  const fetchHotels = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/hotels"); // your API route
      if (data.success) {
        setHotels(data.hotels);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch hotels");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHotels();
  }, []);

  // Filter hotels by location or owner email
  const filteredHotels = hotels.filter((hotel) => {
    const email = hotel.owner?.email?.toLowerCase() || "";
    const location = hotel.hotelAddress?.toLowerCase() || "";
    const term = searchTerm.toLowerCase();
    return email.includes(term) || location.includes(term);
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header + Search */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-indigo-700 tracking-wide">
          All Hotels
        </h2>

        {/* Search input */}
        <input
          type="text"
          placeholder="Search by Owner Email or Location"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full sm:w-1/3 px-4 py-2 border border-indigo-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-400 transition"
        />
      </div>

      {/* Hotels Table */}
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-indigo-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              {[
                "Hotel Name",
                "Location",
                "Owner Name",
                "Owner Email",
                "Price / Night",
                
              ].map((head) => (
                <th
                  key={head}
                  className="py-3 px-4 text-left text-sm font-semibold tracking-wide"
                >
                  {head}
                </th>
              ))}
            </tr>
          </thead>

          <tbody className="bg-white divide-y divide-gray-200">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : filteredHotels.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-6 text-center text-gray-500">
                  No hotels found
                </td>
              </tr>
            ) : (
              filteredHotels.map((hotel) => (
                <tr
                  key={hotel._id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  {/* Hotel Name */}
                  <td className="py-3 px-4 flex items-center gap-3">
                    {hotel.image ? (
                      <img
                        src={`${import.meta.env.VITE_BACKEND_URL}/images/${hotel.image}`}
                        alt={hotel.hotelName}
                        className="h-12 w-20 rounded-lg object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-12 w-20 bg-gray-200 rounded-lg flex items-center justify-center text-gray-500">
                        No Image
                      </div>
                    )}
                    <span className="font-medium text-gray-800">
                      {hotel.hotelName || hotel.name}
                    </span>
                  </td>

                  {/* Location */}
                  <td className="py-3 px-4 text-gray-600">{hotel.hotelAddress || "N/A"}</td>

                  {/* Owner Name */}
                  <td className="py-3 px-4 text-gray-800">{hotel.owner?.name || "N/A"}</td>

                  {/* Owner Email */}
                  <td className="py-3 px-4 text-gray-600">{hotel.owner?.email || "N/A"}</td>

                  {/* Price */}
                  <td className="py-3 px-4 text-indigo-600 font-semibold">
                    {hotel.minPrice && hotel.maxPrice
                      ? `रु ${hotel.minPrice} - रु ${hotel.maxPrice}`
                      : `रु ${hotel.price || "N/A"}`}
                  </td>

           
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminHotels;
