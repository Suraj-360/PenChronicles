import React from "react";
import "../Styles/UserLayout.css"; // Assuming styles are in this file
import { useNavigate } from "react-router-dom";

const UserLayout = ({ id, username, profilePic, bio, buttonText, onClick }) => {

  const navigate = useNavigate();
  const handleNavigateProfileView = () => {
    navigate(`/${id}/profile`);
  }
  
  return (
    <div className="user-layout-main-container" onClick={handleNavigateProfileView}>
      <img
        src={profilePic}
        alt="Profile"
        className="profile-pic"
      />
      <div className="username-and-bio-container">
        <span className="user-layout-user-username">{username}</span>
        <span className="user-layout-user-bio">{bio}</span>
      </div>
      {!(localStorage.getItem("token") && id === localStorage.getItem("userId")) && (
        <button
          className={`follow-unfollow-following-button ${buttonText.toLowerCase().replace(" ", "-") + "-button"}`}
          onClick={onClick}
        >
          {buttonText}
        </button>
      )}
    </div>
  );
};

export default UserLayout;
