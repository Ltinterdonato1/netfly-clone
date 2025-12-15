import React, { useEffect } from "react";
import Home from "./pages/Home/Home";
import { Routes, Route, useNavigate } from "react-router-dom";
import Login from "./pages/Login/Login";
import Player from "./pages/Player/Player";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./pages/firebase";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import TVShows from "./pages/Home/TVShows";
import Movies from "./pages/Home/Movies";
import NewAndPopular from "./pages/Home/NewandPopular";
import MyList from "./pages/Home/MyList";
import BrowseByLanguages from "./pages/Home/BrowseByLanguages";

const App = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        console.log("Logged In");
        if (window.location.pathname === "/login") {
          navigate("/");
        }
      } else {
        console.log("Logged Out");
        navigate("/login");
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div>
      <ToastContainer theme="dark" />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />

        {/* Player Routes */}
        <Route path="/player/movie/:id" element={<Player type="movie" />} />
        <Route path="/player/tv/:id" element={<Player type="tv" />} />

        {/* Pages */}
        <Route path="/tv-shows" element={<TVShows />} />
        <Route path="/movies" element={<Movies />} />
        <Route path="/new-and-popular" element={<NewAndPopular />} />
        <Route path="/my-list" element={<MyList />} />
        <Route path="/browse-by-languages" element={<BrowseByLanguages />} />
      </Routes>
    </div>
  );
};

export default App;
