import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addWatchLater,
  removeWatchLater,
  getWatchLater,
} from "../utils/watchlater";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "/placeholder.jpg";

const MovieRow2 = ({ title, movies = [], seeMoreUrl }) => {
  const [watchLaterList, setWatchLaterList] = useState([]);

  useEffect(() => {
    const current = getWatchLater() || [];
    setWatchLaterList(current);
  }, []);

  const toggleWatchLater = (movie) => {
    if (!movie?.id) return;

    const exists = watchLaterList.some((m) => m.id === movie.id);

    if (exists) {
      removeWatchLater(movie.id);
      setWatchLaterList((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      const normalized = {
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || movie.poster || movie.backdrop_path || "",
      };

      addWatchLater(normalized);
      setWatchLaterList((prev) => [...prev, normalized]);
    }
  };

  const isSaved = (id) => watchLaterList.some((m) => m.id === id);

  const getPosterPath = (movie) => {
    return movie?.poster_path || movie?.poster || movie?.backdrop_path || null;
  };

  const getPosterUrl = (movie) => {
    const path = getPosterPath(movie);
    if (path && path.length > 0) {
      return `${TMDB_IMAGE_BASE}${path.startsWith("/") ? path : `/${path}`}`;
    }
    return PLACEHOLDER;
  };

  return (
    <section className="w-full">
      <div className="w-full px-4 md:px-10 py-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-4xl font-semibold text-white">{title}</h2>

          {seeMoreUrl && (
            <Link to={seeMoreUrl} className="text-gray-300 hover:text-white">
              See more
            </Link>
          )}
        </div>

        {/* ✅ Responsive grid layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-6">
          {movies.map((movie, index) => {
            const posterUrl = getPosterUrl(movie);

            return (
              <div
                key={movie.id || index}
                className="relative w-full aspect-2/3 rounded-xl group"
              >
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleWatchLater(movie);
                  }}
                  className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition p-1 bg-black/60 rounded-md text-white"
                  aria-label={
                    isSaved(movie.id) ? "Remove from Watch Later" : "Add to Watch Later"
                  }
                >
                  {isSaved(movie.id) ? (
                    <svg
                      viewBox="0 0 24 24"
                      width="22"
                      height="22"
                      fill="#00ff99"
                      aria-hidden
                    >
                      <path d="M20.285 6.709l-11.4 11.4L3.715 12.94l1.41-1.41 3.76 3.76 9.99-9.99z" />
                    </svg>
                  ) : (
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="white" aria-hidden>
                      <path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z" />
                    </svg>
                  )}
                </button>

                <Link to={`/movie/${movie.id}`} className="block w-full h-full">
                  <div
                    className="absolute inset-0 rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.18)]
                      group-hover:shadow-[0_0_28px_rgba(255,255,255,0.32)]
                      transition-shadow duration-300"
                  />

                  <img
                    src={posterUrl}
                    alt={movie.title || movie.name}
                    className="w-full h-full rounded-xl object-cover transition duration-300 group-hover:brightness-75"
                    loading="lazy"
                    onError={(e) => {
                      e.currentTarget.onerror = null;
                      e.currentTarget.src = PLACEHOLDER;
                      e.currentTarget.style.filter = "none";
                      e.currentTarget.style.opacity = "1";
                    }}
                  />

                  <div className="absolute inset-0 flex flex-col justify-end bg-linear-to-t from-black/70 via-black/40 to-transparent rounded-xl opacity-0 group-hover:opacity-100 transition duration-300 p-2">
                    <h3 className="text-white text-xs sm:text-sm md:text-base font-semibold leading-tight">
                      {movie.title || movie.name}
                    </h3>
                    {movie.vote_average && (
                      <p className="text-yellow-400 text-xs sm:text-sm mt-1 font-medium">
                        ⭐ IMDb: {movie.vote_average.toFixed(1)}
                      </p>
                    )}
                  </div>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default MovieRow2;
