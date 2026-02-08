import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

export default function ThemeSlider() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <div
      onClick={() => dispatch(toggleTheme())}
      className={`
        relative flex items-center
        w-16 h-8
        rounded-full cursor-pointer
        transition-all duration-300 ease-in-out
        ${isDark ? "bg-gray-800" : "bg-gray-300"}
      `}
    >
      {/* Sliding Circle */}
      <div
        className={`
          absolute top-1
          w-6 h-6 rounded-full
          flex items-center justify-center
          shadow-md
          transition-all duration-300 ease-in-out
          ${isDark 
            ? "translate-x-8 bg-gray-900 text-yellow-400" 
            : "translate-x-1 bg-white text-indigo-600"}
        `}
      >
        {isDark ? "☀" : "🌙"}
      </div>
    </div>
  );
}
