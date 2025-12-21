import React, { useEffect, useState, useRef } from "react";
import Sidebarlayout from "../components/SidebarLayout";
import SeeMoreHero from "../components/seemorehero";
import NewMovieRow from "../components/newmovierow";
import PersonDetail from "./PersonDetail";
import Footer from "../components/footer";
import Profiledetail from "./Profile";

const Profile = () => {
  const [showNotice, setShowNotice] = useState(false);

  useEffect(() => {
    const dismissed = localStorage.getItem("profile_notice_dismissed") === "1";
    if (!dismissed) setShowNotice(true);
  }, []);

  const dismissNotice = () => {
    localStorage.setItem("profile_notice_dismissed", "1");
    setShowNotice(false);
  };

  return (
    <>
      {/* HERO + SIDEBAR SECTION */}
      <section className="relative w-full min-h-screen bg-black">
        <div className="flex flex-col">
          {/* SIDEBAR */}
          <div className="w-full md:w-auto bg-black z-50">
            <Sidebarlayout />
          </div>

          {/* MAIN CONTENT */}
          <div className="min-w-0 w-full overflow-hidden">
            
            <Profiledetail />
          </div>
        </div>
      </section>
    </>
  );
};

export default Profile;
