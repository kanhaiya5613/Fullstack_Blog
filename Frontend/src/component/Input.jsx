import React, { useId } from "react";
import { useSelector } from "react-redux";

const Input = React.forwardRef(function Input(
  { label, type = "text", className = "", ...props },
  ref
) {
  const id = useId();
  const mode = useSelector((state) => state.theme.mode);
  const isDark = mode === "dark";

  return (
    <div className="w-full">
      {label && (
        <label
          className={`inline-block mb-1 pl-1 ${
            isDark ? "text-gray-200" : "text-black"
          }`}
          htmlFor={id}
        >
          {label}
        </label>
      )}

      <input
        type={type}
        ref={ref}
        id={id}
        {...props}
        className={`px-3 py-2 rounded-lg outline-none duration-200 border w-full
        ${
          isDark
            ? "bg-gray-700 text-white border-gray-600 focus:bg-gray-600 placeholder-gray-400"
            : "bg-white text-black border-gray-200 focus:bg-gray-50"
        }
        ${className}`}
      />
    </div>
  );
});

export default Input;
