import React, { useEffect, useState, useRef } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";

const Romance = () => {
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
    <>
      {/* HERO + SIDEBAR SECTION */}
      <section className="relative w-full h-screen flex flex-row overflow-hidden">
        <div className="flex-1 md:pl-10 pl-0">
          <SeeMoreHero endpoint="/discover/movie" params={{ with_genres: 10749 }} />
        </div>

        <div className="fixed w-[90px] md:w-[120px] bg-black z-50">
          <Sidebarlayout />
        </div>
      </section>

      {/* Movie Grid */}
      <section className="bg-black pb-16">
        <NewMovieRow movies={romanceMovies} title="Romance Movies" />
        <div ref={loadMoreRef} className="h-10"></div>
        {loading && (
          <p className="text-white text-center mt-4">Loading more movies...</p>
        )}
      </section>
    </>
  );
};

export default Romance;
