import { useState } from "react";
import { Search, Home, Clock, Sparkles, User, Menu } from "lucide-react";
import { Link, Links } from "react-router-dom";

const Sidebarlayout = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile Hamburger */}
      <div className="fixed top-4 left-4 md:hidden z-50">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="text-white p-2 rounded-md bg-black/80 hover:bg-black transition"
        >
          <Menu className="w-8 h-8" />
        </button>
      </div>

      {/* Sidebar */}
      <div
        className={`
          fixed top-0 left-0 h-screen w-16 bg-black
          flex flex-col items-center py-6 z-40
          transform transition-transform duration-300
          ${isOpen ? "translate-x-0" : "-translate-x-full"} 
          md:translate-x-0
        `}
      >
        {/* Logo */}
        <Link to={"/dashboard"}>
          <div className="flex flex-col items-center gap-2 text-white mb-4">
          {"MOVION".split("").map((char, i) => (
            <span
              key={i}
              className="text-xl font-semibold tracking-widest origin-center"
            >
              {char}
            </span>
          ))}
        </div>
        </Link>

        {/* ICON AREA (pushed to bottom like your second code) */}
        <div className="h-full flex justify-end items-end">
          <div className="h-11/12 flex flex-col items-center gap-8 text-white">
            <Link to={"/searchpage"}>
              <Search className="w-7 h-7 hover:text-gray-400 transition" />
            </Link>
            <Link to={"/dashboard"}>
              <Home className="w-7 h-7 hover:text-gray-400 transition" />
            </Link>
            <Link to={"/Watchlater"}>
              <Clock className="w-7 h-7 hover:text-gray-400 transition" />
            </Link>
            <Link to={"/Ai"} >
              <Sparkles className="w-7 h-7 hover:text-gray-400 transition" />
            </Link>
            <Link to={"/Profile"}>
              <User className="w-7 h-7 hover:text-gray-400 transition" />
            </Link>
          </div>
        </div>

        {/* Vertical Glow Line */}
        <div className="absolute left-16 top-8 h-11/12 w-px bg-white shadow-[0_0_10px_2px_rgba(255,255,255,0.7)]" />
      </div>

      {/* Overlay for Mobile */}
      {isOpen && (
        <div
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-black/50 z-30 md:hidden"
        />
      )}
    </>
  );
};

export default Sidebarlayout;
