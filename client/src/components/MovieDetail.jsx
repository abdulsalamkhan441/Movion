import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import Footer from "./footer";

/* ---------------- TMDB API ---------------- */
const API_KEY = "5ea9b1a37bb21a007fe88beb2914e5d2";

/* Fallback screenshot (public) */
const DEFAULT_BACKDROP = "/placeholder.jpg";

/* Badge Component */
const Badge = ({ children }) => (
  <span className="inline-block px-3 py-1 text-xs md:text-sm rounded-full border border-white/20 text-white/95 bg-white/5 backdrop-blur-sm">
    {children}
  </span>
);

export default function MovieDetail() {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [trailerOpen, setTrailerOpen] = useState(false);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "auto";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    let cancelled = false;

    const getMovieDetails = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/movie/${id}?api_key=${API_KEY}&append_to_response=credits,videos`
        );
        const data = await res.json();
        if (cancelled) return;

        /* ---------------- DIRECTOR ---------------- */
        const director =
          data.credits?.crew?.find((c) => c.job === "Director")?.name || "N/A";

        /* ---------------- CAST ---------------- */
        // include the actor.id so we can link to their detail page
        const cast = (data.credits?.cast || []).slice(0, 12).map((actor) => ({
          id: actor.id,
          name: actor.name,
          role: actor.character,
          avatar: actor.profile_path
            ? `https://image.tmdb.org/t/p/w300${actor.profile_path}`
            : "/placeholder.jpg",
        }));

        /* ---------------- PROVIDERS — DIRECT LINKS ONLY ---------------- */
        const rawTitle = data.title || data.name || "";

        // For Netflix, Prime, Tubi (URL encoded)
        const encodedTitle = encodeURIComponent(rawTitle);

        // For HDToday — spaces replaced with hyphens
        const hyphenTitle = rawTitle.trim().replace(/\s+/g, "-").toLowerCase();

        const providerLinks = {
          netflix: `https://www.netflix.com/search?q=${encodedTitle}`,
          prime: `https://www.primevideo.com/search/ref=atv_nb_sr?phrase=${encodedTitle}`,
          tubi: `https://tubitv.com/search/${encodedTitle}`,
          hdtoday: `https://hdtodayz.to/search/${hyphenTitle}`,
        };

        /* ---------------- FINAL MAPPED MOVIE OBJECT ---------------- */
        const mapped = {
          id: data.id,
          title: data.title || data.name || "Untitled",
          tagline: data.tagline || "",
          genres: data.genres?.map((g) => g.name) || [],
          synopsis: data.overview || "",
          director,
          prequel: "N/A",
          release: {
            date: data.release_date || "N/A",
            region:
              data.production_countries?.[0]?.iso_3166_1 ||
              data.origin_country?.[0] ||
              "",
          },
          ratings: {
            imdb: {
              score: data.vote_average
                ? data.vote_average.toFixed(1) + "/10"
                : "N/A",
            },
            rotten: { score: "N/A" },
            facebook: { score: "N/A" },
          },
          cast,
          poster: data.poster_path
            ? `https://image.tmdb.org/t/p/w500${data.poster_path}`
            : "",
          backdrop: data.backdrop_path
            ? `https://image.tmdb.org/t/p/original${data.backdrop_path}`
            : "",
          videos: data.videos || { results: [] },
          providers: providerLinks,
        };

        setMovie(mapped);
      } catch (err) {
        console.error("Failed to fetch movie:", err);
      } finally {
        setLoading(false);
      }
    };

    getMovieDetails();
    return () => {
      cancelled = true;
    };
  }, [id]);

  /* ---------------- LOADING ---------------- */
  if (loading || !movie) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl">Loading movie details…</p>
      </div>
    );
  }

  /* ---------------- TRAILER ---------------- */
  const trailer = (movie.videos?.results || []).find(
    (vid) => vid.type === "Trailer" && vid.site === "YouTube"
  );
  const trailerUrl = trailer
    ? `https://www.youtube.com/embed/${trailer.key}?autoplay=1`
    : null;

  return (
    <>
      <div className="min-h-screen h-screen w-full relative text-white font-sans overflow-y-auto">
        {/* Background (blurred) */}
        <div
          className="absolute inset-0 bg-center bg-cover filter blur-[3px] brightness-50 saturate-90"
          style={{
            backgroundImage: `url(${
              movie.backdrop || movie.poster || DEFAULT_BACKDROP
            })`,
          }}
          aria-hidden
        />

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-linear-to-r from-black/90 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-l from-black/50 via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-linear-to-t from-black via-transparent to-transparent pointer-events-none" />

        {/* MAIN CONTENT */}
        <div className="relative z-10 max-w-350 mx-auto px-6 md:px-10 py-12">
          <div className="grid grid-cols-12 gap-8 items-start">
            {/* LEFT: Poster + Title */}
            <div className="col-span-12 lg:col-span-3 flex flex-col items-start gap-6">
              <div className="w-full">
                <div className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.75)] border border-white/8">
                  <img
                    src={movie.poster || DEFAULT_BACKDROP}
                    alt={movie.title}
                    className="w-full h-130 md:h-135 object-cover"
                  />
                </div>
              </div>

              <div className="mt-2 w-full">
                <h1
                  className="text-3xl md:text-4xl font-extrabold leading-tight tracking-wider text-center text-white drop-shadow-[0_2px_12px_rgba(0,0,0,0.75)]"
                  style={{ fontFamily: "'Orbitron', sans-serif" }}
                >
                  {String(movie.title).toUpperCase()}
                </h1>
              </div>
            </div>

            {/* RIGHT: big panels */}
            <div className="col-span-12 lg:col-span-9">
              <div className="grid grid-cols-12 gap-6">
                {/* Tagline + Synopsis */}
                <div className="col-span-12">
                  <div className="rounded-[28px] p-8 bg-[rgba(5,10,13,0.55)] border border-white/10 backdrop-blur-md shadow-[0_10px_60px_rgba(2,6,23,0.65)] min-h-[40vh] flex flex-col justify-between">
                    <div className="flex items-start gap-4">
                      <div className="text-6xl md:text-7xl font-extrabold text-white/20 -mt-2 select-none">
                        “
                      </div>

                      <div>
                        <h2 className="text-2xl md:text-3xl font-medium text-white/95 mb-4 leading-tight">
                          {movie.tagline || "Welcome to a world without rules."}
                        </h2>

                        <div className="flex gap-3 flex-wrap mb-4">
                          {movie.genres.length ? (
                            movie.genres.map((g) => <Badge key={g}>{g}</Badge>)
                          ) : (
                            <>
                              <Badge>Drama</Badge>
                              <Badge>Action</Badge>
                              <Badge>Crime</Badge>
                              <Badge>Thriller</Badge>
                            </>
                          )}
                        </div>

                        <p className="text-base md:text-lg text-white/80 leading-relaxed">
                          {movie.synopsis || "No synopsis available."}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Cast */}
                <div className="col-span-12">
                  <div className="rounded-[28px] p-6 bg-[rgba(5,10,13,0.5)] border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
                    <h3 className="text-xl font-semibold mb-4 text-white/90">
                      Cast
                    </h3>

                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-6 pb-3">
                      {(movie.cast || []).map((c, idx) => (
                        <Link
                          key={c.id || idx}
                          to={`/person/${c.id}`}
                          className="flex flex-col items-center group"
                        >
                          <div className="w-20 h-20 md:w-24 md:h-24 rounded-full overflow-hidden border-2 border-white/20 shadow-[0_6px_20px_rgba(0,0,0,0.6)]">
                            <img
                              src={c.avatar}
                              alt={c.name}
                              className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                            />
                          </div>
                          <div className="mt-2 text-center">
                            <div className="text-sm font-semibold text-white truncate">
                              {c.name}
                            </div>
                            <div className="text-xs text-white/60 truncate">
                              {c.role}
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Director / Prequel */}
                <div className="col-span-12 md:col-span-6">
                  <div className="rounded-2xl p-4 bg-[rgba(3,6,10,0.38)] border border-white/10 backdrop-blur-md shadow-[0_8px_35px_rgba(0,0,0,0.55)] h-full">
                    <div className="text-sm text-white/60">Director:</div>
                    <div className="text-base font-semibold text-white mb-4">
                      {movie.director}
                    </div>

                    <div className="border-t border-white/10 pt-3">
                      <div className="text-sm text-white/60">Prequel:</div>
                      <div className="text-base font-semibold text-white">
                        {movie.prequel}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Release Date + Ratings */}
                <div className="col-span-12 md:col-span-6">
                  <div className="rounded-2xl p-4 bg-[rgba(3,6,10,0.38)] border border-white/10 backdrop-blur-md shadow-[0_8px_35px_rgba(0,0,0,0.55)] h-full">
                    <div>
                      <div className="text-sm text-white/60">Release Date:</div>
                      <div className="text-base font-semibold text-white mb-4">
                        {movie.release.date}
                        <span className="text-xs text-blue-300 ml-2">
                          ({movie.release.region || "N/A"})
                        </span>
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-3 mt-3">
                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10">
                        <div className="text-xs text-white/70">IMDb</div>
                        <div className="text-sm font-semibold text-white">
                          {movie.ratings.imdb.score}
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 opacity-40">
                        <div className="text-xs text-white/70">Rotten</div>
                        <div className="text-sm font-semibold text-white">
                          {movie.ratings.rotten.score}
                        </div>
                      </div>

                      <div className="px-3 py-2 rounded-lg bg-white/5 border border-white/10 opacity-40">
                        <div className="text-xs text-white/70">Facebook</div>
                        <div className="text-sm font-semibold text-white">
                          {movie.ratings.facebook.score}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* TRAILER + WHERE TO WATCH */}
        <div className="max-w-350 mx-auto mt-10 px-6 md:px-10">
          <div className="rounded-[28px] overflow-hidden shadow-[0_20px_60px_rgba(0,0,0,0.7)] border border-white/10 mb-10">
            <div className="relative w-full h-87.5 md:h-105 bg-black">
              <img
                src={movie.backdrop || movie.poster || DEFAULT_BACKDROP}
                alt="Trailer"
                className="w-full h-full object-cover opacity-70"
              />

              {trailerUrl && (
                <button
                  className="absolute inset-0 flex items-center justify-center"
                  onClick={() => setTrailerOpen(true)}
                >
                  <div className="w-20 h-20 md:w-24 md:h-24 bg-red-600 rounded-full flex items-center justify-center shadow-lg hover:scale-105 transition">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="#fff"
                      viewBox="0 0 24 24"
                      className="w-10 h-10 md:w-12 md:h-12 ml-1"
                    >
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </button>
              )}

              <div className="absolute bottom-6 left-6 text-white/90">
                <div className="text-5xl font-extrabold tracking-tight opacity-20 leading-none">
                  KHD
                </div>
                <div className="text-3xl font-semibold -mt-2 tracking-wide opacity-30">
                  TRAILER
                </div>
              </div>
            </div>
          </div>

          {trailerOpen && trailerUrl && (
            <div
              className="fixed inset-0 bg-black/80 flex items-center justify-center z-50"
              onClick={() => setTrailerOpen(false)}
            >
              <iframe
                src={trailerUrl}
                className="w-[90vw] md:w-[80vw] h-[50vh] md:h-[70vh]"
                title="Trailer"
                allow="autoplay; fullscreen"
                allowFullScreen
              ></iframe>
            </div>
          )}

          <div className="max-w-350 mx-auto mt-6 px-6 md:px-10">
            <div className="rounded-3xl p-6 bg-[rgba(5,10,13,0.55)] border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.6)] flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <div className="text-lg font-semibold text-white/90">
                  Where To Watch:
                </div>
                <div className="text-sm text-white/60">
                  CLICK ON THE LOGO TO REDIRECT
                </div>
              </div>

              <div className="flex items-center gap-10 md:gap-16">
                <a
                  href={movie.providers?.netflix}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/0/08/Netflix_2015_logo.svg"
                    alt="Netflix"
                    className="h-10 cursor-pointer"
                  />
                </a>

                <a
                  href={movie.providers?.prime}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100"
                >
                  <img
                    src="https://upload.wikimedia.org/wikipedia/commons/f/f1/Prime_Video.png"
                    alt="Prime Video"
                    className="h-10 cursor-pointer"
                  />
                </a>

                <a
                  href={movie.providers?.hdtoday}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100"
                >
                  <img
                    src="/hdtoday.png"
                    alt="HD Today"
                    className="h-10 cursor-pointer"
                  />
                </a>

                <a
                  href={movie.providers?.tubi}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="opacity-90 hover:opacity-100"
                >
                  <img
                    src="/tubi.png"
                    alt="Tubi"
                    className="h-10 cursor-pointer"
                  />
                </a>
              </div>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    </>
  );
}
