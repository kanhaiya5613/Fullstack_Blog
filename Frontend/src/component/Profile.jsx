import React from "react";

function Profile({ toggle }) {
  return (
    <img
      src="/Profile.jpg"
      alt="profile"
      onClick={toggle}
      className="h-10 w-10 rounded-full object-cover border-2 cursor-pointer"
    />
  );
}

export default Profile;
