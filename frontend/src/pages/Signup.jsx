import React, { useContext, useState } from "react";
import { Mail, Lock, User } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";

const Signup = () => {
  const { axios, navigate } = useContext(AppContext);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user", // default role
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

    setLoading(true);
    try {
      const { data } = await axios.post("/api/user/signup", formData);

      if (data.success) {
        toast.success(data.message);
        navigate("/login");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(
        error?.response?.data?.message || "Signup failed"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#020617] via-[#0a1b3d] to-[#020617] relative overflow-hidden">

      {/* background glow */}
      <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full -top-40 -left-40 animate-pulse"></div>
      <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[160px] rounded-full bottom-0 right-0 animate-pulse"></div>

      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative w-full max-w-md text-center rounded-3xl px-10 py-10
        bg-white/5 backdrop-blur-2xl border border-white/10
        shadow-[0_20px_80px_rgba(0,0,0,0.7)]
        hover:shadow-blue-500/20 transition-all"
      >
        <h1 className="text-4xl font-bold text-white">QuickStay</h1>
        <p className="text-blue-300 text-sm mt-2">
          Create your booking account
        </p>

        {/* Name */}
        <div className="mt-7 flex items-center gap-3 border border-white/15 
        rounded-full px-5 h-12 bg-white/5 focus-within:border-blue-400 transition">
          <User size={18} className="text-blue-300" />
          <input
            type="text"
            name="name"
            placeholder="Full name"
            value={formData.name}
            onChange={handleChange}
            className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-400"
            required
          />
        </div>

        {/* Email */}
        <div className="mt-4 flex items-center gap-3 border border-white/15 
        rounded-full px-5 h-12 bg-white/5 focus-within:border-blue-400 transition">
          <Mail size={18} className="text-blue-300" />
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={formData.email}
            onChange={handleChange}
            className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-400"
            required
          />
        </div>

        {/* Password */}
        <div className="mt-4 flex items-center gap-3 border border-white/15 
        rounded-full px-5 h-12 bg-white/5 focus-within:border-blue-400 transition">
          <Lock size={18} className="text-blue-300" />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={formData.password}
            onChange={handleChange}
            className="w-full outline-none text-sm bg-transparent text-white placeholder-gray-400"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="mt-7 w-full h-12 rounded-full text-white font-semibold
          bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600
          hover:scale-[1.04] transition-all duration-300 shadow-lg hover:shadow-blue-500/40
          disabled:opacity-60"
        >
          {loading ? "Creating account..." : "Sign Up"}
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Already have an account?{" "}
          <Link to="/login" className="text-blue-400 hover:underline">
            Login
          </Link>
        </p>
      </motion.form>
    </div>
  );
};

export default Signup;
