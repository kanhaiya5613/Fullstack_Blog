import React, { useId } from "react";
import { useSelector } from "react-redux";

function Select({ options = [], label, className = "", ...props }, ref) {
  const id = useId();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={id}
          className={`inline-block mb-1 pl-1 ${
            isDark ? "text-gray-200" : "text-black"
          }`}
        >
          {label}
        </label>
      )}

      <select
        id={id}
        ref={ref}
        {...props}
        className={`px-3 py-2 rounded-lg outline-none duration-200 border w-full
        ${
          isDark
            ? "bg-gray-700 text-white border-gray-600 focus:bg-gray-600"
            : "bg-white text-black border-gray-200 focus:bg-gray-50"
        }
        ${className}`}
      >
        {options.map((option) => (
          <option
            key={option}
            value={option}
            className={isDark ? "bg-gray-700 text-white" : ""}
          >
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export default React.forwardRef(Select);
