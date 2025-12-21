// src/pages/profilepage.jsx
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import MovieRow from "../components/MovieRow";
import Footer from "../components/footer";
import { useNavigate } from "react-router-dom";

// public assets are served from root in Vite
const pic1 = "/pic1.png";
const pic2 = "/pic2.png";

// Preset avatars (add more image files to /public to expand)
const PRESET_AVATARS = [
  "/pic1.png",
  "/avatar2.png", // optional: add to public
  "/avatar3.png", // optional: add to public
];

// Allowed background images (only these can be selected)
const ALLOWED_BACKGROUNDS = [
  "/pic2.png",
  "/bg1.jpg", // optional: add to public
  "/bg2.jpg", // optional: add to public
];

const DEFAULT_AVATAR = pic1;
const DEFAULT_BACKGROUND = pic2;
const PROFILE_SETTINGS_KEY = "profileSettings";

export default function Profiledetail() {
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  // Notice visibility (persists dismissal in localStorage)
  const [showNotice, setShowNotice] = useState(false);
  useEffect(() => {
    const dismissed = localStorage.getItem("profile_notice_dismissed") === "1";
    if (!dismissed) setShowNotice(true);
  }, []);

  const dismissNotice = () => {
    localStorage.setItem("profile_notice_dismissed", "1");
    setShowNotice(false);
  };

  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);
  const [lastWatch, setLastWatch] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [loading, setLoading] = useState(true);
  const [profileSettings, setProfileSettings] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(PROFILE_SETTINGS_KEY)) || {
        avatar: DEFAULT_AVATAR,
        background: DEFAULT_BACKGROUND,
        bio: "",
      };
    } catch {
      return {
        avatar: DEFAULT_AVATAR,
        background: DEFAULT_BACKGROUND,
        bio: "",
      };
    }
  });

  // Fetch current user info from backend (preferred), fallback to localStorage 'user'
  useEffect(() => {
    if (!token) {
      navigate("/login");
      return;
    }

    const abortController = new AbortController();

    async function loadUser() {
      setLoading(true);
      // Try /api/auth/me first
      try {
        const res = await fetch("/api/auth/me", {
          headers: { Authorization: `Bearer ${token}` },
          signal: abortController.signal,
        });

        if (res.ok) {
          const data = await res.json();
          setUser(data.user || data); // depending on backend shape
        } else {
          // fallback to localStorage user
          const stored = localStorage.getItem("user");
          if (stored) setUser(JSON.parse(stored));
        }
      } catch (err) {
        // network or other error -> fallback to localStorage
        const stored = localStorage.getItem("user");
        if (stored) setUser(JSON.parse(stored));
      }

      setLoading(false);
    }

    loadUser();

    return () => abortController.abort();
  }, [token, navigate]);

  // Fetch watchlist / history from backend or fallback to user fields
  useEffect(() => {
    if (!token || !user) return;

    let cancelled = false;

    async function loadLists() {
      // Try endpoints - if they exist in your backend, they will return arrays.
      // If not, fall back to properties on the user object (user.watchlist, user.lastWatch)
      try {
        const [hRes, wRes] = await Promise.all([
          fetch("/api/user/history", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          fetch("/api/user/watchlist", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        if (!cancelled) {
          if (hRes.ok) {
            const hData = await hRes.json();
            setLastWatch(Array.isArray(hData) ? hData : hData.history || []);
          } else {
            setLastWatch(Array.isArray(user.lastWatch) ? user.lastWatch : []);
          }

          if (wRes.ok) {
            const wData = await wRes.json();
            setWatchlist(Array.isArray(wData) ? wData : wData.watchlist || []);
          } else {
            setWatchlist(Array.isArray(user.watchlist) ? user.watchlist : []);
          }
        }
      } catch (err) {
        // fallback
        if (!cancelled) {
          setLastWatch(Array.isArray(user.lastWatch) ? user.lastWatch : []);
          setWatchlist(Array.isArray(user.watchlist) ? user.watchlist : []);
        }
      }
    }

    loadLists();

    return () => {
      cancelled = true;
    };
  }, [token, user]);

  // Fetch engagement stats (optional endpoint - falls back gracefully)
  useEffect(() => {
    if (!token) return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/user/stats", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!cancelled && res.ok) {
          const d = await res.json();
          setStats(d);
        }
      } catch (e) {
        // ignore - stats endpoint optional
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [token]);

  // Persist profile settings
  useEffect(() => {
    localStorage.setItem(PROFILE_SETTINGS_KEY, JSON.stringify(profileSettings));
  }, [profileSettings]);

  // Compute derived fields
  const computed = React.useMemo(() => {
    const baseUser = user || {};
    // Prefer stats.firstSeen -> user.createdAt -> fallback
    let createdAt = stats?.firstSeen || baseUser.createdAt || baseUser.joined || null;
    let joinedString = "Unknown";
    let accountYears = 0;

    if (createdAt) {
      // try to parse ISO first
      const parsed = new Date(createdAt);
      if (!isNaN(parsed.getTime())) {
        joinedString = parsed.toLocaleDateString();
        accountYears = (Date.now() - parsed.getTime()) / 31536000000; // years
      } else {
        // attempt to parse strings like "2018 · Mar 23"
        try {
          const cleaned = createdAt.replace("·", "").trim();
          const parsed2 = new Date(cleaned);
          if (!isNaN(parsed2.getTime())) {
            joinedString = parsed2.toLocaleDateString();
            accountYears = (Date.now() - parsed2.getTime()) / 31536000000;
          }
        } catch {}
      }
    }

    // Membership level based on account age
    let role = "NEWBIE";
    if (accountYears >= 5) role = "ELITE";
    else if (accountYears >= 2) role = "PRO USER";
    else if (accountYears >= 1) role = "MEMBER";
    else role = "NEWBIE";

    // Total watched: prefer stats -> lastWatch array
    const totalWatched = stats?.totalWatched ?? (Array.isArray(lastWatch) ? lastWatch.length : 0);
    const cardClicks = stats?.cardClicks ?? 0;

    return {
      name: baseUser.name || baseUser.firstName || baseUser.username || "User",
      role,
      joinedString,
      accountYears,
      totalWatched,
      cardClicks,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user, lastWatch, stats]);

  // Generate a short AI-style biography using the user's lastWatch + watchlist
  function generateBio(lastWatchList, watchlistArr) {
    const last = Array.isArray(lastWatchList) ? lastWatchList : [];
    const watch = Array.isArray(watchlistArr) ? watchlistArr : [];

    const titles = [
      ...(last.slice(0, 3).map((m) => (m.title ? m.title : m.name ? m.name : String(m)))),
      ...(watch.slice(0, 3).map((m) => (m.title ? m.title : m.name ? m.name : String(m)))),
    ].filter(Boolean);

    if (titles.length === 0) {
      return `A curious viewer who enjoys discovering new stories and hidden gems. Prefers intelligent plots and strong characters.`;
    }

    // Craft a couple of sentences
    const first = `A viewer drawn to ${titles[0] ? `"${titles[0]}"` : "thoughtful storytelling"}.`;
    const second = titles.length > 1
      ? `Recently watched ${titles.slice(0, Math.min(2, titles.length)).map(t => `"${t}"`).join(" and ")} and has more queued for later.`
      : `Always on the lookout for the next great watch.`;

    return `${first} ${second} Prefers engaging plots and character-driven dramas.`;
  }

  // Handlers for avatar/background changes
  function handleSelectAvatar(url) {
    setProfileSettings((prev) => ({ ...prev, avatar: url }));
  }

  function handleUploadAvatar(e) {
    const file = e.target.files && e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function (ev) {
      const base64 = ev.target.result;
      // store base64 as avatar (client-only)
      setProfileSettings((prev) => ({ ...prev, avatar: base64 }));
    };
    reader.readAsDataURL(file);
  }

  function handleSelectBackground(url) {
    if (!ALLOWED_BACKGROUNDS.includes(url)) return; // enforce allowed set
    setProfileSettings((prev) => ({ ...prev, background: url }));
  }

  // Replace the temporary gems/spent with different stats (no extra feature required)
  function Stat({ title, value }) {
    return (
      <div className="rounded-2xl p-5 bg-white/5 border border-white/10 text-center">
        <p className="text-white/60 text-sm">{title}</p>
        <p className="text-lg font-semibold mt-1">{value}</p>
      </div>
    );
  }

  // UI: no layout changes — small controls placed subtly below avatar
  const shownAvatar = profileSettings.avatar || DEFAULT_AVATAR;
  const shownBackground = profileSettings.background || DEFAULT_BACKGROUND;
  const shownBio = profileSettings.bio && profileSettings.bio.length > 10
    ? profileSettings.bio
    : generateBio(lastWatch, watchlist);

  // Keep rendering consistent while loading
  if (loading && !user) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <p>Loading profile…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white overflow-x-hidden">
      {/* BACKGROUND */}
      <div className="relative">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 h-screen bg-cover bg-center"
          style={{
            backgroundImage: `url(${shownBackground})`,
            filter: "brightness(0.36)",
          }}
        />
        <div className="absolute inset-0 h-screen bg-linear-to-b from-black/60 via-black/40 to-black" />
      </div>

      {/* CONTENT */}
      <div className="relative z-10 px-6 md:px-12 pt-28 max-w-[1400px] mx-auto">
        {showNotice && (
              <div className="mx-4 md:mx-8 my-4 bg-gray-900 text-white rounded-lg p-4 flex items-start justify-between gap-4 shadow-md">
                <div className="text-sm md:text-base">
                  <strong className="block font-semibold">
                    Notice — Under Construction
                  </strong>
                  <span className="block mt-1">
                    Due to limited development resources, the Profile page is
                    currently under construction. Some features may be
                    unavailable. We appreciate your patience and welcome any
                    feedback.
                  </span>
                </div>
                <button
                  onClick={dismissNotice}
                  className="text-white/90 hover:text-white ml-4 text-sm"
                  aria-label="Dismiss notice"
                >
                  Dismiss
                </button>
              </div>
            )}
        <div className="grid grid-cols-12 gap-10">
          {/* LEFT */}
          <div className="col-span-12 lg:col-span-3 flex flex-col gap-6">
            <motion.div
              whileHover={{ scale: 1.04 }}
              className="rounded-3xl overflow-hidden shadow-[0_30px_80px_rgba(0,0,0,0.8)]"
            >
              <img
                src={shownAvatar}
                alt={computed.name}
                className="w-full h-[480px] object-cover"
              />
            </motion.div>

            <h1 className="text-3xl font-extrabold tracking-wide">
              {String(computed.name).toUpperCase()}
            </h1>
            <span className="text-white/70 text-sm">{computed.role}</span>

            {/* Small unobtrusive controls (do not change layout) */}
            <div className="mt-2 space-y-2 text-sm">
              <div className="flex items-center gap-3">
                <label className="cursor-pointer underline text-sm">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleUploadAvatar}
                    className="hidden"
                  />
                  Upload Avatar
                </label>

                <div className="flex gap-2 items-center">
                  {PRESET_AVATARS.map((a) => (
                    <button
                      key={a}
                      onClick={() => handleSelectAvatar(a)}
                      className="w-8 h-8 rounded-full overflow-hidden border border-white/20"
                      title="Select preset avatar"
                    >
                      <img src={a} alt="avatar" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <div className="mb-1 text-white/70 text-xs">Change Background</div>
                <div className="flex gap-2">
                  {ALLOWED_BACKGROUNDS.map((b) => (
                    <button
                      key={b}
                      onClick={() => handleSelectBackground(b)}
                      className="w-14 h-8 rounded overflow-hidden border border-white/20"
                      title="Select background"
                    >
                      <div
                        style={{
                          backgroundImage: `url(${b})`,
                          backgroundSize: "cover",
                          backgroundPosition: "center",
                          width: "100%",
                          height: "100%",
                        }}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* RIGHT */}
          <div className="col-span-12 lg:col-span-9 space-y-8">
            {/* BIO */}
            <div className="rounded-3xl p-8 bg-white/5 border border-white/10 backdrop-blur-md">
              <h2 className="text-2xl font-semibold mb-4">About / Preference</h2>

              <p className="text-white/80 leading-relaxed mb-4">{shownBio}</p>

              {/* Short editable bio override */}
              <div className="mt-4">
                <label className="text-white/70 text-sm block mb-1">Short bio (optional)</label>
                <textarea
                  placeholder="Write a short bio or keep the AI-generated one..."
                  value={profileSettings.bio}
                  onChange={(e) => setProfileSettings((p) => ({ ...p, bio: e.target.value }))}
                  className="w-full bg-black/30 border border-white/10 p-3 rounded resize-none text-white"
                  rows={3}
                />
              </div>
            </div>

            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <Stat title="Joined" value={computed.joinedString} />
              <Stat title="Total Watched" value={computed.totalWatched} />
              <Stat title="Cards Clicked" value={computed.cardClicks} />
              <Stat title="Membership Level" value={computed.role} />
            </div>
          </div>
        </div>

        {/* MOVIE ROWS */}
        <div className="mt-20 space-y-16">
          <MovieRow
            title="Last Watch"
            movies={lastWatch}
            type="movie"
            seeMoreUrl="/history"
          />

          <MovieRow
            title="Watchlist"
            movies={watchlist}
            type="movie"
            seeMoreUrl="/watchlist"
          />
        </div>
      </div>

      <Footer />
    </div>
  );
}
