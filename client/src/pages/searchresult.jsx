import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";

const Searchresult = () => {
  const { query } = useParams();
  const decodedQuery = query ? decodeURIComponent(query) : "";
  const [results, setResults] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);

  const loadMoreRef = useRef(null);
  const TMDB_KEY = import.meta.env.VITE_TMDB_KEY;

  const fetchResults = async (pageNum = 1) => {
    if (loading || !TMDB_KEY || !decodedQuery) return;
    setLoading(true);
    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/search/movie?api_key=${TMDB_KEY}&language=en-US&query=${encodeURIComponent(
          decodedQuery
        )}&page=${pageNum}&include_adult=false`
      );
      const data = await res.json();
      setResults((prev) => [
        ...(pageNum === 1 ? [] : prev),
        ...(Array.isArray(data.results) ? data.results : []),
      ]);
      setTotalPages(data.total_pages || 1);
      setPage(pageNum);
    } catch (err) {
      console.error("Failed to fetch search results:", err);
    } finally {
      setLoading(false);
    }
  };

  // Reset + initial fetch when decodedQuery changes
  useEffect(() => {
    setResults([]);
    setPage(1);
    setTotalPages(1);
    if (decodedQuery && TMDB_KEY) fetchResults(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [decodedQuery]);

  // Infinite scroll observer
  useEffect(() => {
    if (!loadMoreRef.current) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && page < totalPages) {
          fetchResults(page + 1);
        }
      },
      { rootMargin: "200px" }
    );

    observer.observe(loadMoreRef.current);
    return () => {
      if (loadMoreRef.current) observer.unobserve(loadMoreRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, totalPages, decodedQuery]);

  return (
    <>
      <section className="relative w-full h-screen flex flex-row overflow-hidden">
        <div className="flex-1 md:pl-10 pl-0">
          {/* optional hero that can accept the search query */}
          <SeeMoreHero endpoint="/search/movie" params={{ query: decodedQuery }} />
        </div>

        <div className="fixed w-[90px] md:w-[120px] bg-black z-50">
          <Sidebarlayout />
        </div>
      </section>

      <section className="bg-black pb-16">
        <NewMovieRow
          movies={results}
          title={decodedQuery ? `Search: "${decodedQuery}"` : "Search"}
        />
        <div ref={loadMoreRef} className="h-10" />
        {loading && <p className="text-white text-center mt-4">Loading more results...</p>}
        {!loading && decodedQuery && results.length === 0 && (
          <p className="text-white text-center mt-6">No results found for "{decodedQuery}".</p>
        )}
      </section>
    </>
  );
};

export default Searchresult;
