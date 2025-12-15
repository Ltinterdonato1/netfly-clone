import React, { useEffect, useMemo, useState } from "react";
import "./DetailsModal.css";

const pickUSRating = (type, data) => {
  try {
    if (type === "movie") {
      const results = data?.release_dates?.results || [];
      const us = results.find((r) => r.iso_3166_1 === "US");
      const cert =
        us?.release_dates?.find((x) => x?.certification)?.certification || "";
      return cert || "NR";
    }
    const results = data?.content_ratings?.results || [];
    const us = results.find((r) => r.iso_3166_1 === "US");
    return us?.rating || "NR";
  } catch {
    return "NR";
  }
};

const formatRuntime = (mins) => {
  if (!mins || mins <= 0) return "";
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h <= 0) return `${m}m`;
  return `${h}h ${m}m`;
};

const DetailsModal = ({ open, item, onClose, tmdbOptions }) => {
  const [loading, setLoading] = useState(false);
  const [details, setDetails] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");

  const type = item?.type;
  const id = item?.id;

  useEffect(() => {
    if (!open || !type || !id) return;

    const run = async () => {
      setLoading(true);
      setDetails(null);
      setErrorMsg("");

      try {
        const url =
          type === "movie"
            ? `https://api.themoviedb.org/3/movie/${id}?language=en-US&append_to_response=credits,release_dates,keywords`
            : `https://api.themoviedb.org/3/tv/${id}?language=en-US&append_to_response=credits,content_ratings,keywords`;

        const res = await fetch(url, tmdbOptions);

        // ✅ show real errors instead of silently failing
        if (!res.ok) {
          const text = await res.text();
          setErrorMsg(`TMDB error ${res.status}: ${text}`);
          return;
        }

        const data = await res.json();

        // TMDB sometimes returns { success:false, status_code, status_message }
        if (data?.success === false) {
          setErrorMsg(data?.status_message || "TMDB request failed");
          return;
        }

        setDetails(data);
      } catch (e) {
        console.error(e);
        setErrorMsg("Network error while loading details.");
      } finally {
        setLoading(false);
      }
    };

    run();
  }, [open, type, id, tmdbOptions]);

  // esc to close
  useEffect(() => {
    if (!open) return;
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const title = useMemo(() => {
    if (!details) return item?.title || item?.name || "";
    return details.title || details.name || item?.title || item?.name || "";
  }, [details, item]);

  const backdrop = useMemo(() => {
    const path = details?.backdrop_path || item?.backdrop_path;
    return path ? `https://image.tmdb.org/t/p/original${path}` : "";
  }, [details, item]);

  if (!open || !item) return null;

  const year =
    type === "movie"
      ? (details?.release_date || item?.release_date || "").slice(0, 4)
      : (details?.first_air_date || item?.first_air_date || "").slice(0, 4);

  const rating = details ? pickUSRating(type, details) : "NR";

  const lengthText =
    type === "movie"
      ? formatRuntime(details?.runtime)
      : details?.number_of_seasons
      ? `${details.number_of_seasons} Seasons`
      : "";

  const genres = (details?.genres || []).slice(0, 3).map((g) => g.name);
  const cast = (details?.credits?.cast || []).slice(0, 5).map((c) => c.name);

  const overview =
    details?.overview || item?.overview || "No description available.";

  const keywordsRaw =
    details?.keywords?.keywords || details?.keywords?.results || [];
  const tags = keywordsRaw.slice(0, 6).map((k) => k.name);

  return (
    <div className="dm-backdrop" onMouseDown={onClose}>
      <div className="dm-modal" onMouseDown={(e) => e.stopPropagation()}>
        <button className="dm-close" onClick={onClose} aria-label="Close">
          ×
        </button>

        <div className="dm-hero">
          {backdrop ? (
            <img className="dm-hero-img" src={backdrop} alt={title} />
          ) : (
            <div className="dm-hero-fallback" />
          )}
          <div className="dm-hero-gradient" />

          <div className="dm-hero-content">
            <div className="dm-title">{title}</div>

            <div className="dm-row">
              <span className="dm-rating">{rating}</span>
              {year ? <span className="dm-meta">{year}</span> : null}
              {lengthText ? <span className="dm-meta">{lengthText}</span> : null}
              <span className="dm-badge">HD</span>
            </div>

            <div className="dm-grid">
              <div className="dm-left">
                <div className="dm-overview">
                  {errorMsg ? errorMsg : loading ? "Loading..." : overview}
                </div>
              </div>

              <div className="dm-right">
                {cast?.length ? (
                  <div className="dm-small">
                    <span className="dm-label">Cast:</span> {cast.join(", ")}
                  </div>
                ) : null}

                {genres?.length ? (
                  <div className="dm-small">
                    <span className="dm-label">Genres:</span> {genres.join(", ")}
                  </div>
                ) : null}
              </div>
            </div>

            {genres?.length || tags?.length ? (
              <div className="dm-tags">
                {(genres || []).map((g) => (
                  <span key={`g-${g}`} className="dm-tag">
                    {g}
                  </span>
                ))}
                {(tags || []).map((t) => (
                  <span key={`t-${t}`} className="dm-tag">
                    {t}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetailsModal;
