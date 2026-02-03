import React from "react";
import appwriteService from "../appwrite/config";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

function PostCard({ $id: id, title, featuredImage }) {
  if (!id) return null;

  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <Link to={`/post/${id}`} className="block h-full">
      <div
        className={`h-full rounded-xl p-4 transition hover:shadow-lg flex flex-col
          ${isDark ? "bg-gray-800 text-gray-100" : "bg-gray-100 text-black"}
        `}
      >
        {/* Image */}
        <div className="w-full aspect-video mb-4 overflow-hidden rounded-xl">
          {featuredImage ? (
            <img
              src={appwriteService.getFilePreview(featuredImage)}
              alt={title || "Post image"}
              className="w-full h-full object-cover hover:scale-105 transition duration-300"
            />
          ) : (
            <div className="w-full h-full bg-gray-300 flex items-center justify-center text-gray-500">
              No Image
            </div>
          )}
        </div>

        {/* Title */}
        <h2 className="text-base sm:text-lg md:text-xl font-bold line-clamp-2">
          {title || "Untitled Post"}
        </h2>
      </div>
    </Link>
  );
}

export default PostCard;
