import React, { useEffect, useState } from "react";
import Homehero from "../sections/homehero";
import Sidebarlayout from "../components/SidebarLayout";
import MovieRow from "../components/MovieRow";
import Footer from "../components/footer";

const API_KEY = "5ea9b1a37bb21a007fe88beb2914e5d2";

const HomePage = () => {
  const [featured, setFeatured] = useState(null);
  const [newMovies, setNewMovies] = useState([]);
  const [popular, setPopular] = useState([]);
  const [scifi, setScifi] = useState([]);
  const [anime, setAnime] = useState([]);
  const [action, setAction] = useState([]);
  const [romance, setRomance] = useState([]);
  const [comingSoon, setComingSoon] = useState([]);

  useEffect(() => {
    const fetchMovies = async () => {
      try {
        // Trending / New
        const trendingRes = await fetch(
          `https://api.themoviedb.org/3/trending/all/week?api_key=${API_KEY}`
        );
        const trendingData = await trendingRes.json();
        setFeatured(trendingData.results[0]);
        setNewMovies(trendingData.results.slice(1, 12));

        // Popular
        const popularRes = await fetch(
          `https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`
        );
        const popularData = await popularRes.json();
        setPopular(popularData.results);

        // Sci-Fi
        const scifiRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=878`
        );
        const scifiData = await scifiRes.json();
        setScifi(scifiData.results);

        // Anime
        const animeRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=16`
        );
        const animeData = await animeRes.json();
        setAnime(animeData.results);

        // Action
        const actionRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`
        );
        const actionData = await actionRes.json();
        setAction(actionData.results);

        // Romance
        const romanceRes = await fetch(
          `https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=10749`
        );
        const romanceData = await romanceRes.json();
        setRomance(romanceData.results);

        // Coming Soon (upcoming movies)
        const comingRes = await fetch(
          `https://api.themoviedb.org/3/movie/upcoming?api_key=${API_KEY}&language=en-US&page=1`
        );
        const comingData = await comingRes.json();
        setComingSoon(comingData.results);
      } catch (err) {
        console.error(err);
      }
    };

    fetchMovies();
  }, []);

  if (!featured) return <div className="text-black p-8">Loading...</div>;

  return (
    <>
      {/* HERO + SIDEBAR SECTION */}
      <section className="relative w-full h-screen flex flex-row overflow-hidden">
        {/* Main Content */}
        <div className="flex-1 md:pl-10 pl-0">
          <Homehero featured={featured} />
        </div>

        {/* Sidebar */}
        <div className="fixed w-[90px] md:w-[120px] bg-black z-50">
          <Sidebarlayout />
        </div>
      </section>

      {/* MOVIE ROW SECTION */}
      {/* offset content so fixed sidebar doesn't overlap */}
      <section className="bg-black pb-16 pl-5 md:pl-[120px]">
        <MovieRow
          title="New This Week"
          movies={newMovies}
          seeMoreUrl={{ pathname: "/newmovie", search: "?list=new-this-week" }}
        />
        <MovieRow
          title="Popular Right Now"
          movies={popular}
          seeMoreUrl={{ pathname: "/popular", search: "?list=popular" }}
        />
        <MovieRow
          title="Sci-Fi Movies"
          movies={scifi}
          type="sci-fi"
          seeMoreUrl={{ pathname: "/scifi", search: "?genre=scifi" }}
        />
        <MovieRow
          title="Anime"
          movies={anime}
          type="anime"
          seeMoreUrl={{ pathname: "/anime", search: "?genre=anime" }}
        />
        <MovieRow
          title="Action Movies"
          movies={action}
          type="action"
          seeMoreUrl={{ pathname: "/action", search: "?genre=action" }}
        />
        <MovieRow
          title="Romance Movies"
          movies={romance}
          type="romance"
          seeMoreUrl={{ pathname: "/romance", search: "?genre=romance" }}
        />
        <MovieRow
          title="Coming Soon"
          movies={comingSoon}
          type="upcoming"
          seeMoreUrl={{ pathname: "/upcoming", search: "?list=upcoming" }}
        />
      </section>
      <footer className="bg-black z-50">
        <Footer />
      </footer>
    </>
  );
};

export default HomePage;
