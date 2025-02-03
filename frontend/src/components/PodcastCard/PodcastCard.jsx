import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { playerActions } from "../../store/player";

const PodcastCard = ({ items }) => {
  const isLoggedIn = useSelector((state) => state.auth.isLoggedIn);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleOnPlay = (e) => {
    if (isLoggedIn) {
      e.preventDefault();
      dispatch(playerActions.setDiv());
      dispatch(
        playerActions.changeImage(`http://localhost:8080/${items?.frontImage}`)
      );
      dispatch(
        playerActions.changeSong(`http://localhost:8080/${items?.audioFile}`)
      );
    } else {
      navigate("/signUp");
    }
  };

  if (!items) {
    return null; // Render nothing or a fallback if `items` is not provided
  }

  const {
    _id,
    frontImage,
    title = "Untitled Podcast",
    description = "No description available",
    category,
  } = items;

  const categoryName = category || "Unknown Category"; // Directly use the category string

  return (
    <div className="p-4 max-w-sm mx-auto">
      <div className="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
        <Link to={`/description/${_id}`}>
          <div className="relative pb-56">
            <img
              src={`http://localhost:8080/${frontImage}`}
              className="absolute inset-0 h-full w-full object-cover"
              alt={title}
            />
          </div>
        </Link>
        <div className="p-4">
          <h3 className="text-lg font-semibold text-gray-900">
            {title.slice(0, 20)}
          </h3>
          <p className="mt-2 text-gray-600 text-sm">
            {description.slice(0, 40)}...
          </p>
          <div className="mt-4 bg-blue-100 text-blue-800 border border-blue-800 rounded px-4 py-2 text-center">
            {categoryName}
          </div>
          <button
            className="mt-2 block w-full bg-green-600 text-white text-center font-medium py-2 rounded hover:bg-green-700"
            onClick={handleOnPlay}
          >
            Play Now
          </button>
        </div>
      </div>
    </div>
  );
};

export default PodcastCard;
