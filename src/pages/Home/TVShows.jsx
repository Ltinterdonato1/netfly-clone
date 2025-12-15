import React from "react";
import "./Home.css";
import Navbar from "../../components/Navbar/Navbar";
import hero_banner from "../../assets/hero_banner.jpg";
import hero_title from "../../assets/hero_title.png";
import play_icon from "../../assets/play_icon.png";
import info_icon from "../../assets/info_icon.png";
import TitleCards from "../../components/TitleCards/TitleCards";
import Footer from "../../components/Footer/Footer";

const TVShows = () => {
  return (
    <div className="home">
      <Navbar />

      {/* HERO (same as Home) */}
      <div className="hero">
        <img src={hero_banner} alt="" className="banner-img" />

        <div className="hero-caption">
          <img src={hero_title} alt="" className="caption-img" />
          <p>
            Discovering his ties to a secret ancient order, a young man living in
            modern Istanbul embarks on a quest to save the city from an immortal
            enemy.
          </p>

          {/* ✅ Buttons (so you actually have "info" on the TV page too) */}
          <div className="hero-btns">
            <button className="btn">
              <img src={play_icon} alt="" />
              Play
            </button>
            <button className="btn dark-btn">
              <img src={info_icon} alt="" />
              More Info
            </button>
          </div>
        </div>
      </div>

      {/* ✅ TV rows start AFTER hero (not inside hero-caption) */}
      <div className="more-cards">
        <TitleCards type="tv" title="Popular TV" category="popular" />
        <TitleCards type="tv" title="Top Rated TV" category="top_rated" />
        <TitleCards type="tv" title="Airing Today" category="airing_today" />
        <TitleCards type="tv" title="On The Air" category="on_the_air" />
      </div>

      <Footer />
    </div>
  );
};

export default TVShows;
