import React, { useEffect, useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

const ManageUser = () => {
  const { axios } = useContext(AppContext);
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // Fetch all owners and admins
  const fetchUsers = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("/api/admin/users");
      if (data.success) {
        setUsers(data.users);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch users");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Update user's password
  const updatePassword = async (userId) => {
    const newPassword = prompt("Enter new password for this user:");
    if (!newPassword) return;

    try {
      const { data } = await axios.put("/api/admin/update-password", {
        userId,
        newPassword,
      });
      if (data.success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 p-6">
      {/* Header + Button */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6 gap-4">
        <h2 className="text-3xl font-bold text-indigo-700 tracking-wide">
          Manage Users
        </h2>
        <button
          className="px-5 py-2 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-xl shadow-lg hover:scale-105 transform transition-all"
          onClick={() => navigate("/admin/add")}
        >
          + Create Owner/Admin
        </button>
      </div>

      {/* Users Table */}
      <div className="overflow-x-auto shadow-lg rounded-2xl border border-indigo-200">
        <table className="min-w-full border-collapse">
          <thead>
            <tr className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
              {["Name", "Email", "Role", "Actions"].map((head) => (
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
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={4} className="py-6 text-center text-gray-500">
                  No users found
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user._id}
                  className="hover:bg-indigo-50 transition duration-200"
                >
                  <td className="py-3 px-4 font-medium text-gray-800">{user.name}</td>
                  <td className="py-3 px-4 text-gray-600">{user.email}</td>
                  <td className="py-3 px-4 capitalize text-indigo-600 font-semibold">
                    {user.role}
                  </td>
                  <td className="py-3 px-4">
                    <button
                      onClick={() => updatePassword(user._id)}
                      className="px-4 py-1 bg-red-500 text-white rounded-lg shadow hover:bg-red-600 transition transform hover:scale-105"
                    >
                      Reset Password
                    </button>
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

export default ManageUser;
