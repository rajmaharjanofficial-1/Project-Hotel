import React, { useContext } from "react";
import { AppContext } from "../../context/AppContext";
import { assets } from "../../assets/assets";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { Users, Settings, FileText } from "lucide-react";

const AdminLayout = () => {
  const { admin, setAdmin, axios } = useContext(AppContext);
  const navigate = useNavigate();

  const sidebarLinks = [
    { name: "Dashboard", path: "/admin", icon: <Users /> },
    { name: "Manage Users", path: "/admin/manageUser", icon: <Settings /> },
    
  ];

  const logout = async () => {
    try {
      const { data } = await axios.get("/api/user/logout", {
        withCredentials: true,
      });
      if (data.success) {
        toast.success(data.message);
        setAdmin(null);
        localStorage.removeItem("token");
        navigate("/");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Logout failed");
    }
  };

  return (
    <>
      {/* Toast Notifications */}
      <ToastContainer position="top-right" autoClose={3000} />

      {/* Navbar with semi-transparent dark blur */}
      <div className="flex items-center justify-between px-4 md:px-8 py-3 bg-gradient-to-r from-indigo-500 to-purple-500 backdrop-blur-md shadow-sm border-b border-gray-700">
        <Link to="/admin">
          {/* White logo now fully visible against dark blur */}
          <img className="h-10 md:h-12" src={assets.logo} alt="Logo" />
        </Link>
        <div className="flex items-center gap-6">
          <p className="font-medium text-white hidden md:block">
            Hi, <span className="text-indigo-100">{admin?.name || "Admin"}</span>
          </p>
          <button
            onClick={logout}
            className="px-4 py-1 text-sm font-medium border border-gray-400 rounded-full shadow-sm hover:bg-indigo-500 hover:text-white transition-all"
          >
            Logout
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex min-h-[calc(100vh-64px)] bg-gray-100">
        {/* Sidebar */}
        <div className="md:w-64 w-16 bg-white border-r border-gray-200 flex flex-col pt-6 shadow-sm">
          {sidebarLinks.map((item, index) => {
            const isActive = window.location.pathname === item.path;
            return (
              <Link
                to={item.path}
                key={index}
                className={`
                  flex items-center gap-3 py-3 px-4 transition-all duration-200
                  ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-r-xl shadow-lg"
                      : "text-gray-700 hover:bg-indigo-100 hover:text-indigo-600 rounded-r-xl"
                  }
                `}
              >
                {item.icon}
                <span className="md:block hidden font-medium">{item.name}</span>
              </Link>
            );
          })}
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6 md:p-8 overflow-auto">
          <Outlet />
        </div>
      </div>
    </>
  );
};

export default AdminLayout;
