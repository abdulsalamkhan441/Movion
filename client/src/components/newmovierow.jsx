import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addWatchLater,
  removeWatchLater,
  getWatchLater,
} from "../utils/watchlater";

const TMDB_IMAGE_BASE = "https://image.tmdb.org/t/p/w500";
const PLACEHOLDER = "/placeholder.jpg";

const NewMovieRow = ({ title, movies = [], type = "movie", seeMoreUrl }) => {
  const [watchLaterList, setWatchLaterList] = useState([]);

  /* -----------------------------
     LOAD WATCH LATER
  ------------------------------ */
  useEffect(() => {
    try {
      setWatchLaterList(getWatchLater() || []);
    } catch {
      setWatchLaterList([]);
    }
  }, []);

  /* -----------------------------
     TOGGLE WATCH LATER
  ------------------------------ */
  const toggleWatchLater = (movie) => {
    if (!movie?.id) return;

    const exists = watchLaterList.some((m) => m.id === movie.id);

    if (exists) {
      removeWatchLater(movie.id);
      setWatchLaterList((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      addWatchLater({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || movie.backdrop_path || "",
      });
      setWatchLaterList((prev) => [...prev, movie]);
    }
  };

  const isInWatchLater = (id) =>
    watchLaterList.some((movie) => movie.id === id);

  const getPosterUrl = (movie) =>
    movie?.poster_path ? `${TMDB_IMAGE_BASE}${movie.poster_path}` : PLACEHOLDER;

  return (
    <section className="flex justify-center">
      <div className="w-11/12 md:w-10/12 py-6 bg-linear-to-b from-black/80 via-black/70 to-black/90">
        <div
          className="
            grid
            grid-cols-2
            sm:grid-cols-3
            md:grid-cols-4
            lg:grid-cols-5
            xl:grid-cols-6
            gap-6
          "
        >
          {movies.map((movie) => (
            <div
              key={movie.id}
              className="
                relative
                h-[220px]
                sm:h-[260px]
                md:h-[300px]
                lg:h-[330px]
                rounded-xl
                overflow-hidden
                group
                transition-all
                duration-500
                hover:scale-[1.04]
              "
            >
              {/* WATCH LATER */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  toggleWatchLater(movie);
                }}
                className="
                  absolute top-2 left-2 z-20
                  opacity-0 group-hover:opacity-100
                  bg-black/60 hover:bg-black/80
                  p-2 rounded-full
                  backdrop-blur-sm
                  transition
                "
                aria-label={
                  isInWatchLater(movie.id)
                    ? "Remove from Watch Later"
                    : "Add to Watch Later"
                }
              >
                {isInWatchLater(movie.id) ? (
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
                  <svg
                    viewBox="0 0 24 24"
                    width="22"
                    height="22"
                    fill="white"
                    aria-hidden
                  >
                    <path d="M6 2a2 2 0 00-2 2v18l8-4 8 4V4a2 2 0 00-2-2H6z" />
                  </svg>
                )}
              </button>

              {/* CARD */}
              <Link to={`/movie/${movie.id}`} className="block w-full h-full">
                {/* IMAGE */}
                <img
                  src={getPosterUrl(movie)}
                  alt={movie.title || movie.name || "Poster"}
                  loading="lazy"
                  onError={(e) => {
                    // fallback to a non-black placeholder and avoid re-triggering onError
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = PLACEHOLDER; // ensure this file is not black
                    // remove effects that may darken it if desired; useful for debugging
                    e.currentTarget.style.filter = "none";
                    e.currentTarget.style.opacity = "1";
                  }}
                  className="
                    w-full h-full
                    object-cover
                    rounded-xl
                    transition-all
                    duration-500
                    group-hover:brightness-75
                  "
                />

                {/* OVERLAY */}
                <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/20 to-black/70 opacity-0 group-hover:opacity-100 transition" />

                {/* INFO */}
                <div className="absolute bottom-0 p-4 opacity-0 group-hover:opacity-100 transition">
                  <h3 className="text-white font-semibold text-sm md:text-base drop-shadow">
                    {movie.title || movie.name}
                  </h3>

                  {movie.vote_average && (
                    <p className="text-yellow-400 text-xs mt-1 font-medium">
                      ⭐ {movie.vote_average.toFixed(1)}
                    </p>
                  )}
                </div>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default NewMovieRow;
