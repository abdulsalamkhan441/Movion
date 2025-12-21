import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link } from "react-router-dom";
import { addWatchLater, removeWatchLater, getWatchLater } from "../utils/watchlater";

/**
 * Props:
 * - endpoint: string (e.g. "/movie/popular" or "/discover/movie") — default "/movie/popular"
 * - params: object (query params for the endpoint, e.g. { with_genres: 16, page: 1 })
 * - apiKey: string (fallbacks to import.meta.env.VITE_TMDB_KEY)
 * - maxResults: number (how many movies to keep for the slider)
 * - interval: number (ms between slides)
 */
const SeeMoreHero = ({
  endpoint = "/movie/popular",
  params = {},
  apiKey: propKey,
  maxResults = 10,
  interval = 6000,
}) => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchLater, setIsWatchLater] = useState(false);
  const TMDB_KEY = propKey || import.meta.env.VITE_TMDB_KEY;

  // Fetch movies from TMDB
  useEffect(() => {
    if (!TMDB_KEY) {
      console.error("TMDB API key not provided to SeeMoreHero");
      return;
    }

    let cancelled = false;
    const fetchMovies = async () => {
      try {
        const url = new URL(`https://api.themoviedb.org/3${endpoint}`);
        const search = new URLSearchParams({
          api_key: TMDB_KEY,
          language: "en-US",
          page: "1",
          ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
        });
        url.search = search.toString();

        const res = await fetch(url.toString());
        const data = await res.json();
        if (!cancelled) {
          const results = Array.isArray(data.results) ? data.results : [];
          setMovies(results.slice(0, maxResults));
          setCurrentIndex(0);
        }
      } catch (error) {
        console.error("Error fetching movies in SeeMoreHero:", error);
      }
    };

    fetchMovies();
    return () => {
      cancelled = true;
    };
  }, [endpoint, JSON.stringify(params), TMDB_KEY, maxResults]);

  // Carousel interval
  useEffect(() => {
    if (movies.length === 0) return;
    const id = setInterval(
      () => setCurrentIndex((prev) => (prev + 1) % movies.length),
      interval
    );
    return () => clearInterval(id);
  }, [movies, interval]);

  // Always call hook, but check movie.id inside
  useEffect(() => {
    if (!movies.length) return;

    const movie = movies[currentIndex];
    try {
      const current = getWatchLater();
      setIsWatchLater(current.some((m) => m.id === movie.id));
    } catch (err) {
      setIsWatchLater(false);
    }
  }, [movies, currentIndex]);

  if (!movies.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400">
        Loading movie...
      </div>
    );
  }

  const movie = movies[currentIndex];
  const backdrop = movie.backdrop_path || movie.poster_path || "";
  const imageUrl = backdrop ? `https://image.tmdb.org/t/p/original${backdrop}` : "";

  const toggleWatchLater = () => {
    if (!movie || !movie.id) return;
    if (isWatchLater) {
      removeWatchLater(movie.id);
      setIsWatchLater(false);
    } else {
      addWatchLater({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || movie.backdrop_path || "",
      });
      setIsWatchLater(true);
    }
  };

  return (
    <section className="relative w-full h-screen flex items-center justify-start text-white font-sans overflow-hidden">
      {/* Background crossfade */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={movie.id || currentIndex}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2, ease: "easeInOut" }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: imageUrl ? `url(${imageUrl})` : undefined, zIndex: 0 }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/40 z-[-1]" />
      </div>

      <div className="absolute inset-0 bg-linear-to-r from-black via-black/80 to-transparent pointer-events-none"></div>
      <div className="absolute inset-x-0 bottom-0 h-40 bg-linear-to-t from-black via-black/60 to-transparent pointer-events-none"></div>

      <motion.div
        key={(movie.id || currentIndex) + "-content"}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 60 }}
        transition={{ duration: 1 }}
        className="relative z-10 px-5 sm:px-10 md:px-16 lg:px-20 max-w-2xl"
      >
        <motion.img
          src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
          alt="Logo"
          className="w-16 sm:w-20 mb-4 sm:mb-6"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        />

        <motion.h1
          className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold mb-3 leading-tight drop-shadow-[0_4px_10px_rgba(0,0,0,0.8)]"
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2 }}
        >
          {movie.title || movie.name || "Untitled"}
        </motion.h1>

        <motion.p
          className="text-gray-300 mb-8 sm:mb-10 text-xs sm:text-sm md:text-base leading-relaxed max-w-lg"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.4 }}
        >
          {(movie.overview && movie.overview.slice(0, 160)) || "No description."}...
        </motion.p>

        <div className="flex flex-wrap gap-5 sm:gap-8 items-center">
          <Link to={`/movie/${movie.id}`}>
            <button className="bg-[#640005] px-6 sm:px-8 md:px-10 py-2 sm:py-2.5 text-center rounded-tl-2xl rounded-tr-md rounded-bl-md text-lg sm:text-xl md:text-2xl rounded-br-2xl hover:bg-[#64000579] transition-all duration-300 border-2 border-[#BE0010] hover:scale-110 hover:-translate-y-1 hover:shadow-[0_10px_25px_rgba(190,0,16,0.4)] active:scale-95">
              Play
            </button>
          </Link>

          <button
            onClick={toggleWatchLater}
            className="text-base sm:text-lg md:text-xl underline transition-all duration-300 flex items-center gap-2"
            aria-pressed={isWatchLater}
          >
            {isWatchLater ? "✓ Watch Later" : "Watch Later"}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default SeeMoreHero;
