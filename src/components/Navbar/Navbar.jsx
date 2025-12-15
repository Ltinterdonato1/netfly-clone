import React, { useEffect, useRef } from "react";
import "./Navbar.css";
import logo from "../../assets/logo.png";
import search_icon from "../../assets/search_icon.svg";
import bell_icon from "../../assets/bell_icon.svg";
import profile_img from "../../assets/profile_img.png";
import caret_icon from "../../assets/caret_icon.svg";
import { logout } from "../../pages/firebase";
import { Link } from "react-router-dom";

const Navbar = () => {
  const navRef = useRef(null);

  useEffect(() => {
    const onScroll = () => {
      if (!navRef.current) return;
      if (window.scrollY > 80) navRef.current.classList.add("nav-dark");
      else navRef.current.classList.remove("nav-dark");
    };

    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div ref={navRef} className="navbar">
      <div className="navbar-left">
        <Link to="/" aria-label="Go to Home">
          <img src={logo} alt="Logo" />
        </Link>

        <ul>
          <li>
            <Link to="/">Home</Link>
          </li>
          <li>
            <Link to="/tv-shows">TV Shows</Link>
          </li>
          <li>
            <Link to="/movies">Movies</Link>
          </li>
          <li>
            <Link to="/new-and-popular">New & Popular</Link>
          </li>
          <li>
            <Link to="/my-list">My List</Link>
          </li>
          <li>
            <Link to="/browse-by-languages">Browse by Languages</Link>
          </li>
        </ul>
      </div>

      <div className="navbar-right">
        <img src={search_icon} alt="Search" className="icons" />
        <img src={bell_icon} alt="Notifications" className="icons" />

        <div className="navbar-profile">
          <img src={profile_img} alt="Profile" className="profile" />
          <img src={caret_icon} alt="Open menu" />

          <div className="dropdown">
            <ul>
              <li>
                <button type="button" className="dropdown-link">
                  <svg
                    className="dropdown-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  </svg>
                  Guest
                </button>
              </li>

              <li>
                <button type="button" className="dropdown-link">
                  <svg
                    className="dropdown-icon kids"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="7" r="4" />
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                  </svg>
                  Kids
                </button>
              </li>

              <li>
                <button type="button" className="dropdown-link">
                  <svg
                    className="dropdown-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z" />
                  </svg>
                  Manage Profiles
                </button>
              </li>

              <li>
                <button type="button" className="dropdown-link">
                  <svg
                    className="dropdown-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  Transfer Profile
                </button>
              </li>

              <li>
                <a
                  className="dropdown-link"
                  href="https://www.netflix.com/account"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="dropdown-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Account
                </a>
              </li>

              <li>
                <a
                  className="dropdown-link"
                  href="https://help.netflix.com/en"
                  target="_blank"
                  rel="noreferrer"
                >
                  <svg
                    className="dropdown-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3" />
                    <line x1="12" y1="17" x2="12.01" y2="17" />
                  </svg>
                  Help Center
                </a>
              </li>

              <li className="sign-out-item">
                <button type="button" className="dropdown-link" onClick={logout}>
                  Sign Out of Netflix
                </button>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
