import React, { useEffect, useState, useRef } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";
import Footer from "../components/footer";

const NewMovies = () => {
  const [newMovies, setNewMovies] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);

  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  // Fetch trending movies
  const fetchTrending = async (pageNum = 1) => {
    if (loading || !TMDB_KEY) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/trending/all/week?api_key=${TMDB_KEY}&page=${pageNum}`
      );
      const data = await res.json();
      setNewMovies(prev => [
        ...prev,
        ...(Array.isArray(data.results) ? data.results : []),
      ]);
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch trending movies:", err);
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
    fetchTrending();
  }, []);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      entries => {
        if (entries[0].isIntersecting && page < totalPages) {
          fetchTrending(page + 1);
        }
      },
      { rootMargin: "200px" } // preload before reaching bottom
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
          <SeeMoreHero endpoint="/trending/all/week" />
        </div>

        <div className="fixed w-[90px] md:w-[120px] bg-black z-50">
          <Sidebarlayout />
        </div>
      </section>

      {/* Movie Grid */}
      <section className="bg-black pb-16">
        <NewMovieRow movies={newMovies} title="Trending Movies" />
        <div ref={loadMoreRef} className="h-10"></div>
        {loading && (
          <p className="text-white text-center mt-4">Loading more movies...</p>
        )}
      </section>
      <Footer/>
    </>
  );
};

export default NewMovies;
