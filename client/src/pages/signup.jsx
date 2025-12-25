import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import TestimonialSlider from "../components/TestimonialSlider/Slider";

export default function Signup() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await fetch("http://movion-backend.onrender.com", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.msg || "Signup failed");
        return;
      }

      alert("Account created");
      navigate("/login");
    } catch (err) {
      console.error(err);
      alert("Server error. Please try again.");
    }
  };

  return (
  <div className="bg-black min-h-screen text-white font-Orbitron relative overflow-x-hidden px-4 py-12">
    {/* PAGE SCROLL OWNER */}

    {/* Background Text */}
    <motion.h1
      className="absolute text-[6rem] md:text-[10rem] xl:text-[14rem] font-bold text-white tracking-[10px] select-none z-0 hidden md:block"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.08 }}
      transition={{ delay: 1 }}
      style={{
        top: "50%",
        left: "50%",
        transform: "translate(-50%, -50%)",
      }}
    >
      MOVION
    </motion.h1>

    {/* Heading */}
    <motion.h1
      initial={{ opacity: 0, y: -40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.2 }}
      className="relative z-10 text-[1.6rem] sm:text-[2rem] md:text-[2.5rem] tracking-[6px] text-center mb-12"
      style={{ fontFamily: "AZONIX" }}
    >
      Your first step is what matters
    </motion.h1>

    {/* CONTENT */}
    <div className="relative z-10 w-full max-w-6xl mx-auto flex flex-col md:flex-row">
      {/* SLIDER */}
      <div className="w-full md:w-1/2 flex justify-center md:justify-end items-center overflow-visible">
        <TestimonialSlider autoRotate autoRotateInterval={5000} />
      </div>

      {/* SIGNUP */}
      <div className="w-full md:w-1/2 flex justify-center items-center">
        <motion.div
          initial={{ opacity: 0, x: 60 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1.2 }}
          className="
            bg-[#d9d9d909]
            border border-white/70
            rounded-[20px]
            p-6 md:p-8
            w-full max-w-[380px]
            backdrop-blur-lg
            relative
            lg:max-h-[70vh] lg:overflow-y-auto
          "
        >
          <Link
            to="/login"
            className="absolute right-5 top-4 text-sm underline"
          >
            Log In
          </Link>

          <form onSubmit={handleSubmit} className="space-y-6 mt-6">
            <div className="flex gap-4">
              <input
                name="firstName"
                placeholder="First Name"
                value={formData.firstName}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b text-white outline-none"
              />
              <input
                name="lastName"
                placeholder="Last Name"
                value={formData.lastName}
                onChange={handleChange}
                required
                className="w-full bg-transparent border-b text-white outline-none"
              />
            </div>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b text-white outline-none"
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full bg-transparent border-b text-white outline-none"
            />

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="w-full bg-gradient-to-r from-[#1E3A46] to-[#58717D] py-2 rounded-full"
            >
              Create Account
            </motion.button>
          </form>
        </motion.div>
      </div>
    </div>
  </div>
);
}
