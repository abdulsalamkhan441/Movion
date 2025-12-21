import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import Footer from "../components/footer";
import MovieRow from "../components/MovieRow";

const API_KEY = "5ea9b1a37bb21a007fe88beb2914e5d2";
const DEFAULT_AVATAR = "/placeholder.jpg";
// Use local backgrounds from public folder (no remote/original URLs)
const ALLOWED_BACKGROUNDS = ["/back2.jpg", "/back3.jpg"];

export default function PersonDetail() {
  const { id } = useParams();
  const [person, setPerson] = useState(null);
  const [loading, setLoading] = useState(true);

  // SHORTEN BIO
  const shortenBio = (bio) => {
    if (!bio) return "No biography available.";
    if (bio.length <= 450) return bio;
    return bio.slice(0, 450) + "...";
  };

  // GET COUNTRY/NATIONALITY FROM place_of_birth
  const getNationality = (place) => {
    if (!place) return "Unknown nationality";
    const country = place.split(",").pop().trim().toLowerCase();
    const map = {
      usa: "American",
      "united states": "American",
      "united states of america": "American",
      uk: "British",
      england: "British",
      "united kingdom": "British",
      canada: "Canadian",
      india: "Indian",
      australia: "Australian",
      germany: "German",
      france: "French",
      italy: "Italian",
      mexico: "Mexican",
      spain: "Spanish",
      japan: "Japanese",
      china: "Chinese",
      korea: "Korean",
    };
    return map[country] || country.charAt(0).toUpperCase() + country.slice(1);
  };

  // EXTRACT PARTNER
  const extractPartnerFromBio = (bio) => {
    if (!bio) return null;
    const patterns = [
      /\b(?:partner|spouse|wife|husband|married to)\b[:\s\-]*([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+){0,3})/i,
      /married\s+to\s+([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+){0,3})/i,
      /partnered\s+with\s+([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+){0,3})/i,
      /\bwith\s+([A-Z][A-Za-z]+(?:\s[A-Z][A-Za-z]+){0,3})\b(?:,|\s|$)/i,
    ];
    for (const re of patterns) {
      const m = bio.match(re);
      if (m && m[1]) {
        const name = m[1].trim();
        if (name.length > 2 && /[A-Za-z]/.test(name)) return name;
      }
    }
    return null;
  };

  // MAP MOVIE/TV ITEMS TO ALWAYS HAVE image/title
  const mapItem = (item, mediaType) => ({
    ...item,
    media_type: mediaType,
    title: item.title || item.name || "Untitled",
    image: item.poster_path ? `https://image.tmdb.org/t/p/w500${item.poster_path}` : DEFAULT_AVATAR,
  });

  useEffect(() => {
    let cancelled = false;

    const fetchPerson = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/person/${id}?api_key=${API_KEY}&append_to_response=movie_credits,tv_credits,images`
        );
        const data = await res.json();
        if (cancelled) return;

        // Map movie + TV credits with image/title fallback
        const movieCredits = Array.isArray(data.movie_credits?.cast)
          ? data.movie_credits.cast.map((m) => mapItem(m, "movie"))
          : [];

        const tvCredits = Array.isArray(data.tv_credits?.cast)
          ? data.tv_credits.cast.map((t) => mapItem(t, "tv"))
          : [];

        // Top 12 movies
        const topMovies = [...movieCredits]
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 12);

        // Combine + dedupe
        const combined = [...movieCredits, ...tvCredits];
        const seen = new Set();
        const combinedUnique = [];
        for (const item of combined) {
          const key = `${item.media_type}_${item.id}`;
          if (!seen.has(key)) {
            seen.add(key);
            combinedUnique.push(item);
          }
        }

        // Known for (same as top movies if available)
        const knownFor = [...movieCredits]
          .sort((a, b) => (b.popularity || 0) - (a.popularity || 0))
          .slice(0, 12);

        // Extract partner from biography text
        const partnerName = extractPartnerFromBio(data.biography || "");

        // Choose a local background from allowed set (deterministic by id)
        let backgroundImage = DEFAULT_AVATAR;
        if (Array.isArray(ALLOWED_BACKGROUNDS) && ALLOWED_BACKGROUNDS.length > 0) {
          // deterministic pick so it stays consistent for the same person
          const idx = (data.id || 0) % ALLOWED_BACKGROUNDS.length;
          backgroundImage = ALLOWED_BACKGROUNDS[idx];
        }

        const mapped = {
          id: data.id,
          name: data.name,
          bio: shortenBio(data.biography),
          country: getNationality(data.place_of_birth),
          fullBiography: data.biography || "",
          also_known_as: Array.isArray(data.also_known_as) ? data.also_known_as : [],
          profile: data.profile_path ? `https://image.tmdb.org/t/p/w500${data.profile_path}` : DEFAULT_AVATAR,
          birthday: data.birthday || "Unknown",
          place_of_birth: data.place_of_birth || "Unknown",
          known_for: knownFor,
          partner: {
            name: partnerName || "Not Available",
            image: DEFAULT_AVATAR,
          },
          info: {
            birthday: data.birthday,
            place: data.place_of_birth,
            knownAs: Array.isArray(data.also_known_as) ? data.also_known_as : [],
          },
          topMovies,
          combinedUnique,
          // background we selected (movie scene preferred)
          background: backgroundImage,
        };

        setPerson(mapped);
      } catch (err) {
        console.error("Failed to fetch person:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
    return () => {
      cancelled = true;
    };
  }, [id]);

  if (loading || !person) {
    return (
      <div className="min-h-screen flex items-center justify-center text-white bg-black">
        <p className="text-xl">Loading person…</p>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen w-full relative text-white font-sans overflow-x-hidden bg-black">
        {/* FULLSCREEN BACKGROUND (fade in) */}
        <motion.div
          className="absolute inset-0 bg-center bg-cover pointer-events-none h-screen"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, ease: "easeOut" }}
          style={{
            backgroundImage: `url(${person.background})`,
            backgroundPosition: "center",
            filter: "brightness(0.36) contrast(0.95) saturate(0.9)",
            zIndex: 0,
          }}
          aria-hidden
        />

        {/* subtle cinematic gradient & vignette */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.45) 30%, rgba(0,0,0,0.9) 100%)",
            mixBlendMode: "multiply",
            zIndex: 5,
          }}
        />

        <div className="relative z-10 px-6 md:px-10 py-12">
          <div
            className="absolute inset-0 bg-linear-to-r from-black/90 via-transparent to-transparent pointer-events-none"
            aria-hidden
          />

          <div className="grid grid-cols-12 gap-8 items-start">
            {/* LEFT PANEL */}
            <div className="col-span-12 lg:col-span-3 flex flex-col items-start gap-6 z-20">
              {/* portrait container with backdrop, inner-shadow, film gradient & hover animation */}
              <motion.div
                className="relative rounded-3xl overflow-hidden w-full"
                whileHover={{ scale: 1.03 }}
                transition={{ type: "spring", stiffness: 260, damping: 22 }}
                style={{
                  boxShadow: "0 30px 80px rgba(2,6,23,0.7)",
                  border: "1px solid rgba(255,255,255,0.06)",
                }}
              >
                {/* Film lighting gradient behind portrait (radial + linear) */}
                <div
                  aria-hidden
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "radial-gradient(40% 40% at 30% 20%, rgba(255,180,100,0.07), transparent 15%), radial-gradient(60% 30% at 70% 80%, rgba(80,120,255,0.04), transparent 15%), linear-gradient(180deg, rgba(255,255,255,0.02), transparent 35%)",
                    mixBlendMode: "screen",
                    zIndex: 5,
                  }}
                />

                {/* Backdrop blur behind image */}
                <div
                  aria-hidden
                  className="absolute inset-0 z-0"
                  style={{
                    backdropFilter: "blur(6px)",
                    WebkitBackdropFilter: "blur(6px)",
                  }}
                />

                {/* Inner shadow overlay */}
                <div
                  aria-hidden
                  className="absolute inset-0 z-30 rounded-3xl"
                  style={{
                    boxShadow: "inset 0 40px 90px rgba(0,0,0,0.85), inset 0 -30px 60px rgba(0,0,0,0.55)",
                    pointerEvents: "none",
                  }}
                />

                {/* portrait image */}
                <img
                  src={person.profile}
                  alt={person.name}
                  className="w-full h-[540px] object-cover relative z-10"
                />

                {/* subtle border highlight */}
                <div
                  aria-hidden
                  className="absolute inset-0 rounded-3xl z-40 pointer-events-none"
                  style={{
                    border: "1px solid rgba(255,255,255,0.02)",
                    boxShadow: "0 6px 30px rgba(2,6,23,0.5)",
                  }}
                />
              </motion.div>

              <h1
                className="text-3xl md:text-4xl font-extrabold text-start w-full"
                style={{ fontFamily: "'Orbitron', sans-serif" }}
              >
                {String(person.name).toUpperCase()}
              </h1>
              <h2 className="text-white/80 text-lg">{person.country} actor</h2>
            </div>

            {/* RIGHT PANEL */}
            <div className="col-span-12 lg:col-span-9 z-20">
              <div className="grid grid-cols-12 gap-6">
                <div className="col-span-12">
                  <div className="rounded-[28px] p-8 bg-[rgba(5,10,13,0.55)] border border-white/10 backdrop-blur-md shadow-[0_10px_60px_rgba(2,6,23,0.65)]">
                    <h2 className="text-2xl md:text-3xl font-semibold text-white/95 mb-4">
                      Biography
                    </h2>

                    <p className="text-base md:text-lg text-white/80 leading-relaxed">
                      {person.bio}
                    </p>

                    {person.fullBiography && person.fullBiography.length > 460 && (
                      <details className="mt-4">
                        <summary className="cursor-pointer text-sm text-white/70">
                          Read full biography
                        </summary>
                        <p className="mt-2 text-sm text-white/80 leading-relaxed">
                          {person.fullBiography}
                        </p>
                      </details>
                    )}
                  </div>
                </div>

                {/* PARTNER + INFO */}
                <div className="col-span-12 grid grid-cols-12 gap-6 mt-2">
                  {/* KNOWN AS */}
                  <div className="col-span-12 md:col-span-6">
                    <div className="rounded-[28px] p-6 bg-[rgba(5,10,13,0.5)] border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
                      <h3 className="text-xl font-semibold mb-4 text-white/90">Known As</h3>

                      {person.info.knownAs.length > 0 ? (
                        <ul className="text-white/80 text-lg space-y-2">
                          {person.info.knownAs.map((name, index) => (
                            <li key={index}>• {name}</li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-white/60">No alternative names available.</p>
                      )}
                    </div>
                  </div>

                  {/* INFO */}
                  <div className="col-span-12 md:col-span-6">
                    <div className="rounded-[28px] p-6 bg-[rgba(5,10,13,0.5)] border border-white/10 backdrop-blur-md shadow-[0_8px_40px_rgba(0,0,0,0.55)]">
                      <h3 className="text-xl font-semibold mb-4 text-white/90">Info</h3>

                      <p className="text-white/80 text-sm mb-1">
                        <span className="font-bold">Born:</span> {person.info.birthday || "Unknown"}
                      </p>

                      <p className="text-white/80 text-sm mb-1">
                        <span className="font-bold">Place:</span> {person.info.place || "Unknown"}
                      </p>

                      {person.info.knownAs?.length > 0 && (
                        <p className="text-white/80 text-sm">
                          <span className="font-bold">Also Known As:</span> {person.info.knownAs.join(", ")}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* FILMOGRAPHY / ROWS */}
        <div className="relative z-20 max-w-[1400px] pb-24 pt-20 mx-auto px-6 md:px-0">
          <div className="mb-8">
            <div className="overflow-hidden">
              <MovieRow
                title={"Top Movies"}
                movies={person.topMovies}
                type="movie"
                seeMoreUrl={`/person/${person.id}/movies`}
                className="pt-2"
              />
            </div>
          </div>

          <div className="mb-8">
            <div className="overflow-hidden">
              <MovieRow
                title={"Tv Shows"}
                movies={person.combinedUnique.slice(0, 30)}
                type="mixed"
                seeMoreUrl={`/person/${person.id}/credits`}
                className="pt-2"
              />
            </div>
          </div>
                  <Footer className="z-50" />
        </div>
      </div>
    </>
  );
}
