import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  addWatchLater,
  removeWatchLater,
  getWatchLater,
} from "../utils/watchlater";

export default function MovieRow({ title, movies = [], type = "movie", seeMoreUrl }) {
  const [watchLaterList, setWatchLaterList] = useState([]);

  useEffect(() => {
    try {
      setWatchLaterList(getWatchLater());
    } catch (err) {
      console.error("Watch Later load error:", err);
    }
  }, []);

  const toggleWatchLater = (movie) => {
    if (!movie?.id) return;
    const alreadySaved = watchLaterList.some((m) => m.id === movie.id);

    if (alreadySaved) {
      removeWatchLater(movie.id);
      setWatchLaterList((prev) => prev.filter((m) => m.id !== movie.id));
    } else {
      addWatchLater({
        id: movie.id,
        title: movie.title || movie.name,
        poster_path: movie.poster_path || "",
      });
      setWatchLaterList((prev) => [...prev, movie]);
    }
  };

  // send a lightweight tracking event when a movie card is clicked
  async function trackCardClick(movie) {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      // best-effort; no impact on navigation
      await fetch("/api/user/track", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          movieId: movie.id || movie._id || movie.movieId,
          title: movie.title || movie.name,
          action: "card_click",
          when: new Date().toISOString(),
        }),
      });
    } catch (e) {
      // ignore tracking failures
    }
  }

 return (
  <section className="w-full bg-black overflow-hidden"> 
    <div className="w-full px-2 sm:px-4 md:px-10 py-6 md:py-8 bg-black">

      {/* Header */}
      <div className="flex justify-between items-center mb-4 md:mb-6">
        <h2
          className="text-2xl md:text-4xl font-semibold tracking-wide text-white"
          style={{ fontFamily: "Urbanist" }}
        >
          {title}
        </h2>

        {seeMoreUrl && (
          <Link
            to={seeMoreUrl}
            className="text-[#CCCCCC] hover:text-white text-lg md:text-2xl tracking-wide transition hover:underline"
          >
            See more
          </Link>
        )}
      </div>

      {/* Scroll Cards */}
      <div
        className="flex gap-3 sm:gap-4 md:gap-6 overflow-x-auto no-scrollbar"
        style={{
          scrollBehavior: "smooth",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {movies?.map((movie) => {
          const isSaved = watchLaterList.some((m) => m.id === movie.id);

          return (
            <div
              key={movie.id}
              className="relative shrink-0 w-[110px] xs:w-[130px] sm:w-[150px] md:w-[180px] aspect-2/3 rounded-xl group"
            >
              {/* Watch Later Button */}
              <button
                onClick={() => toggleWatchLater(movie)}
                className="absolute top-2 left-2 z-20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 p-1 bg-black/60 rounded-md hover:bg-black/80"
              >
                {isSaved ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="#00ff6a" viewBox="0 0 24 24">
                    <path d="M20 6L9 17l-5-5 1.5-1.5L9 14l9.5-9.5L20 6z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" fill="white" viewBox="0 0 24 24">
                    <path d="M6 2h12a2 2 0 012 2v18l-8-4-8 4V4a2 2 0 012-2z" />
                  </svg>
                )}
              </button>

              {/* Poster */}
              <Link to={`/movie/${movie.id}`} className="block relative w-full h-full cursor-pointer"
                onClick={() => trackCardClick(movie)}
              >
                <div
                  className="absolute inset-0 rounded-xl shadow-[0_0_12px_rgba(255,255,255,0.18)]
                  group-hover:shadow-[0_0_28px_rgba(255,255,255,0.32)]
                  transition-shadow duration-300"
                ></div>

                <img
                  src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                  alt={movie.title || movie.name}
                  className="w-full h-full rounded-xl object-cover transition duration-300 group-hover:brightness-75"
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
