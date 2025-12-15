import React, { useEffect, useMemo, useRef, useState } from "react";
import "../Home/Home.css";
import "../../components/TitleCards/TitleCards.css";
import Navbar from "../../components/Navbar/Navbar";
import Footer from "../../components/Footer/Footer";
import { getMyList, removeFromMyList } from "../firebase";
import { Link } from "react-router-dom";
import DetailsModal from "../../components/DetailsModal";

const MyList = () => {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);

  const [hoveredKey, setHoveredKey] = useState(null);
  const [trailerCache, setTrailerCache] = useState({});
  const hoverTimerRef = useRef(null);

  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  const tmdbOptions = useMemo(
    () => ({
      method: "GET",
      headers: {
        accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWMxNmNiMzEwOGQzNDlkNWVkNzE3MDM3M2RlOTE3OCIsIm5iZiI6MTc2NTY1OTI1Ny42NzI5OTk5LCJzdWIiOiI2OTNkZDI3OTcyNGU3MTllNzI3ODBiYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DOGiBJvG5PAtMcD_h4oY9Svxgxp1u3p399GnShfknJs",
      },
    }),
    []
  );

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      const data = await getMyList();
      setList(data);
      setLoading(false);
    };
    load();
  }, []);

  const fetchTrailerKey = async (type, id) => {
    const cacheKey = `${type}-${id}`;
    if (trailerCache[cacheKey] !== undefined) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
        tmdbOptions
      );
      const data = await res.json();
      const results = data?.results || [];

      const best =
        results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        results.find((v) => v.site === "YouTube") ||
        null;

      setTrailerCache((prev) => ({ ...prev, [cacheKey]: best?.key || null }));
    } catch {
      setTrailerCache((prev) => ({ ...prev, [cacheKey]: null }));
    }
  };

  const onEnter = (type, id) => {
    const key = `${type}-${id}`;
    hoverTimerRef.current = setTimeout(() => {
      setHoveredKey(key);
      fetchTrailerKey(type, id);
    }, 250);
  };

  const onLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setHoveredKey(null);
  };

  const stopLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleRemove = async (e, id) => {
    stopLink(e);
    await removeFromMyList(id);
    setList((prev) => prev.filter((x) => x.id !== id));
  };

  const openDetails = (e, item) => {
    stopLink(e);
    setModalItem({
      type: item.type,
      id: item.id,
      title: item.title || item.name || "Untitled",
      backdrop_path: item.backdrop_path || item.poster_path,
      overview: item.overview,
      release_date: item.release_date,
      first_air_date: item.first_air_date,
    });
    setModalOpen(true);
  };

  const closeDetails = () => {
    setModalOpen(false);
    setModalItem(null);
  };

  return (
    <div className="home no-hero mylist-page">
      <Navbar />

      <div className="more-cards mylist-content">
        <h2 style={{ marginBottom: "14px" }}>My List</h2>

        {loading ? (
          <p style={{ opacity: 0.8 }}>Loading…</p>
        ) : list.length === 0 ? (
          <p style={{ opacity: 0.8 }}>
            Your list is empty. Hover a title and press <b>+</b> to save it.
          </p>
        ) : (
          <div className="title-cards">
            <div className="card-list">
              {list.map((item, index) => {
                const mediaType = item.type;
                const title = item.title || item.name || "Untitled";
                const imgPath = item.backdrop_path || item.poster_path;
                const key = `${mediaType}-${item.id}`;
                const trailerKey = trailerCache[key];
                const isHovered = hoveredKey === key;

                const edgeClass = isHovered
                  ? index < 2
                    ? "expand-right"
                    : index > list.length - 3
                    ? "expand-left"
                    : "expand-center"
                  : "";

                return (
                  <Link
                    key={key}
                    to={`/player/${mediaType}/${item.id}`}
                    className={`card ${edgeClass}`}
                    onMouseEnter={() => onEnter(mediaType, item.id)}
                    onMouseLeave={onLeave}
                  >
                    <div className="card-wrapper">
                      <img
                        src={`https://image.tmdb.org/t/p/w500${imgPath}`}
                        alt={title}
                        className="card-img"
                        loading="lazy"
                      />

                      {isHovered && (
                        <div className="card-hover">
                          <div className="card-preview">
                            {trailerKey ? (
                              <iframe
                                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=1&controls=0&playsinline=1&loop=1&playlist=${trailerKey}`}
                                title="Preview"
                                frameBorder="0"
                                allow="autoplay; encrypted-media"
                              />
                            ) : (
                              <img
                                src={`https://image.tmdb.org/t/p/w500${imgPath}`}
                                alt={title}
                              />
                            )}
                          </div>

                          <div className="card-under" onClick={stopLink}>
                            <div className="card-controls">
                              <button
                                className="card-control-btn icon"
                                title="Remove"
                                aria-label="Remove"
                                onClick={(e) => handleRemove(e, item.id)}
                              >
                                ×
                              </button>

                              <button
                                className="card-control-btn icon"
                                title="More Info"
                                aria-label="More Info"
                                onClick={(e) => openDetails(e, item)}
                              >
                                <span className="icon-chevron" />
                              </button>
                            </div>

                            <div className="card-hover-title">{title}</div>
                          </div>
                        </div>
                      )}

                      <p className="card-title">{title}</p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <Footer />

      <DetailsModal
        open={modalOpen}
        item={modalItem}
        onClose={closeDetails}
        tmdbOptions={tmdbOptions}
      />
    </div>
  );
};

export default MyList;
