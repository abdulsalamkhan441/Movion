import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaImdb, FaFacebook } from "react-icons/fa";
import { SiRottentomatoes } from "react-icons/si";
import { moviesData } from "../data/moviesData";

export default function Hero1() {
  const [current, setCurrent] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Detect if screen is mobile
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % moviesData.length);
    }, 6000);
    return () => clearInterval(interval);
  }, []);

  const movie = moviesData[current];

  return (
    <div className="relative w-full h-[110vh] text-white overflow-hidden">
      <AnimatePresence initial={false}>
        {/* Background */}
        <motion.div
          key={movie.id}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{
            opacity: { duration: 0.8, ease: [0.4, 0, 0.2, 1] },
          }}
          className="absolute inset-0 bg-center bg-cover"
          style={{
            backgroundImage: `url(${
              isMobile ? movie.mobileBackground : movie.background
            })`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            willChange: "transform, opacity",
            WebkitBackfaceVisibility: "hidden",
            backfaceVisibility: "hidden",
          }}
        >
          {/* Gradient dissolve overlay */}
          <div
            className="absolute inset-0 bg-linear-to-t from-black to-transparent pointer-events-none"
            style={{ mixBlendMode: "multiply" }}
          />
        </motion.div>

        {/* Overlay Content */}
        <motion.div
          key={`content-${movie.id}`}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -30 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 flex flex-col justify-between h-screen"
        >
          {/* Hero Title */}
          <div
            className="
              absolute 
              top-1/2 md:top-1/3 
              left-1/2 md:left-12 
              transform -translate-x-1/2 -translate-y-1/2 md:translate-x-0 md:translate-y-0
              text-center md:text-left
              px-4 sm:px-8
              w-full md:w-auto
              flex flex-col items-center md:items-start
            "
          >
            <h1
              className="text-3xl sm:text-4xl md:text-6xl font-light tracking-widest leading-tight wrap-break-word"
              style={{ fontFamily: "AZONIX" }}
            >
              {movie.title.split(" ").slice(0, 3).join(" ")}
              <br />
              <span className="block mt-1">
                {movie.title.split(" ").slice(3).join(" ")}
              </span>
            </h1>
          </div>

          {/* Info Box */}
          <div
            className="
              absolute
              bottom-6 sm:bottom-10
              left-1/2 md:left-auto md:right-10
              transform -translate-x-1/2 md:translate-x-0
              bg-[#14100f91] backdrop-blur-md
              rounded-xl px-4 sm:px-6 py-4
              flex flex-col md:flex-row
              items-center md:items-start
              text-xs sm:text-sm md:text-base
              w-[90%] sm:w-auto max-w-[95%]
            "
          >
            <div className="space-y-1 md:pr-6 md:border-r md:border-gray-700 text-center md:text-left">
              <span className="block text-gray-300">Release date:</span>
              <span className="block font-medium">{movie.releaseDate}</span>
              <span className="block text-gray-400 text-xs">
                ({movie.country})
              </span>
            </div>

            <div className="mt-4 md:mt-0 md:pl-8 space-y-3 w-full md:w-auto">
              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <FaImdb className="text-yellow-400 text-xl" />
                  <span>IMDb</span>
                </div>
                <span>{movie.imdb}</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <SiRottentomatoes className="text-red-500 text-xl" />
                  <span>Rotten Tomatoes</span>
                </div>
                <span>{movie.rotten}</span>
              </div>

              <div className="flex items-center justify-between gap-8">
                <div className="flex items-center gap-2">
                  <FaFacebook className="text-blue-500 text-xl" />
                  <span>Facebook</span>
                </div>
                <span>{movie.facebook}</span>
              </div>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
