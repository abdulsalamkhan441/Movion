import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";

const API_KEY = "5ea9b1a37bb21a007fe88beb2914e5d2";

const GENRES = [
  { id: 28, label: "ACTION" },
  { id: 27, label: "HORROR" },
  { id: 10749, label: "ROMANCE" },
  { id: 16, label: "ANIME" },
  { id: 12, label: "ADVENTURE" },
  { id: 878, label: "SCI-FI" },
];

const EXTRA_GENRES = [
  { id: 35, label: "COMEDY" },
  { id: 53, label: "THRILLER" },
  { id: 14, label: "FANTASY" },
];

const GENRE_PATHS = {
  28: "/action",
  27: "/Horror",
  10749: "/romance",
  16: "/anime",
  12: "/Adventure",
  878: "/scifi",
  35: "/Comedy",
  53: "/Thriller",
  14: "/Fantasy",
};

export default function GenrePage() {
  const [genreImages, setGenreImages] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    [...GENRES, ...EXTRA_GENRES].forEach((g) => fetchGenreImages(g.id));
  }, []);

  async function fetchGenreImages(genreId) {
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc`
      );
      const data = await res.json();

      const images = (data.results || [])
        .slice(0, 3)
        .map((m) =>
          m.poster_path
            ? `https://image.tmdb.org/t/p/w500${m.poster_path}`
            : ""
        );

      setGenreImages((prev) => ({ ...prev, [genreId]: images }));
    } catch (err) {
      console.error(err);
    }
  }

  function onSubmitSearch(e) {
    e.preventDefault();
    const q = searchQuery.trim();
    if (!q) return;
    navigate(`/search/${encodeURIComponent(q)}`);
  }

  function renderGenreRow(row) {
    return row.map((g) => {
      const imgs = genreImages[g.id];
      const path = GENRE_PATHS[g.id];

      return (
        <Link key={g.id} to={path}>
          <motion.div
            whileHover={{ scale: 1.05, y: -3 }}
            transition={{ duration: 0.25 }}
            className="
              relative
              w-[150px] h-[95px]
              sm:w-[200px] sm:h-[120px]
              md:w-[220px] md:h-[130px]
              rounded-2xl
              overflow-hidden
              border border-white/10
              bg-gray-900
              shadow-lg
            "
          >
            {imgs && imgs.length ? (
              imgs.map((img, i) => (
                <div
                  key={i}
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${img})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    clipPath:
                      i === 0
                        ? "polygon(0 0, 50% 0, 40% 100%, 0 100%)"
                        : i === 1
                        ? "polygon(50% 0, 100% 0, 100% 100%, 40% 100%)"
                        : "none",
                  }}
                />
              ))
            ) : (
              <div className="w-full h-full bg-gray-700 animate-pulse" />
            )}

            <div className="absolute inset-0 bg-black/40" />
            <div className="absolute inset-0 flex items-center justify-center">
              <p
                className="text-white text-sm sm:text-lg md:text-xl tracking-wider"
                style={{ fontFamily: "Azonix" }}
              >
                {g.label}
              </p>
            </div>
          </motion.div>
        </Link>
      );
    });
  }

  return (
    <div className="bg-black px-4 sm:px-6 py-10 min-h-screen">
      {/* SEARCH */}
      <form onSubmit={onSubmitSearch} className="flex justify-center mb-8">
        <div className="relative w-full max-w-[480px]">
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
        </div>
      </form>

      {/* GENRES */}
      <div className="
        grid grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        gap-5 sm:gap-6 lg:gap-5
        justify-items-center
      ">
        {renderGenreRow(GENRES)}
      </div>

      <div className="
        grid grid-cols-2
        sm:grid-cols-2
        md:grid-cols-3
        lg:grid-cols-3
        gap-5 sm:gap-6 lg:gap-5
        mt-6
        justify-items-center
      ">
        {renderGenreRow(EXTRA_GENRES)}
      </div>
    </div>
  );
}
