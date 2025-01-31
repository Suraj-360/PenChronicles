import React, { useEffect, useState } from 'react'
import '../Styles/Notification.css';
import { io } from "socket.io-client";
import { useNavigate } from 'react-router-dom';
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { MdClear } from "react-icons/md";
import Nav from '../Components/Nav';
import { IoNotifications } from "react-icons/io5";

dayjs.extend(relativeTime);

// Initialize socket connection
const socket = io(`${process.env.BACKEND_URL}`, { path: '/socket.io' });

function Notification() {
    const [notifications, setNotifications] = useState([]);
    const navigate = useNavigate();
    const [unreadCount, setUnreadCount] = useState(0);
    const notification_like = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736599380/PenChronicles%20assets/like_vz0umf.png";
    const notification_follow = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736619364/PenChronicles%20assets/contact_vfxvxx.png";
    const notification_comment = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736600546/PenChronicles%20assets/comment_cuz0zs.png";
    const notification_newPost = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/draft_dik1d4.png";


    // Function to calculate and update unread count
    const updateUnreadCount = (notifications) => {
        const count = notifications.filter((notif) => !notif.isRead).length;
        setUnreadCount(count);
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

    const deleteNotificationMessage = async (notificationId) => {
        try {
            const token = localStorage.getItem('token');
            if (!token) return;
    
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/delete-notification-message`, {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ notificationId }),
            });
    
            const data = await response.json();
            if (response.status === 200) {
                setNotifications((prev) => prev.filter((notif) => notif._id !== notificationId));
                updateUnreadCount(notifications)
            }
        } catch (error) {
            console.error('Error while deleting notification.', error);
        }
    };

    useEffect(() => {
        fetchNotifications();
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

    const handleRemoveNotification = (event, id) => {
        event.stopPropagation();
        deleteNotificationMessage(id)
    }

    return (
        <div className='notification-container-wrapper'>
            <Nav
                isBell={false}
            />
            <div className='notifications-main-container'>
                <div className='notifications-container-header'>
                    <IoNotifications className='notifications-container-header-icon' />
                    <span>Notifications</span>
                    <span>({unreadCount} unread)</span>
                </div>
                <div className='notifications-container-content'>
                    {notifications.length > 0 ? (
                        notifications.map((notif, index) => (
                            <div
                                key={index}
                                className='notifications-container-notification-item'
                                onClick={() => handleNavigate(notif)} // Navigate on click
                            >

                                <div className='notification-item-profile-icon-container'>
                                    {!(notif.isRead) && <span className='notification-item-unread-dot'>Unread</span>}
                                    <img src={notif.from.profilePic} className='notification-item-profile-icon' alt="Profile" />
                                    <img
                                        src={
                                            notif.type === "like" ? notification_like :
                                                notif.type === "follow" ? notification_follow :
                                                    notif.type === "comment" || notif.type === "reply" ? notification_comment:
                                                    notif.type === "new_post" ? notification_newPost :""
                                        }
                                        new_post
                                        className="notification-item-profile-sub-icon"
                                        alt="Notification Type"
                                    />
                                </div>
                                <div className='notification-item-content-container'>
                                    <p className='notification-item-message-container'>
                                        <span className='notification-item-message-from' onClick={(event) => handleNavigateProfile(notif.from._id, event)}>{notif.from.username}</span>
                                        <span>{notif.message}</span>
                                    </p>
                                    <span className='notification-item-timestamp-container'>{notif.timeAgo}</span>
                                </div>

                                <div className='notification-item-delete-button-main-container'>
                                    <span className='notification-item-delete-button-container'>
                                        <MdClear className='notification-item-delete-button-icon' onClick={(event) => { handleRemoveNotification(event, notif._id) }}/>
                                        <span className='notification-item-delete-button-text'>Remove</span>
                                    </span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <div className="notification-item">No notifications</div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Notification;
