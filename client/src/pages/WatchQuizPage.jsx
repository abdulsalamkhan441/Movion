import React, { useState } from "react";
import { motion } from "framer-motion";
import Sidebarlayout from "../components/SidebarLayout";
import MovieRow2 from "../components/MovieRow2";
import Footer from "../components/footer";
import AIIntroVideo from "../components/AIIntroVideo";

const backgroundUrl = "/background.png";
const pictureUrl = "/picture.jpg"; // <-- public/picture.png

const WatchQuizPage = () => {
  const [step, setStep] = useState(0);
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState([]);

  const [answers, setAnswers] = useState({
    mood: "",
    genres: "",
    pace: "",
    emotionalWeight: "",
    familiarity: "",
    subtitles: "",
    endingFeeling: "",
  });

  const questions = [
    {
      key: "mood",
      question: "What is your current mood?",
      options: [
        "Relaxed",
        "Intense",
        "Emotional",
        "Thoughtful",
        "Just for fun",
      ],
    },
    {
      key: "genres",
      question: "What genres are you in the mood for — or want to avoid?",
      options: [
        "Action / Thriller",
        "Drama / Romance",
        "Sci-Fi / Fantasy",
        "Comedy",
        "Surprise me",
      ],
    },
    {
      key: "pace",
      question: "How fast should the movie feel?",
      options: ["Fast-paced", "Balanced", "Slow / Atmospheric"],
    },
    {
      key: "emotionalWeight",
      question: "How emotionally heavy can it be right now?",
      options: ["Light", "Medium", "Heavy"],
    },
    {
      key: "familiarity",
      question: "Do you want something familiar or a discovery?",
      options: ["Familiar / Rewatch-safe", "Something new", "Unexpected"],
    },
    {
      key: "subtitles",
      question: "Are subtitles acceptable?",
      options: ["Yes", "No"],
    },
    {
      key: "endingFeeling",
      question: "What do you want to feel when it ends?",
      options: [
        "Satisfied",
        "Inspired",
        "Disturbed",
        "Thoughtful",
        "Entertained",
      ],
    },
  ];

  const handleAnswer = (key, value) => {
    setAnswers((prev) => ({ ...prev, [key]: value }));
    setStep((prev) => prev + 1);
  };

  const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:5000";

  const generateResults = async () => {
    setLoading(true);
    setResults([]);

    try {
      const res = await fetch(`${API_BASE}/api/ai-recommend`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: answers,
          watchlist: [], // or real watchlist titles
        }),
      });

      if (!res.ok) return;

      const data = await res.json();
      setResults(
        Array.isArray(data.recommendations) ? data.recommendations : []
      );
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative min-h-screen w-full bg-black text-white overflow-hidden">
      <div className="flex min-h-screen">
        <Sidebarlayout />

        <div className="relative flex-1">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${backgroundUrl})` }}
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/80 via-black/40 to-black/90" />

          <div className="relative z-10 px-6 md:px-10 pt-20 max-w-[1400px] mx-auto">
            <h1
              className="text-4xl md:text-5xl font-extrabold mb-10 text-center"
              style={{ fontFamily: "'Azonix', sans-serif" }}
            >
              DON’T KNOW WHAT TO WATCH
            </h1>

            {/* 50 / 50 GRID */}
            {/* CENTERED QUIZ SECTION */}
            <div className="flex items-center justify-center min-h-[70vh]">
              <div className="relative">
                {/* NEON GLOW */}
                <div className="absolute inset-0 rounded-3xl blur-2xl opacity-40 bg-linear-to-br from-white/20 via-white/10 to-transparent animate-pulse-slow" />

                {/* MAIN CARD */}
                <motion.div
                  key={step}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                  className="relative w-full max-w-xl mx-auto"
                >
                  <div
                    className="
          relative rounded-3xl p-10
          bg-[rgba(10,14,18,0.8)]
          border border-white/15
          backdrop-blur-xl
          shadow-[0_0_40px_rgba(255,255,255,0.08)]
        "
                  >
                    {/* INNER EDGE GLOW */}
                    <div className="pointer-events-none absolute inset-0 rounded-3xl ring-1 ring-white/10 shadow-inner" />

                    {/* PROGRESS */}
                    <div className="mb-8 relative z-10">
                      <div className="flex justify-between text-xs uppercase tracking-widest text-white/40 mb-2">
                        <span>
                          Question {Math.min(step + 1, questions.length)}
                        </span>
                        <span>{questions.length}</span>
                      </div>
                      <div className="h-0.5 bg-white/10 rounded-full overflow-hidden">
                        <div
                          className="h-full bg-white transition-all duration-300"
                          style={{
                            width: `${(step / questions.length) * 100}%`,
                          }}
                        />
                      </div>
                    </div>

                    {/* CONTENT */}
                    <div className="relative z-10">
                      {step < questions.length ? (
                        <>
                          <h2 className="text-2xl md:text-3xl font-semibold mb-8 leading-snug">
                            {questions[step].question}
                          </h2>

                          <div className="grid grid-cols-2 gap-4">
                            {questions[step].options.map((opt) => (
                              <button
                                key={opt}
                                onClick={() =>
                                  handleAnswer(questions[step].key, opt)
                                }
                                className="
                      py-3 px-4 rounded-xl
                      border border-white/15
                      text-sm uppercase tracking-wide
                      hover:bg-white hover:text-black
                      transition-all duration-200
                    "
                              >
                                {opt}
                              </button>
                            ))}
                          </div>
                        </>
                      ) : (
                        <>
                          <h2 className="text-2xl md:text-3xl font-semibold mb-4">
                            Taste Profile Complete
                          </h2>

                          <p className="text-white/60 mb-8 leading-relaxed">
                            Our AI is analyzing your preferences to find the
                            best possible match.
                          </p>

                          <button
                            onClick={generateResults}
                            className="
                  w-full py-4 rounded-full
                  bg-white text-black
                  font-semibold tracking-wide
                  hover:opacity-90
                  transition
                "
                          >
                            {loading ? "Analyzing..." : "Reveal My Picks"}
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>

            {results.length > 0 && (
              <div className="mt-12">
                <MovieRow2 title="AI Picks For You" movies={results} />
              </div>
            )}

            <Footer />
          </div>
        </div>
      </div>
    </section>
  );
};

export default WatchQuizPage;
