import { motion } from "framer-motion";
import { useState } from "react";
import { Link } from "react-router-dom";

export default function EarlyNavbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="flex justify-between items-center px-4 sm:px-6 md:px-8 lg:px-10 py-4 md:py-6 text-white relative z-20"
    >
      {/* Background gradient overlay behind navbar text */}
      <div className="absolute inset-0 bg-linear-to-b from-black/70 via-black/40 to-transparent -z-10"></div>

      {/* Logo */}
      <h1
        className="text-2xl sm:text-3xl md:text-4xl font-light tracking-wide"
        style={{ fontFamily: "Orbitron" }}
      >
        Movion
      </h1>

      {/* Desktop Menu */}
      <div className="hidden md:flex items-center space-x-6 lg:space-x-8 xl:space-x-10">
        <Link
          to="/signup"
          className="bg-[#038e9b81] rounded-tl-[15px] rounded-tr-sm rounded-br-[15px] rounded-bl-sm border-2 border-[#05909A] hover:shadow-[0_0_30px_15px_rgba(5,144,154,0.3)] transition-all duration-500 ease-out text-white px-4 lg:px-6 py-1 font-normal text-xl lg:text-2xl xl:text-3xl text-center"
        >
          Sign up
        </Link>

        <Link
          to="/login"
          className="text-white font-normal text-xl lg:text-2xl xl:text-3xl hover:underline"
        >
          Log in
        </Link>
      </div>

      {/* Mobile Hamburger */}
      <div className="md:hidden">
        <button
          className="text-white"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="md:hidden absolute top-full left-0 right-0 backdrop-blur-3xl border border-[#ffffff40] rounded-2xl p-4 mt-2"
        >
          <div className="flex flex-col space-y-4">
            <button className="bg-[#d8eef081] border-2 border-[#05909A] hover:shadow-[0_0_30px_15px_rgba(5,144,154,0.3)] transition-all duration-600 ease-out text-white px-4 py-2 rounded-lg font-normal text-xl text-center w-full">
              Sign up
            </button>
            <Link
              to="/login"
              className="text-white transition font-normal text-xl hover:underline text-center"
            >
              Log in
            </Link>
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}
