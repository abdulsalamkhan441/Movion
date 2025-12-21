import React, { useEffect, useState, useRef } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";
import PersonDetail from "./PersonDetail";
import Footer from "../components/footer";

const CastPage = () => {
  const [animeMovies, setAnimeMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  // Fetch Anime movies (discover by genre id 16 - Animation)
  const fetchAnime = async (pageNum = 1) => {
    if (loading || !TMDB_KEY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=16&language=en-US&page=${pageNum}`
      );
      const data = await res.json();
      setAnimeMovies((prev) => [
        ...prev,
        ...(Array.isArray(data.results) ? data.results : []),
      ]);
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch Anime movies:", err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!TMDB_KEY) {
      console.error("TMDB API key missing (VITE_TMDB_KEY)");
      return;
    }
    fetchAnime();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          fetchAnime(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);

    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
  }, [page, totalPages]);

  return (
    <>
      {/* HERO + SIDEBAR SECTION */}
      <section className="relative w-full min-h-screen bg-black">
        <div className="flex flex-col md:grid md:grid-cols-[120px_1fr]">
          {/* SIDEBAR */}
          <div className="w-full md:w-auto bg-black z-50">
            <Sidebarlayout />
          </div>

          {/* MAIN CONTENT */}
          <div className="min-w-0 w-full overflow-hidden">
            <PersonDetail />
          </div>
        </div>
      </section>
    </>
  );
};

export default CastPage;
