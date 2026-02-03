import React from "react";

function Logo({ width = "100px", height = "50px" }) {
  return (
    <div>
      <img
        src="/LOGO.png"
        alt="LOGO"
        style={{ width, height }}
      />
    </div>
  );
}

export default Logo;
