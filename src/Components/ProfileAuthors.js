import React, { useEffect, useState } from "react";
import UserLayout from "./UserLayout"; // Importing the separate UserLayout component
import { useNavigate, useParams } from "react-router-dom";
import '../Styles/ProfileAuthors.css'

function ProfileAuthors({ type }) {
  const [followers, setFollowers] = useState([]);
  const [followings, setFollowings] = useState([]);
  const [userFollowings, setUserFollowings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdated, setIsUpdated] = useState(false);
  const { userID } = useParams();
  const navigate = useNavigate();

  const fetchUserFollowings = async (token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-user-followings-details/`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ user_Id: localStorage.getItem("userId") }),
        }
      );
      const data = await response.json();
      setUserFollowings(data.followings || []);
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchFollowersFollowings = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-user-followers-followings-details/`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ user_Id: userID }),
          }
        );
        const data = await response.json();
        setFollowers(data.followers || []);
        setFollowings(data.followings || []);
      } catch (err) {
        setError("Failed to fetch data");
      } finally {
        setLoading(false);
      }
    };
    fetchFollowersFollowings();

    if (localStorage.getItem("token") && (userID !== localStorage.getItem("userId"))) {
      fetchUserFollowings(localStorage.getItem("token"));
    }
  }, [isUpdated, userID]);
  
  const handleFollowUnfollow = async (userId, authorId, e) => {
    e.stopPropagation();
    const token = localStorage.getItem("token");
    try {
      const response = await fetch(
        `${process.env.REACT_APP_BACKEND_URL}/app/v1/follow-unfollow-author/`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            user_Id: userId,
            author_Id: authorId,
          }),
        }
      );
      const result = await response.json();
      if (response.status === 200) {
        setIsUpdated((prev) => !prev);
      } else {
        console.log(result.message); // Show error message
        setIsUpdated((prev) => !prev);
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  const handleNavigate = () => {
    navigate("/signin")
  }

  const isFollowedBack = (followerId) => {
    return followings.some((following) => following._id === followerId);
  };

  return loading ? (
    <div className="profile-authors-loading-main-container">
      Loading..
    </div>
  ) : (!followers?.length && type === "followers") ? (
    <div className='profile-authors-not-available-container'>
      <img src='https://res.cloudinary.com/dtq2cn21c/image/upload/v1736454837/PenChronicles%20assets/no-followers-followings_gvtfku.png' />
      <span>No followers</span>
    </div>
  ) : (!followings?.length && type === "followings") ? (
    <div className='profile-authors-not-available-container'>
      <img src='https://res.cloudinary.com/dtq2cn21c/image/upload/v1736454837/PenChronicles%20assets/no-followers-followings_gvtfku.png' />
      <span>No followings</span>
    </div>
  ) : (
    <div className="profile-authors-main-container">
      {/* Condition: No Token (User is not logged in) */}
      {(!localStorage.getItem("token")) && (
        <>
          {/* Render Followers */}
          {type === "followers" &&
            followers.map((follower) => (
              <UserLayout
                key={follower._id}
                id={follower._id}
                username={follower.username}
                profilePic={follower.profilePic}
                bio={follower.bio}
                buttonText="Follow"
                onClick={handleNavigate}
              />
            ))}

          {/* Render Followings */}
          {type === "followings" &&
            followings.map((following) => (
              <UserLayout
                key={following._id}
                id={following._id}
                username={following.username}
                profilePic={following.profilePic}
                bio={following.bio}
                buttonText="Follow"
                onClick={handleNavigate}
              />
            ))}
        </>
      )}

      {/* Condition: Check if the user is logged in and is viewing someone else's profile */}
      {localStorage.getItem("token") && userID.toString() !== localStorage.getItem("userId") && (
        <>
          {/* Render Followers */}
          {type === "followers" &&
            followers.map((follower) => {
              const followText = userFollowings.includes(follower._id) ? "Following" : "Follow";

              return (
                <UserLayout
                  key={follower._id}
                  id={follower._id}
                  username={follower.username}
                  profilePic={follower.profilePic}
                  bio={follower.bio}
                  buttonText={followText}
                  // onClick={() => handleFollowUnfollow(localStorage.getItem("userId"), follower._id)}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation here as well
                    handleFollowUnfollow(localStorage.getItem("userId"), follower._id, e);
                  }}
                />
              );
            })}

          {/* Render Followings */}
          {type === "followings" &&
            followings.map((following) => {
              const followText = userFollowings.includes(following._id) ? "Following" : "Follow";

              return (
                <UserLayout
                  key={following._id}
                  id={following._id}
                  username={following.username}
                  profilePic={following.profilePic}
                  bio={following.bio}
                  buttonText={followText}
                  // onClick={() => handleFollowUnfollow(localStorage.getItem("userId"), following._id)}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation here as well
                    handleFollowUnfollow(localStorage.getItem("userId"), following._id, e);
                  }}
                />
              );
            })}
        </>
      )}

      {/* Condition: User is viewing their own profile */}
      {localStorage.getItem("token") && userID.toString() === localStorage.getItem("userId") && (
        <>
          {type === "followers" &&
            followers.map((follower) => {
              const followText = isFollowedBack(follower._id) ? "Following" : "Follow Back";

              return (
                <UserLayout
                  key={follower._id}
                  id={follower._id}
                  username={follower.username}
                  profilePic={follower.profilePic}
                  bio={follower.bio}
                  buttonText={followText}
                  // onClick={() => handleFollowUnfollow(localStorage.getItem("userId"), follower._id)}
                  onClick={(e) => {
                    e.stopPropagation(); // Stop propagation here as well
                    handleFollowUnfollow(localStorage.getItem("userId"), follower._id, e);
                  }}
                />
              );
            })}

          {/* Render Followings */}
          {type === "followings" &&
            followings.map((following) => (
              <UserLayout
                key={following._id}
                id={following._id}
                username={following.username}
                profilePic={following.profilePic}
                bio={following.bio}
                buttonText="Following"
                // onClick={() => handleFollowUnfollow(localStorage.getItem("userId"), following._id)}
                onClick={(e) => {
                  e.stopPropagation(); // Stop propagation here as well
                  handleFollowUnfollow(localStorage.getItem("userId"), following._id, e);
                }}
              />
            ))}
        </>
      )}
    </div>
  );

};

export default ProfileAuthors;