import React, { useEffect, useRef, useState } from 'react'
import '../Styles/Nav.css'
import { Link, useNavigate } from 'react-router-dom';
import { TbLogs } from "react-icons/tb";
import { LiaPenSquareSolid } from "react-icons/lia";
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { useTheme } from './ThemeContext';
import { GiHamburgerMenu } from "react-icons/gi";
import { IoNotifications } from "react-icons/io5";
import { FaSignInAlt } from "react-icons/fa";
import { FaCircleUser } from "react-icons/fa6";
import { IoEnter } from "react-icons/io5";
import { jwtDecode } from 'jwt-decode';
import { io } from "socket.io-client";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

// Initialize socket connection
const socket = io(`${process.env.REACT_APP_BACKEND_URL}`, { path: '/socket.io' });

function Nav({ isBell }) {
    const { isDarkMode, toggleDarkMode } = useTheme();
    const [isDrawerOpen, setIsDrawerOpen] = useState(false);
    const [notifications, setNotifications] = useState([]);
    const [showNotifications, setShowNotifications] = useState(false);
    const [showProfile, setShowProfile] = useState(false);
    const [unreadCount, setUnreadCount] = useState(0);
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    const dropdownRefProfile = useRef(null);

    const notification_like = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736599380/PenChronicles%20assets/like_vz0umf.png";
    const notification_follow = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736619364/PenChronicles%20assets/contact_vfxvxx.png";
    const notification_comment = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736600546/PenChronicles%20assets/comment_cuz0zs.png";
    const notification_newPost = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/draft_dik1d4.png";

    const handleNavDrawer = () => {
        setIsDrawerOpen((prev) => {
            const newState = !prev;
            if (newState) {
                // Disable scroll
                document.body.style.overflow = "hidden";
            } else {
                // Enable scroll
                document.body.style.overflow = "auto";
            }

            return newState;
        });
    };

    // Function to calculate and update unread count
    const updateUnreadCount = (notifications) => {
        const count = notifications.filter((notif) => !notif.isRead).length;
        setUnreadCount(count);
    };

    // Function to check if the token is expired
    const isTokenExpired = () => {
        const token = localStorage.getItem('token');
        if (!token) return true;

        try {
            const decodedToken = jwtDecode(token);
            const currentTime = Math.floor(Date.now() / 1000); // Current time in seconds
            return decodedToken.exp < currentTime;
        } catch (error) {
            console.error('Error decoding token:', error);
            return true;
        }
    };

    const handleLogoutClick = () => {
        localStorage.removeItem("token");
        localStorage.removeItem('userId');
        localStorage.removeItem('tokenExpiration');
        navigate("/")
    };

    // Fetch notifications
    const fetchNotifications = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/get-notification`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();
            if (response.status === 200) {
                const sortedNotifications = (data.notifications || [])
                    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) // Sort by createdAt descending
                    .map((notif) => ({
                        ...notif,
                        timeAgo: dayjs(notif.createdAt).fromNow(),
                    }));

                setNotifications(sortedNotifications);
                updateUnreadCount(sortedNotifications);
            }
        } catch (error) {
            console.error('Error fetching notifications:', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
        document.body.style.overflow = "auto";
    }, []);

    useEffect(() => {
        const userId = localStorage.getItem('userId'); // Assuming userId is stored in localStorage
        if (userId) {
            socket.emit('join', userId);
        }

        // Listen for new notifications
        socket.on('notification-update', (newNotification) => {
            setNotifications((prev) => {
                const updatedNotifications = [...prev, newNotification].sort(
                    (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
                );
                updateUnreadCount(updatedNotifications);
                return updatedNotifications;
            });
        });

        return () => {
            socket.off('notification-update');
        };
    }, []);

    useEffect(() => {
        const checkTokenValidity = () => {
            const token = localStorage.getItem('token');
            if (token) {  // Check if token exists in localStorage
                if (isTokenExpired()) {
                    handleLogoutClick();
                }
            }
        };

        // Check every 5 minutes if the token exists
        const interval = setInterval(checkTokenValidity, 0.5 * 60 * 1000);

        return () => clearInterval(interval); // Cleanup on component unmount
    }, []);

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    // Close drawer when clicking outside
    const handleClickOutside = (e) => {
        if (isDrawerOpen && !e.target.closest(".nav-drawer") && !e.target.closest(".ham-burger-icon")) {
            setIsDrawerOpen(false);
            document.body.style.overflow = "auto";
        }
    };

    // Handle navigation based on notification type
    const handleNavigate = async (notif) => {
        if (!notif.isRead) {
            await markNotificationAsRead(notif._id); // Mark as read if not already read
        }

        switch (notif.type) {
            case "follow":
                navigate(`/${notif.from._id}/profile`);
                break;
            case "like":
            case "comment":
            case "new_post":
            case "reply":
                if (notif.post) {
                    navigate(`/readpost/${notif.post}`);
                } else {
                    console.log("Post ID missing for this notification");
                }
                break;
            default:
                console.log("Unknown notification type");
        }
    };

    const handleNavigateProfile = (id, event) => {
        event.stopPropagation();
        navigate(`/${id}/profile`)
    };

    // Close drawer on Escape key press
    useEffect(() => {
        const handleKeyDown = (e) => {
            if (e.key === "Escape") {
                setIsDrawerOpen(false);
                document.body.style.overflow = "auto";
            }
        };

        window.addEventListener("keydown", handleKeyDown);
        return () => {
            window.removeEventListener("keydown", handleKeyDown);
        };
    }, []);

    // Attach event listener to detect clicks outside the drawer
    useEffect(() => {
        if (isDrawerOpen) {
            document.addEventListener("click", handleClickOutside);
        } else {
            document.removeEventListener("click", handleClickOutside);
        }
        return () => {
            document.removeEventListener("click", handleClickOutside);
        };
    }, [isDrawerOpen]);

    const handleHomeClick = () => {
        navigate("/")
    }

    // Update the "timeAgo" for all notifications
    useEffect(() => {
        const updateTimeAgo = () => {
            setNotifications((prevNotifications) =>
                prevNotifications.map((notif) => ({
                    ...notif,
                    timeAgo: dayjs(notif.createdAt).fromNow(),
                }))
            );
        };

        updateTimeAgo(); // Initial calculation
        const interval = setInterval(updateTimeAgo, 60000); // Update every minute

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    useEffect(() => {
        const handleClickOutside = (event) => {
            // Check for notifications dropdown
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setShowNotifications(false); // Close notifications dropdown
            }

            // Check for profile dropdown
            if (dropdownRefProfile.current && !dropdownRefProfile.current.contains(event.target)) {
                setShowProfile(false); // Close profile dropdown
            }
        };

        // Add event listener
        document.addEventListener('mousedown', handleClickOutside);

        return () => {
            // Cleanup event listener
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const markNotificationAsRead = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/mark-notification-as-read`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId }),
            });

            const data = await response.json();
            if (response.status === 200) {
                setNotifications((prev) => {
                    const updatedNotifications = prev.map((notif) =>
                        notif._id === notificationId ? { ...notif, isRead: true } : notif
                    );
                    updateUnreadCount(updatedNotifications); // Update unread count
                    return updatedNotifications;
                });
            } else {
                console.log(data.message);
            }
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    return (
        /*Nav Main Container */
        <div className='nav-container-main'>

            {/* Nav Logo Container */}
            <div className='nav-logo-con' onClick={handleHomeClick}>
                <h1>PenChronicles</h1>
            </div>
            {(isDrawerOpen) ?
                <div className='nav-drawer-container'>
                    <div className='nav-drawer'>
                        <ul>
                            <li>
                                <Link className='nav-drawer-list-link' to="/posts"><TbLogs className='svg-icon-nav-drawer' />Posts</Link>
                            </li>
                            <li>
                                <Link className='nav-drawer-list-link' to="/write"> <LiaPenSquareSolid className='svg-icon-nav-drawer' /> Write</Link>
                            </li>

                            {
                                localStorage.getItem("token") && (
                                    <>
                                        <li>
                                            <Link className='nav-drawer-list-link' to={`/${localStorage.getItem("userId")}/profile`}> <FaCircleUser className='svg-icon-nav-drawer' /> Profile</Link>
                                        </li>
                                        <li>
                                            <Link className='nav-drawer-list-link' to="/user-notifications"> <IoNotifications className='svg-icon-nav-drawer' /> Notification ({unreadCount} messages)</Link>
                                        </li>
                                        <li>
                                            <Link className='nav-drawer-list-link' onClick={handleLogoutClick}><IoEnter className='svg-icon-nav-drawer' />Sign Out</Link>
                                        </li>
                                    </>
                                )
                            }

                            {
                                !localStorage.getItem("token") && (
                                    <>
                                        <li>
                                            <Link className='nav-drawer-list-link' to="/signup"><IoEnter className='svg-icon-nav-drawer' />Sign Up</Link>
                                        </li>
                                        <li>
                                            <Link className='nav-drawer-list-link' to="/signin"><FaSignInAlt className='svg-icon-nav-drawer' />Sign In</Link>
                                        </li>
                                    </>
                                )
                            }
                        </ul>
                    </div></div> : null
            }

            {/* Nav List Container */}
            <div className='nav-list-con'>
                <ul className='nav-list'>
                    {(localStorage.getItem('token') && isBell) && (
                        <li className="nav-notify" onClick={() => setShowNotifications((prev) => !prev)}>
                            <IoNotifications className="svg-icon-medium" />
                            {unreadCount > 0 && (
                                <span className="notification-badge">
                                    {unreadCount > 9 ? "9+" : unreadCount}
                                </span>
                            )}
                            {showNotifications && (
                                <div ref={dropdownRef} className="nav-notify-drop-box">
                                    <div className='nav-notify-drop-box-header'>
                                        Notification
                                    </div>
                                    <div className='nav-notify-drop-box-content'>
                                        {notifications.length > 0 ? (
                                            <>
                                                {/* Limit displayed notifications to 9 */}
                                                {notifications.slice(0, 9).map((notif, index) => (
                                                    <div key={index} className="notification-item">
                                                        <div className='notification-item-profile-icon-container'>
                                                            <img src={notif.from.profilePic} className='notification-item-profile-icon' />
                                                            <img
                                                                src={
                                                                    notif.type === "like" ? notification_like :
                                                                        notif.type === "follow" ? notification_follow :
                                                                            notif.type === "comment" ? notification_comment :
                                                                                notif.type === "reply" ? notification_comment :
                                                                                    notif.type === "new_post" ? notification_newPost:
                                                                                    ""
                                                                }
                                                                className="notification-item-profile-sub-icon"
                                                            />
                                                        </div>
                                                        <div className='notification-item-content-container'>
                                                            <p className='notification-item-message-container'>
                                                                <span className='notification-item-message-from' onClick={(event) => handleNavigateProfile(notif.from._id, event)}>{notif.from.username}</span>
                                                                <span className='notification-item-message' onClick={() => handleNavigate(notif)}>{notif.message}</span>
                                                            </p>
                                                            <span className='notification-item-timestamp-container'>{notif.timeAgo}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                                {/* Add "Show More" link */}
                                                <div className="notification-item show-more" onClick={() => { navigate('/user-notifications'); }}>
                                                    Show More
                                                </div>
                                            </>
                                        ) : (
                                            <div className="notification-item">No notifications</div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </li>
                    )}

                    <li>
                        <Link className='nav-list-link' to="/posts"><TbLogs className='svg-icon' />Posts</Link>
                    </li>
                    <li>
                        <Link className='nav-list-link' to="/write"> <LiaPenSquareSolid className='svg-icon' /> Write</Link>
                    </li>

                    {
                        !localStorage.getItem("token") && (
                            <>
                                <li>
                                    <Link className='nav-list-link' to="/signup">Sign Up</Link>
                                </li>
                                <li>
                                    <Link className='nav-list-link' to="/signin">Sign In</Link>
                                </li>
                            </>
                        )
                    }

                    <li>
                        {(isDarkMode) ? <button className='toggle-theme-nav-page' onClick={toggleDarkMode}>Light Mode <MdOutlineDarkMode className='svg-icon-toggle-nav-page' /></button> : <button className='toggle-theme-nav-page' onClick={toggleDarkMode}>Dark Mode <MdDarkMode className='svg-icon-toggle-nav-page dark-mode-gold' /></button>}
                    </li>

                    {
                        localStorage.getItem("token") && (
                            <li className='nav-profile'>
                                <FaCircleUser className='svg-icon-large' onClick={() => setShowProfile((prev) => !prev)} />
                                {showProfile &&
                                    <div ref={dropdownRefProfile} className='nav-profile-drop-box'>
                                        <span><Link className='nav-list-link-drop-box' to={`/${localStorage.getItem("userId")}/profile`}>Profile</Link></span>
                                        <span className='nav-list-link-drop-box' onClick={handleLogoutClick}>Sign Out</span>
                                    </div>
                                }
                            </li>
                        )}
                </ul>
                <ul className='tab-mode-nav-list'>
                    <li>
                        {/* {(isDarkMode) ? <MdOutlineDarkMode onClick={toggleTheme} className='svg-icon-toggle ' /> : <MdDarkMode onClick={toggleTheme} className='svg-icon-toggle ' />} */}
                        {(isDarkMode) ? <button className='toggle-theme-nav-page' onClick={toggleDarkMode}>Light Mode <MdOutlineDarkMode className='svg-icon-toggle-nav-page' /></button> : <button className='toggle-theme-nav-page' onClick={toggleDarkMode}>Dark Mode <MdDarkMode className='svg-icon-toggle-nav-page dark-mode-gold' /></button>}
                    </li>
                    <li><GiHamburgerMenu className='ham-burger-icon' onClick={handleNavDrawer} /></li>
                </ul>
            </div>
        </div>
    )
}

export default Nav