import React, { useEffect, useRef, useState } from "react";
import movie1 from "../assets/movies/kingsman.png";
import movie2 from "../assets/movies/bellerina.png";
import movie3 from "../assets/movies/moneyheist.png";
import movie4 from "../assets/movies/johnwick.png";
import movie5 from "../assets/movies/spectre.png";
import movie6 from "../assets/movies/mechanic.png";
import movie7 from "../assets/movies/missionfallout.png";
import movie8 from "../assets/movies/extraction.png";
import movie9 from "../assets/movies/peakyblinders.png";

const moviesMeta = [
  "Kingsman",
  "Ballerina",
  "Money Heist",
  "John Wick",
  "Spectre",
  "Mechanic",
  "Mission Impossible",
  "Extraction",
  "Peaky Blinders",
];

const moviesDesc = [
  "A spy agency recruits a street kid into a world of espionage.",
  "An orphan sets out to avenge her father's death.",
  "A criminal mastermind assembles a team for the perfect heist.",
  "A legendary hitman comes out of retirement for one last job.",
  "Bond uncovers a sinister organization while tracking a kidnapper.",
  "An elite assassin makes every hit look like an accident.",
  "Ethan Hunt faces his most dangerous mission yet.",
  "A black-market mercenary on a deadly rescue mission.",
  "A crime family rises in post-war Birmingham.",
];

const movies = [
  movie1,
  movie2,
  movie3,
  movie4,
  movie5,
  movie6,
  movie7,
  movie8,
  movie9,
];

// these must remain unchanged per your request (degrees)
const rotations = [
  "-24deg",
  "-18deg",
  "-12deg",
  "-6deg",
  "0deg",
  "6deg",
  "12deg",
  "18deg",
  "24deg",
];

// base translateY values (correspond to original card width 200)
const baseTranslateY = [170, 112, 68, 40, 30, 40, 70, 110, 172];

export default function MovieCarouselResponsive() {
  const wrapperRef = useRef(null);
  const [cardW, setCardW] = useState(200); // width in px (scales)
  const [cardH, setCardH] = useState(310); // height in px (scales)
  const [selected, setSelected] = useState(null); // for touch toggles

  // Resize handler: compute card width based on viewport width with good clamps
  useEffect(() => {
    const calcSizes = () => {
      const vw = Math.max(
        document.documentElement.clientWidth || 0,
        window.innerWidth || 0
      );

      // Use a responsive formula:
      // cardW = clamp(120px, 14vw, 220px)
      const computed = Math.min(Math.max(vw * 0.14, 120), 220);
      const computedH = Math.round(computed * (310 / 200)); // keep aspect ratio

      setCardW(Math.round(computed));
      setCardH(computedH);
    };

    calcSizes();
    window.addEventListener("resize", calcSizes);
    return () => window.removeEventListener("resize", calcSizes);
  }, []);

  // helper to compute scaled translateY based on base and current card width
  const getTranslateY = (idx) => {
    const scale = cardW / 200; // base was 200
    return `${Math.round(baseTranslateY[idx] * scale)}px`;
  };

  // center index is 4 as in your original (the most front card)
  const centerIndex = 4;

  // zIndex calculation preserving relative stacking visually
  const getZ = (index) => {
    // base behavior from your original: center has highest z, further away lower z
    const distance = Math.abs(centerIndex - index);
    // invert so distance 0 => highest z
    return 100 - distance * 5;
  };

  // handle touch: toggle overlay on tap; desktop uses hover for overlay
  const handleCardClick = (idx, e) => {
    // if pointer is coarse (touch), toggle selection
    if (window.matchMedia("(pointer: coarse)").matches) {
      setSelected((prev) => (prev === idx ? null : idx));
    }
  };

  return (
    <section className="relative w-full flex flex-col items-center justify-between bg-black text-white py-12 overflow-hidden min-h-screen">
      {/* Wheel container */}
      <div
        ref={wrapperRef}
        className="relative w-full max-w-[1200px] mx-auto flex items-start justify-center pb-10"
      >
        <div
          className="relative"
          style={{
            width: "100%",
            height: `${cardH + 40}px`,
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "center",
            overflow: "visible",
            paddingTop: `${cardH * 0.05}px`,
          }}
        >
          {/* cards container: we use manual absolute placement */}
          <div
            className="relative w-full flex items-center justify-center"
            style={{ height: `${cardH}px` }}
          >
            {movies.map((img, index) => {
              // compute x offset: distribute cards across width, while keeping center at 50%
              // We'll space them using a base horizontal spacing that scales with cardW
              const spacing = Math.round(cardW * 0.6); // overlap negative margin
              const offsetFromCenter = (index - centerIndex) * spacing;

              const translateY = getTranslateY(index);
              const rotation = rotations[index];

              return (
                <div
                  key={index}
                  className="absolute top-0 transform-gpu"
                  style={{
                    left: `calc(50% + ${offsetFromCenter}px - ${cardW / 2}px)`,
                    transform: `translateY(${translateY}) rotate(${rotation})`,
                    width: `${cardW}px`,
                    height: `${cardH}px`,
                    zIndex: getZ(index),
                    transition:
                      "transform 350ms cubic-bezier(.2,.9,.2,1), z-index 200ms",
                    // enable smoother 3D feel
                    transformStyle: "preserve-3d",
                  }}
                >
                  <div
                    onClick={(e) => handleCardClick(index, e)}
                    className="relative w-full h-full group rounded-[28px] overflow-hidden"
                    role="button"
                    tabIndex={0}
                    onKeyDown={() => {}}
                    aria-label={moviesMeta[index]}
                    style={{ perspective: "900px" }}
                  >
                    {/* Poster Image */}
                    <img
                      src={img}
                      alt={moviesMeta[index]}
                      draggable={false}
                      className="w-full h-full object-cover transition-transform duration-300 ease-out group-hover:scale-105 opacity-90"
                      style={{
                        borderRadius: "28px",
                        display: "block",
                        transformOrigin: "50% 50%",
                      }}
                    />

                    {/* Hover Overlay */}
                    <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-[28px] flex flex-col items-center justify-center text-center p-4">
                      <h3 className="text-black text-sm font-bold mb-2">
                        {moviesMeta[index]}
                      </h3>
                      <p className="text-black text-xs opacity-90">
                        {moviesDesc[index]}
                      </p>
                    </div>

                    {/* Glow Effect */}
                    <div className="absolute inset-0 rounded-[28px] opacity-0 group-hover:opacity-100 transition-opacity duration-700 shadow-[0_0_20px_2px_rgba(155,155,155,0.8)] pointer-events-none" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Title - Updated positioning */}
      <div className="w-full mt-auto pb-8 sm:pb-12 md:pb-16 px-4">
        <h2
          className="text-white text-2xl sm:text-3xl md:text-4xl text-center font-light tracking-wider z-50"
          style={{ fontFamily: "AZONIX" }}
        >
          Step Into a World of{" "}
          <span className="block mt-2">Endless Stories.</span>
        </h2>
      </div>
    </section>
  );
}
