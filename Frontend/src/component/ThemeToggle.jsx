import { useDispatch, useSelector } from "react-redux";
import { toggleTheme } from "../store/themeSlice";

export default function ThemeToggle() {
  const dispatch = useDispatch();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";
  return (
    <button
      onClick={() => dispatch(toggleTheme())}
      className={`bg-gray-700 dark:bg-gray-200 text-gray-100 px-2 py-2 rounded-full transition ml-3 mr-3 ${isDark ? "bg-gray-700" : ""}`}
    >
      {mode === "dark" ? "☀" : "🌙"}
    </button>
  );
}
