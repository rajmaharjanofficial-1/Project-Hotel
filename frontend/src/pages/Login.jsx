import React, { useContext, useState } from "react";
import { Mail, Lock } from "lucide-react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Login = () => {
  const { setUser, setOwner, setAdmin, navigate, axios } = useContext(AppContext);

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post("/api/user/login", formData);

      if (data.success) {
        toast.success(data.message);

        switch (data.user.role) {
          case "owner":
            setOwner(data.user);
            setUser(null);
            setAdmin(null);
            navigate("/owner");
            break;
          case "admin":
            setAdmin(data.user);
            setUser(null);
            setOwner(null);
            navigate("/admin");
            break;
          default:
            setUser(data.user);
            setOwner(null);
            setAdmin(null);
            navigate("/");
            break;
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center 
    bg-gradient-to-br from-[#020617] via-[#0a1b3d] to-[#020617] relative overflow-hidden">

      {/* Animated glow backgrounds */}
      <div className="absolute w-[700px] h-[700px] bg-blue-600/20 blur-[160px] rounded-full 
      -top-40 -left-40 animate-pulse"></div>

      <div className="absolute w-[600px] h-[600px] bg-indigo-500/20 blur-[160px] rounded-full 
      bottom-0 right-0 animate-pulse"></div>

      {/* Login Card */}
      <form
        onSubmit={handleSubmit}
        className="relative sm:w-[420px] w-[92%] text-center rounded-3xl px-10 py-10
        bg-white/5 backdrop-blur-2xl border border-white/10
        shadow-[0_20px_80px_rgba(0,0,0,0.7)]
        transition-all duration-500 hover:shadow-blue-500/20 hover:-translate-y-1"
      >
        <h1 className="text-white text-4xl font-bold tracking-wide">
          QuickStay
        </h1>

        <p className="text-blue-300 text-sm mt-2">
          Premium Hotel Booking Experience
        </p>

        <h2 className="text-white text-xl mt-7 font-medium">
          Welcome Back
        </h2>

        {/* Email */}
        <div className="flex items-center mt-8 w-full border border-white/15 
        h-12 rounded-full pl-5 gap-3 bg-white/5 
        focus-within:border-blue-400 transition-all">
          <Mail size={18} className="text-blue-300" />
          <input
            type="email"
            name="email"
            placeholder="Enter your email"
            value={formData.email}
            onChange={handleChange}
            className="outline-none w-full text-sm bg-transparent text-white placeholder-gray-400"
            required
          />
        </div>

        {/* Password */}
        <div className="flex items-center mt-4 w-full border border-white/15 
        h-12 rounded-full pl-5 gap-3 bg-white/5 
        focus-within:border-blue-400 transition-all">
          <Lock size={18} className="text-blue-300" />
          <input
            type="password"
            name="password"
            placeholder="Enter your password"
            value={formData.password}
            onChange={handleChange}
            className="outline-none w-full text-sm bg-transparent text-white placeholder-gray-400"
            required
          />
        </div>

        {/* Button */}
        <button
          type="submit"
          className="mt-8 w-full h-12 rounded-full text-white font-semibold tracking-wide
          bg-gradient-to-r from-blue-500 via-indigo-500 to-blue-600
          hover:scale-[1.04] transition-all duration-300
          shadow-lg hover:shadow-blue-500/40"
        >
          Sign In
        </button>

        <p className="text-gray-400 text-sm mt-6">
          Don't have an account?{" "}
          <Link to="/signup" className="text-blue-400 hover:underline">
            Register
          </Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
