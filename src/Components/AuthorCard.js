import React from "react";
import "../Styles/AuthorCard.css";
import { useNavigate } from "react-router-dom";

function AuthorCard({ author, color }) {
  const navigate = useNavigate()

  const handleNavigateProfileView = () => {
    navigate(`/${author._id}/profile`);
  }

  return (
    <div className="author-card-main-container">
      <div
        className="author-card-author-profile-pic-card"
        style={{ backgroundColor: color }} // Apply color as background
      >
        <div className="author-card-author-profile-pic">
          <img src={author.profilePic} alt="Author Profile" />
        </div>
      </div>
      <div className="author-card-author-content">
        <span
          className="author-card-author-content-username"
          style={{ color: color }} // Apply color to text
        >
          {author.username}
        </span>
        <span className="author-card-author-content-bio">{author.bio}</span>
        <div className="author-card-author-content-follower-following">
          <div className="author-card-author-content-follower">
            <span>{author.followersCount}</span>
            <span>Followers</span>
          </div>
          <div className="author-card-author-content-following">
            <span>{author.followingsCount}</span>
            <span>Followings</span>
          </div>
        </div>
        <span
          className="author-card-author-content-profile-view-button"
          style={{ backgroundColor: color }} // Apply color as button background
          onClick={()=>handleNavigateProfileView()}
        >
          View Profile
        </span>
      </div>
    </div>
  );
}

export default AuthorCard;
