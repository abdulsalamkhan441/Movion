import React, { useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Landingpage from "./pages/landingpage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import Home from "./pages/home";
import NewMovies from "./pages/newmovie";
import Popular from "./pages/popular";
import Scifi from "./pages/scifi";
import Anime from "./pages/anime";
import Action from "./pages/action";
import Romance from "./pages/romance";
import Upcoming from "./pages/upcoming";
import MovieDetailPage from "./pages/moviedetailpage";
import CastPage from "./pages/castpage";
import PersonDetail from "./pages/PersonDetail";
import Search from "./pages/search";
import Horror from "./pages/horror";
import Adventure from "./pages/adventure";
import Comedy from "./pages/comedy";
import Thriller from "./pages/thriller";
import Fantasy from "./pages/fantasy";
import Searchresult from "./pages/searchresult";
import Watchlater from "./pages/watchlater";
import WatchQuizPage from "./pages/WatchQuizPage";
import Profile from "./pages/profilepage.jsx";
import { useLoader } from "./components/LoaderContext.jsx";
import ProtectedRoute from "./components/ProtectedRoute";
import MovionLoader from "./components/MovionLoader.jsx";

function App() {
  const location = useLocation();
  const { setLoading } = useLoader();

  useEffect(() => {
    setLoading(true);

    const timer = setTimeout(() => {
      setLoading(false);
    }, 900);

    return () => clearTimeout(timer);
  }, [location.pathname]);

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Landingpage />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected Routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />
      <Route
        path="/newmovie"
        element={
          <ProtectedRoute>
            <NewMovies />
          </ProtectedRoute>
        }
      />
      <Route
        path="/popular"
        element={
          <ProtectedRoute>
            <Popular />
          </ProtectedRoute>
        }
      />
      <Route
        path="/scifi"
        element={
          <ProtectedRoute>
            <Scifi />
          </ProtectedRoute>
        }
      />
      <Route
        path="/anime"
        element={
          <ProtectedRoute>
            <Anime />
          </ProtectedRoute>
        }
      />
      <Route
        path="/action"
        element={
          <ProtectedRoute>
            <Action />
          </ProtectedRoute>
        }
      />
      <Route
        path="/romance"
        element={
          <ProtectedRoute>
            <Romance />
          </ProtectedRoute>
        }
      />
      <Route
        path="/upcoming"
        element={
          <ProtectedRoute>
            <Upcoming />
          </ProtectedRoute>
        }
      />
      <Route
        path="/movie/:id"
        element={
          <ProtectedRoute>
            <MovieDetailPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/person/:id"
        element={
          <ProtectedRoute>
            <CastPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/search/:query"
        element={
          <ProtectedRoute>
            <Searchresult />
          </ProtectedRoute>
        }
      />
      <Route
        path="/searchpage"
        element={
          <ProtectedRoute>
            <Search />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Horror"
        element={
          <ProtectedRoute>
            <Horror />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Adventure"
        element={
          <ProtectedRoute>
            <Adventure />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Comedy"
        element={
          <ProtectedRoute>
            <Comedy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Thriller"
        element={
          <ProtectedRoute>
            <Thriller />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Fantasy"
        element={
          <ProtectedRoute>
            <Fantasy />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Watchlater"
        element={
          <ProtectedRoute>
            <Watchlater />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Ai"
        element={
          <ProtectedRoute>
            <WatchQuizPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/Profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      {/* Catch-all → redirect to landing page */}
      <Route path="*" element={<Landingpage />} />
    </Routes>
  );
}

export default App;
