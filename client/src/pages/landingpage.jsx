import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";


import EarlyNavbar from "../components/earlynavbar";
import Footer from "../components/footer";
import Hero1 from "../sections/hero1.jsx";
import MovieWheel from "../sections/MovieWheel";
import ShowcaseSection from "../sections/showcase";
import StatsSection from "../sections/StatsSection";

function LandingPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const decoded = jwtDecode.default(token);
        if (decoded.exp * 1000 > Date.now()) {
          // Token valid → redirect to home
          navigate("/home");
        } else {
          // Token expired → remove it
          localStorage.removeItem("token");
          localStorage.removeItem("user");
        }
      } catch (err) {
        // Invalid token → remove it
        localStorage.removeItem("token");
        localStorage.removeItem("user");
      }
    }
  }, [navigate]);

  return (
    <div className="relative w-full min-h-screen">
      <Hero1 />
      <div className="absolute top-0 left-0 w-full z-20">
        <EarlyNavbar />
      </div>
      <ShowcaseSection />
      <MovieWheel />
      <div className="bg-black">
        <StatsSection />
        <Footer />
      </div>
    </div>
  );
}

export default LandingPage;
