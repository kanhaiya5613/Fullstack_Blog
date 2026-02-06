import React from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PostCard({ _id, title, featuredImage }) {
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";
  if (!_id) {
    return (
      <div className="hidden" />
    );
  }

  return (
    <Link to={`/post/${_id}`} className="block h-full">
      <div
        className={`h-full rounded-xl p-4 transition shadow-xl hover:shadow-2xl flex flex-col
          ${isDark ? "bg-gray-700 border-gray-900 text-gray-100" : "bg-gray-300 text-black"}
        `}
      >
        <div className="w-full aspect-video mb-4 overflow-hidden rounded-xl">
          {featuredImage ? (
            <img
              src={featuredImage.url}
              alt={title || "Post image"}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        <h2 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2">
          {title || "Untitled Post"}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
