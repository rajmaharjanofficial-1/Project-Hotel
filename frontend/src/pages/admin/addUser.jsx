import React, { useState, useContext } from "react";
import { AppContext } from "../../context/AppContext";
import toast from "react-hot-toast";
import { User, Mail, Lock } from "lucide-react";

const AddUser = () => {
  const { axios } = useContext(AppContext);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    if (!formData.role) {
      toast.error("Please select a role");
      return;
    }

    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/signup", formData);
      if (data.success) {
        toast.success(data.message);
        setFormData({ name: "", email: "", password: "", role: "" });
      } else toast.error(data.message);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 relative overflow-hidden px-4">
      {/* Animated subtle gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-purple-800 via-indigo-900 to-pink-900 animate-pulse opacity-20"></div>

      <form className="relative z-10 w-full max-w-md bg-gray-900/90 border border-gray-700 rounded-3xl px-10 py-12 shadow-2xl backdrop-blur-md" onSubmit={handleSubmit}>
        <h1 className="text-4xl font-extrabold text-white text-center mb-10 tracking-wider drop-shadow-lg">
          Add New Owner/Admin
        </h1>

        {/* Input Fields */}
        {[
          { name: "name", type: "text", icon: <User /> , label: "Full Name" },
          { name: "email", type: "email", icon: <Mail /> , label: "Email Address" },
          { name: "password", type: "password", icon: <Lock /> , label: "Password" },
        ].map((field) => (
          <div key={field.name} className="relative w-full mb-6 group">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-indigo-400 transition-colors">
              {field.icon}
            </span>
            <input
              type={field.type}
              name={field.name}
              value={formData[field.name]}
              onChange={handleChange}
              placeholder=" "
              className="peer w-full pl-12 pr-4 h-14 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none transition duration-300"
              required
            />
            <label className="absolute left-12 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-placeholder-shown:text-gray-500 peer-placeholder-shown:text-base peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400 transition-all">
              {field.label}
            </label>
          </div>
        ))}

        {/* Role */}
        <div className="relative w-full mb-8 group">
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="peer w-full h-14 rounded-xl bg-gray-800 border border-gray-700 text-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500 outline-none px-4 transition duration-300"
            required
          >
            <option value="">Select Role</option>
            <option value="owner">Owner</option>
            <option value="admin">Admin</option>
          </select>
          <label className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-sm peer-focus:-top-2 peer-focus:text-xs peer-focus:text-indigo-400 transition-all">
            Role
          </label>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={loading}
          className="w-full h-14 bg-gradient-to-r from-indigo-500 to-purple-500 text-white font-extrabold rounded-xl shadow-lg hover:scale-105 hover:from-purple-500 hover:to-pink-500 transition transform flex items-center justify-center gap-3 text-lg"
        >
          {loading ? "Creating..." : "Create User"}
        </button>
      </form>
    </div>
  );
};

export default AddUser;
