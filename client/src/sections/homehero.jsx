import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import {
  addWatchLater,
  removeWatchLater,
  getWatchLater,
} from "../utils/watchlater";

const HomeHero = () => {
  const [movies, setMovies] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isWatchLater, setIsWatchLater] = useState(false);

  // 🔍 SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  /* ---------------- FETCH HERO MOVIES ---------------- */
  useEffect(() => {
    const fetchPopularMovies = async () => {
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${TMDB_KEY}&language=en-US&page=1`
        );
        const data = await res.json();
        if (data.results?.length) {
          setMovies(data.results.slice(0, 10));
        }
      } catch (error) {
        console.error("Error fetching movies:", error);
      }
    };
    fetchPopularMovies();
  }, [TMDB_KEY]);

  /* ---------------- AUTO SLIDE ---------------- */
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  /* ---------------- WATCH LATER SYNC ---------------- */
  useEffect(() => {
    if (!movies.length) return;
    const movie = movies[currentIndex];
    const list = getWatchLater();
    setIsWatchLater(list.some((m) => m.id === movie.id));
  }, [movies, currentIndex]);

  const toggleWatchLater = () => {
    const movie = movies[currentIndex];
    if (!movie) return;

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

  /* ---------------- SEARCH HANDLER ---------------- */
  const onSubmitSearch = (e) => {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search/${encodeURIComponent(q)}`);
  };

  if (!movies.length) {
    return (
      <div className="w-full h-screen flex items-center justify-center text-gray-400">
        Loading movies...
      </div>
    );
  }

  const movie = movies[currentIndex];

  return (
    <section className="relative w-full h-screen text-white overflow-hidden">
      {/* BACKGROUND */}
      <div className="absolute inset-0">
        <AnimatePresence mode="sync">
          <motion.div
            key={movie.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(https://image.tmdb.org/t/p/original${movie.backdrop_path})`,
            }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* GRADIENTS */}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
      <div className="absolute bottom-0 inset-x-0 h-40 bg-gradient-to-t from-black to-transparent" />

      {/* 🔍 SEARCH BAR (TOP CENTER) */}
      <motion.div
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="absolute top-6 left-1/2 -translate-x-1/2 z-20 w-full flex justify-center px-4"
      >
        <form onSubmit={onSubmitSearch} className="relative w-full max-w-[480px]">
          <input
            type="text"
            placeholder="Search movies..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="
              w-full
              px-8 py-3
              rounded-full
              bg-white/10
              text-white
              text-base sm:text-lg
              outline-none
              backdrop-blur-lg
              border border-white/20
              shadow-[inset_-1px_-3px_4px_rgba(255,255,255,0.3),inset_4px_5px_6px_rgba(255,255,255,0.25)]
            "
            style={{ fontFamily: "Azonix" }}
          />

          <button
            type="submit"
            className="
              absolute right-2 top-1/2 -translate-y-1/2
              px-4 py-1
              rounded-full
              bg-white/20
              text-white
              font-semibold
              hover:bg-white/30
              transition
            "
            style={{ fontFamily: "Azonix" }}
          >
            Go
          </button>
        </form>
      </motion.div>

      {/* HERO CONTENT */}
      <motion.div
        key={movie.id + "-content"}
        initial={{ opacity: 0, x: -60 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="relative z-10 h-full flex flex-col justify-center px-6 sm:px-12 md:px-20 max-w-2xl"
      >
        <motion.h1
          className="text-4xl sm:text-5xl md:text-6xl font-extrabold mb-4 drop-shadow-lg"
        >
          {movie.title || movie.name}
        </motion.h1>

        <p className="text-gray-300 mb-8 max-w-lg">
          {movie.overview?.slice(0, 160)}...
        </p>

        <div className="flex gap-6 items-center">
          <Link to={`/movie/${movie.id}`}>
            <button className="bg-[#640005] px-8 py-2 rounded-xl text-xl hover:scale-110 transition border-2 border-[#BE0010]">
              Play
            </button>
          </Link>

          <button
            onClick={toggleWatchLater}
            className="underline text-lg hover:text-white/70 transition"
          >
            {isWatchLater ? "✓ Watch Later" : "Watch Later"}
          </button>
        </div>
      </motion.div>
    </section>
  );
};

export default HomeHero;
