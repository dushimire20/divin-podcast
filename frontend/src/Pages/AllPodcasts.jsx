import React, { useEffect, useState } from "react";
import axios from "axios";
import PodcastCard from "../components/PodcastCard/PodcastCard";

const AllPodcasts = () => {
  const [podcasts, setPodcasts] = useState();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await axios("http://localhost:8080/api/v1/get-podcasts", {
          withCredentials: true,
        });
        setPodcasts(res.data.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching podcasts:", error);
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Add a loading spinner or message
  }

  if (!podcasts || podcasts.length === 0) {
    return <div>No podcasts available</div>;
  }

  return (
    <div>
      <div className="w-full px-4 lg:px-12 py-4 grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-8 h-[80vh] overflow-scroll">
        {podcasts.map((items) => (
          <div key={items._id}> {/* Use items._id as the key */}
            <PodcastCard items={items} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default AllPodcasts;
