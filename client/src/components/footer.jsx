import { motion } from "framer-motion";
import { Link, Links } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="w-full text-white py-6">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
        className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4 text-sm md:text-base font-light tracking-wide"
      >
        {/* Left */}
        <Link to="/home">
          <motion.h1
          whileHover={{ scale: 1.05 }}
          className="font-semibold text-lg cursor-pointer select-none"
          style={{fontFamily: "AZONIX"}}
        >
          Movion
        </motion.h1>
        </Link>
        {/* Center */}
        <motion.p
          className="opacity-70 text-center"
          whileHover={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          All right reserved
        </motion.p>

        {/* Right */}
        <motion.div
          className="flex items-center gap-2 cursor-pointer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.8 }}
        >
          <motion.a
            href="#"
            whileHover={{ color: "#ffffff", opacity: 1, scale: 1.05 }}
            className="opacity-70 hover:opacity-100 transition duration-300"
          >
            Terms of Use
          </motion.a>
          <span className="opacity-70">|</span>
          <motion.a
            href="#"
            whileHover={{ color: "#ffffff", opacity: 1, scale: 1.05 }}
            className="opacity-70 hover:opacity-100 transition duration-300"
          >
            Privacy Policy
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Subtle top border gradient */}
      <div className="h-px w-full bg-linear-to-r from-transparent via-white/20 to-transparent mt-6"></div>
    </footer>
  );
}
