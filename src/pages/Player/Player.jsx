import React, { useEffect, useState } from "react";
import "./Player.css";
import back_arrow_icon from "../../assets/back_arrow_icon.png";
import { useNavigate, useParams } from "react-router-dom";

const Player = ({ type = "movie" }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apiData, setApiData] = useState({
    name: "",
    key: "",
    published_at: "",
    type: "",
  });

  const [loading, setLoading] = useState(true);

  const options = {
    method: "GET",
    headers: {
      accept: "application/json",
      Authorization:
        "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NWMxNmNiMzEwOGQzNDlkNWVkNzE3MDM3M2RlOTE3OCIsIm5iZiI6MTc2NTY1OTI1Ny42NzI5OTk5LCJzdWIiOiI2OTNkZDI3OTcyNGU3MTllNzI3ODBiYzEiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.DOGiBJvG5PAtMcD_h4oY9Svxgxp1u3p399GnShfknJs",
    },
  };

  useEffect(() => {
    let cancelled = false;

    const fetchTrailer = async () => {
      try {
        setLoading(true);

        const res = await fetch(
          `https://api.themoviedb.org/3/${type}/${id}/videos?language=en-US`,
          options
        );
        const data = await res.json();

        const results = data?.results || [];

        // Pick best YouTube trailer
        const best =
          results.find((v) => v.site === "YouTube" && v.type === "Trailer") ||
          results.find((v) => v.site === "YouTube") ||
          results[0] ||
          null;

        if (!cancelled) {
          setApiData(best || { name: "", key: "", published_at: "", type: "" });
        }
      } catch (err) {
        console.error(err);
        if (!cancelled) {
          setApiData({ name: "", key: "", published_at: "", type: "" });
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchTrailer();

    return () => {
      cancelled = true;
    };
  }, [id, type]);

  return (
    <div className="player">
      <img src={back_arrow_icon} alt="" onClick={() => navigate(-1)} />

      {loading ? (
        <div className="player-info">
          <p>Loading trailer...</p>
        </div>
      ) : apiData?.key ? (
        <>
          <iframe
            width="90%"
            height="90%"
            src={`https://www.youtube.com/embed/${apiData.key}`}
            title="Trailer"
            frameBorder="0"
            allowFullScreen
          />
          <div className="player-info">
            <p>{apiData.published_at ? apiData.published_at.slice(0, 10) : "N/A"}</p>
            <p>{apiData.name || "Trailer"}</p>
            <p>{apiData.type || (type === "tv" ? "TV" : "Movie")}</p>
          </div>
        </>
      ) : (
        <div className="player-info">
          <p>No trailer available for this title.</p>
        </div>
      )}
    </div>
  );
};

export default Player;
