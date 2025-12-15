import React, { useEffect, useRef, useState, useMemo } from "react";
import "./TitleCards.css";
import { Link } from "react-router-dom";
import DetailsModal from "../DetailsModal";
import { addToMyList, removeFromMyList, isInMyList } from "../../pages/firebase";

const TitleCards = ({ title, category = "popular", type = "movie" }) => {
  const [items, setItems] = useState([]);
  const [hoveredKey, setHoveredKey] = useState(null);
  const [trailerCache, setTrailerCache] = useState({});
  const hoverTimerRef = useRef(null);

  // ✅ My List cache
  const [inListMap, setInListMap] = useState({});

  // ✅ modal state
  const [modalOpen, setModalOpen] = useState(false);
  const [modalItem, setModalItem] = useState(null);

  // ✅ row scroll ref + arrows
  const rowRef = useRef(null);
  const [canLeft, setCanLeft] = useState(false);
  const [canRight, setCanRight] = useState(false);

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
      try {
        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${category}?language=en-US&page=1`,
          tmdbOptions
        );
        const data = await res.json();
        setItems(data?.results || []);
      } catch {
        setItems([]);
      }
    };
    load();
  }, [type, category, tmdbOptions]);

  const stopLink = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const getMediaType = (item) => item?.media_type || type;

  const fetchTrailerKey = async (id) => {
    const cacheKey = `${type}-${id}`;
    if (trailerCache[cacheKey] !== undefined) return;

    try {
      const res = await fetch(
        `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
        tmdbOptions
      );
      const data = await res.json();

      const best =
        data?.results?.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
        data?.results?.find((v) => v.site === "YouTube") ||
        null;

      setTrailerCache((prev) => ({ ...prev, [cacheKey]: best?.key || null }));
    } catch {
      setTrailerCache((prev) => ({ ...prev, [cacheKey]: null }));
    }
  };

  const ensureInListChecked = async (item) => {
    const mediaType = getMediaType(item);
    const key = `${mediaType}-${item.id}`;
    if (inListMap[key] !== undefined) return;

    try {
      const exists = await isInMyList(item.id);
      setInListMap((prev) => ({ ...prev, [key]: exists }));
    } catch {
      setInListMap((prev) => ({ ...prev, [key]: false }));
    }
  };

  const onEnter = (item) => {
    const mediaType = getMediaType(item);
    const key = `${mediaType}-${item.id}`;

    hoverTimerRef.current = setTimeout(() => {
      setHoveredKey(key);
      fetchTrailerKey(item.id);
      ensureInListChecked(item);
    }, 250);
  };

  const onLeave = () => {
    clearTimeout(hoverTimerRef.current);
    setHoveredKey(null);
  };

  const toggleMyList = async (e, item) => {
    stopLink(e);

    const mediaType = getMediaType(item);
    const key = `${mediaType}-${item.id}`;
    const currentlyInList = !!inListMap[key];

    const payload = {
      id: item.id,
      type: mediaType,
      title: item.title || item.name || "Untitled",
      backdrop_path: item.backdrop_path || null,
      poster_path: item.poster_path || null,
      overview: item.overview || "",
      release_date: item.release_date || "",
      first_air_date: item.first_air_date || "",
    };

    try {
      if (currentlyInList) {
        await removeFromMyList(item.id);
        setInListMap((prev) => ({ ...prev, [key]: false }));
      } else {
        await addToMyList(payload);
        setInListMap((prev) => ({ ...prev, [key]: true }));
      }
    } catch {}
  };

  const openDetails = (e, item) => {
    stopLink(e);
    setModalItem({
      type: getMediaType(item),
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

  // ✅ arrow enable/disable
  const updateArrows = () => {
    const el = rowRef.current;
    if (!el) return;
    const max = el.scrollWidth - el.clientWidth;
    setCanLeft(el.scrollLeft > 5);
    setCanRight(max - el.scrollLeft > 5);
  };

  useEffect(() => {
    updateArrows();
    const el = rowRef.current;
    if (!el) return;

    el.addEventListener("scroll", updateArrows, { passive: true });
    window.addEventListener("resize", updateArrows);

    return () => {
      el.removeEventListener("scroll", updateArrows);
      window.removeEventListener("resize", updateArrows);
    };
  }, [items]);

  const scrollRow = (dir) => {
    const el = rowRef.current;
    if (!el) return;

    // big "page" scroll like Netflix
    const amount = Math.round(el.clientWidth * 0.92);
    el.scrollBy({ left: dir * amount, behavior: "smooth" });
  };

  return (
    <>
      <div className="title-cards">
        {title && <h2>{title}</h2>}

        {/* ✅ wrapper that arrows sit on top of */}
        <div className="row-shell">
          <button
            type="button"
            className={`row-arrow left ${canLeft ? "show" : ""}`}
            aria-label="Scroll left"
            onClick={() => scrollRow(-1)}
          >
            ‹
          </button>

          <button
            type="button"
            className={`row-arrow right ${canRight ? "show" : ""}`}
            aria-label="Scroll right"
            onClick={() => scrollRow(1)}
          >
            ›
          </button>

          {/* ✅ THIS ref must be on the actual scroll container */}
          <div className="card-list" ref={rowRef}>
            {items.map((item, index) => {
              const id = item.id;
              const name = item.title || item.name || "Untitled";
              const imgPath = item.backdrop_path || item.poster_path;

              const mediaType = getMediaType(item);
              const key = `${mediaType}-${id}`;
              const trailerKey = trailerCache[`${type}-${id}`];
              const isHovered = hoveredKey === key;
              const isInList = !!inListMap[key];

              const edgeClass = isHovered
                ? index < 2
                  ? "expand-right"
                  : index > items.length - 3
                  ? "expand-left"
                  : "expand-center"
                : "";

              return (
                <Link
                  key={key}
                  to={`/player/${mediaType}/${id}`}
                  className={`card ${edgeClass}`}
                  onMouseEnter={() => onEnter(item)}
                  onMouseLeave={onLeave}
                >
                  <div className="card-wrapper">
                    <img
                      src={`https://image.tmdb.org/t/p/w500${imgPath}`}
                      alt={name}
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
                              alt={name}
                            />
                          )}
                        </div>

                        <div className="card-under" onClick={stopLink}>
                          <div className="card-controls">
                            <button className="card-control-btn play" title="Play">
                              <span className="icon-play" />
                            </button>

                            <button
                              className="card-control-btn icon"
                              title={isInList ? "Remove from My List" : "Add to My List"}
                              onClick={(e) => toggleMyList(e, item)}
                            >
                              <span className="icon-plus" />
                            </button>

                            <button className="card-control-btn icon" title="Like">
                              <span className="icon-like" />
                            </button>

                            <button
                              className="card-control-btn icon"
                              title="More Info"
                              onClick={(e) => openDetails(e, item)}
                            >
                              <span className="icon-chevron" />
                            </button>
                          </div>

                          <div className="card-hover-title">{name}</div>
                        </div>
                      </div>
                    )}

                    <p className="card-title">{name}</p>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      <DetailsModal
        open={modalOpen}
        item={modalItem}
        onClose={closeDetails}
        tmdbOptions={tmdbOptions}
      />
    </>
  );
};

export default TitleCards;
