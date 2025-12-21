import React, { useEffect, useState, useRef } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";
import GenrePage from "../sections/generepage";

const Search = () => {
  const [romanceMovies, setRomanceMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  // Fetch Romance movies (discover by genre id 10749)
  const fetchRomance = async (pageNum = 1) => {
    if (loading || !TMDB_KEY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/discover/movie?api_key=${TMDB_KEY}&with_genres=10749&language=en-US&page=${pageNum}`
      );
      const data = await res.json();
      setRomanceMovies((prev) => [
        ...prev,
        ...(Array.isArray(data.results) ? data.results : []),
      ]);
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch Romance movies:", err);
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
    fetchRomance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          fetchRomance(page + 1);
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
    <div className="flex h-screen bg-black overflow-hidden">
      {/* SIDEBAR (fixed, no scroll) */}
      <div className="fixed left-0 top-0 w-[90px] md:w-[120px] h-screen bg-black z-50">
        <Sidebarlayout />
      </div>

      {/* MAIN SCROLL CONTAINER */}
      <div className="ml-[90px] md:ml-[120px] flex-1 h-screen overflow-y-auto">
        <GenrePage />
      </div>
    </div>
  );
};

export default Search;
