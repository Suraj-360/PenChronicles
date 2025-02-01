import React, { useState, useEffect } from 'react';
import Nav from '../Components/Nav';
import '../Styles/Profile.css';
import { MdEditNote, MdSave } from "react-icons/md";
import ProfileAuthors from '../Components/ProfileAuthors';
import ProfilePosts from '../Components/ProfilePosts';
import { useNavigate, useParams } from 'react-router-dom';
import PopUpOverlay from '../Components/PopUpOverlay';
import AboutFragment from '../Components/AboutFragment';

function Profile() {
    const [profileContent, setProfileContent] = useState("Posts");
    const [editProfile, setEditProfile] = useState(false);
    const [profilePic, setProfilePic] = useState(null);
    const [tempProfilePic, setTempProfilePic] = useState(null);
    const [profilePicUrl, setProfilePicUrl] = useState("");
    const [bio, setBio] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [username, setUsername] = useState("");
    const [followers, setFollowers] = useState([]);
    const [isProfileUpdated, setIsProfileUpdated] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [popupAction, setPopupAction] = useState(null);
    const { userID } = useParams();
    const navigate = useNavigate();

    const fetchUserData = async () => {
        setIsLoading(true);
        try {
            const token = localStorage.getItem('token');
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/get-user-basic-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (response.status === 200) {
                const data = await response.json();
                setTempProfilePic(null);
                setProfilePicUrl(data.user.profilePic);
                setBio(data.user.bio);
                setUsername(data.user.username);
                setFollowers(data.user.followers);
            }
            setIsLoading(false)
        } catch (error) {
            setIsLoading(false)
            setTempProfilePic(null);
            console.error("Error fetching profile data", error);
        }
    };

    const fetchAuthorData = async () => {
        setIsLoading(true);
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/get-author-basic-details`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ user_Id: userID }),
            });

            if (response.status == 200) {
                const data = await response.json();
                setTempProfilePic(null);
                setProfilePicUrl(data.user.profilePic);
                setBio(data.user.bio);
                setUsername(data.user.username);
                setFollowers(data.user.followers);
            }

            if (response.status === 404) {
                navigate('/404-not-found')
            }
            
            setIsLoading(false)

        } catch (error) {
            setIsLoading(false)
            setTempProfilePic(null);
            console.error("Error fetching profile data", error);
        }
    };

    useEffect(() => {
        if (userID && localStorage.getItem("userId") !== userID) {
            fetchAuthorData();
        } else {
            fetchUserData();
        }
    }, [isProfileUpdated, userID]);

    const handleAuthorFollowUnfollow = async (author_Id) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/signin")
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/follow-unfollow-author`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ author_Id }),
            });
            if (response.status === 200) {
                setIsProfileUpdated((prev) => !prev);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };
    
    const formatNumber = (num) => {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M'; // for millions
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'K'; // for thousands
        } else {
            return num; // return the number as is if it's less than 1000
        }
    };

    const handleEditProfile = () => {
        if (editProfile) {
            setShowConfirmModal(true);
            setPopupAction("edit")
        } else {
            setEditProfile(!editProfile);
        }
    };

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setProfilePic(file); // Store the file object for upload
            const reader = new FileReader();
            reader.onload = () => {
                setTempProfilePic(reader.result); // Generate a preview
            };
            reader.readAsDataURL(file); // Read the file
        }
    };

    const handleBioChange = (e) => {
        if (e.target.value.length <= 500) {
            setBio(e.target.value);
        }
    };

    // Save profile updates
    const confirmSave = async () => {
        setIsLoading(true)
        try {
            const formData = new FormData();
            if (bio) formData.append('bio', bio);
            if (profilePic) formData.append('profilePic', profilePic);

            const token = localStorage.getItem('token');

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/update-profile/bio-pic`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const result = await response.json();

            if (response.ok) {
                console.log('Profile updated successfully:', result);
                setEditProfile(false);
                setShowConfirmModal(false);
                setTempProfilePic(null);
                setProfilePic(null);
                // Trigger re-fetch of profile data
                setIsProfileUpdated((prev) => !prev);
            } else {
                console.error('Profile update failed:', result.message);
                setEditProfile(false);
                setShowConfirmModal(false);
            }
            setIsLoading(false)
        } catch (error) {
            console.error('Error updating profile:', error.message);
            setIsLoading(false)
            setEditProfile(false);
            setShowConfirmModal(false);
        }
    };

    const cancelSave = () => {
        setEditProfile(false);
        setShowConfirmModal(false);
        setPopupAction(null)
    };

    return (
        (isLoading) ?
            <div className='profile-loader-main-container'>
                <div className="profile-loader"></div>
            </div> :
            <div className='profile-main-container-wrapper'>
                <Nav
                    isBell={true}
                />
                <div className='profile-main-container'>
                    <div className='user-profile-content'>
                        <div className='user-profile-navigator'>
                            <span className={profileContent === "Posts" ? "active" : ""} onClick={() => setProfileContent("Posts")}>
                                Posts
                            </span>
                            <span className={profileContent === "About" ? "active" : ""} onClick={() => setProfileContent("About")}>
                                About
                            </span>
                            <span className={profileContent === "Followers" ? "active" : ""} onClick={() => setProfileContent("Followers")}>
                                Followers
                            </span>
                            <span className={profileContent === "Followings" ? "active" : ""} onClick={() => setProfileContent("Followings")}>
                                Followings
                            </span>
                            {
                                (localStorage.getItem("token") && (localStorage.getItem("userId")===userID)) && <span className={profileContent === "Saved-Posts" ? "active" : ""} onClick={() => setProfileContent("Saved-Posts")}>
                                    Saved Posts
                                </span>
                            }
                        </div>
                        <div className='user-profile-navigator-content'>
                            {(() => {
                                switch (profileContent) {
                                    case "Posts":
                                        return <ProfilePosts type={"posts"} />;
                                    case "About":
                                        return <AboutFragment/>
                                    case "Followers":
                                        return <ProfileAuthors type="followers" />;
                                    case "Followings":
                                        return <ProfileAuthors type="followings" />;
                                    case "Saved-Posts":
                                        return <ProfilePosts type={"saved-posts"} />;
                                    default:
                                        return <ProfilePosts type={"posts"} />;
                                }
                            })()}
                        </div>
                    </div>
                    <div className='user-profile-head'>
                        {!editProfile ? (
                            <div className='user-profile-head-content'>
                                <div className='user-profile-head-top'>
                                    <div className='user-profile-background-profile-image-container'>
                                        {!(userID && localStorage.getItem("userId") !== userID) && localStorage.getItem('token') && (
                                            <span className='edit-profile-button'>
                                                <MdEditNote className='svg-icon-edit-profile' onClick={handleEditProfile} />
                                                <span className='edit-profile-button-text'>Edit profile</span>
                                            </span>
                                        )}
                                        <div className='user-profile-pic'>
                                            {(profilePicUrl !== "") && <img src={profilePicUrl} />}
                                        </div>
                                    </div>
                                    <span className='profile-pic-name'>{username}</span>
                                    <span className='profile-pic-follower-count'>{formatNumber(followers.length)} Followers</span>
                                    <span className='profile-pic-bio'>{bio}</span>
                                    {(() => {
                                        const localStorageUserId = localStorage.getItem("userId");
                                        const token = localStorage.getItem("token");

                                        // Case 1: If there's no token, show "Follow +"
                                        if (!token) {
                                            return (
                                                <span className='user-author-profile-follow-following-button user-author-profile-follow-button' onClick={() => handleAuthorFollowUnfollow(userID)}>
                                                    Follow +
                                                </span>
                                            );
                                        }

                                        // Case 2: If there's a token and the user IDs don't match
                                        if (userID && localStorageUserId !== userID) {
                                            const isFollowing = followers.includes(localStorageUserId);

                                            return (
                                                <span className={`user-author-profile-follow-following-button ${isFollowing ? 'user-author-profile-following-button' : 'user-author-profile-follow-button'}`}
                                                    onClick={() => handleAuthorFollowUnfollow(userID)}
                                                >
                                                    {isFollowing ? "Following" : "Follow +"}
                                                </span>
                                            );
                                        }
                                        return null;
                                    })()}

                                </div>
                            </div>
                        ) : (
                            <div className="user-profile-head-form">
                                <div className="user-profile-background-profile-image-container">
                                    <span className='edit-profile-button'>
                                        <MdSave className='svg-icon-edit-profile' onClick={handleEditProfile} />
                                        <span className='edit-profile-button-text'>Save profile</span>
                                    </span>
                                    <div className='user-profile-pic'>
                                        {(tempProfilePic) ? <img src={tempProfilePic} /> : <img src={profilePicUrl} />}
                                    </div>
                                </div>
                                <div className="edit-profile-form-head-top">
                                    <div className="edit-profile-form-image-container">
                                        <input type="file" accept="image/*" onChange={handleImageChange} />
                                    </div>
                                    <span className='profile-pic-name'>{username}</span>
                                    <span className='profile-pic-follower-count'>{formatNumber(followers.length)} Followers</span>
                                    <span className='profile-pic-follower-count'>Profile bio</span>
                                    <textarea
                                        rows="3"
                                        id="profileBio"
                                        value={bio}
                                        className="edit-profile-edit-bio"
                                        onChange={handleBioChange}
                                        maxLength={500}
                                    />
                                    <span className="bio-char-count">{bio.length}/500</span>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                {showConfirmModal && <PopUpOverlay popupAction={popupAction} confirmAction={confirmSave} cancelAction={cancelSave} />}
            </div>
    );
}

export default Profile;