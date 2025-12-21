import React from "react";
import MovieDetail from "../components/MovieDetail";
import Sidebarlayout from "../components/SidebarLayout";

const MovieDetailPage = () => {
  return (
    <>
      <section className="relative w-full h-screen flex flex-row overflow-hidden bg-black">
        {/* Main Content */}
        <div className="flex-1 md:pl-10 pl-0">
          <MovieDetail />
        </div>

        {/* Sidebar */}
        <div className="fixed w-[90px] md:w-[120px] bg-black z-50">
          <Sidebarlayout />
        </div>
      </section>
    </>
  );
};

export default MovieDetailPage;
