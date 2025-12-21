import React, { useEffect, useState } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import NewMovieRow from "../components/newmovierow";
import { getWatchLater } from "../utils/watchlater";
import Footer from "../components/footer";

const Watchlater = () => {
  const [movies, setMovies] = useState([]);

  useEffect(() => {
    setMovies(getWatchLater());
  }, []);

  return (
    <>
      <div className="flex">
        {/* Sidebar */}
        <div className="w-[90px] md:w-[120px] fixed bg-black z-50">
          <Sidebarlayout />
        </div>

        <div className="flex-1 pl-[100px] md:pl-[140px] bg-black min-h-screen py-10">
          <h1 className="text-white text-3xl md:text-5xl font-bold mb-8">
            Watch Later
          </h1>

          {movies.length > 0 ? (
            <NewMovieRow movies={movies} title="Your Watch Later List" />
          ) : (
            <p className="text-white text-center mt-10 text-lg">
              You haven't added any movies to Watch Later.
            </p>
          )}
        </div>
      </div>
      <footer className="bg-black">
        <Footer />
      </footer>
    </>
  );
};

export default Watchlater;
