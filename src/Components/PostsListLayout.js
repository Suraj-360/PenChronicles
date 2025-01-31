import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../Styles/PostsListLayout.css';
import { FaEdit } from "react-icons/fa";
import { AiFillDelete } from "react-icons/ai";
import PopUpOverlay from './PopUpOverlay';
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { MdOutlineDateRange } from "react-icons/md";

function PostsListLayout({ id, title, description, category, tags, sections, createdAt, imgURL, type, openDrawerWithPost, handleResendData }) {
    const [showPopup, setShowPopup] = useState(false);
    const [popupAction, setPopupAction] = useState(null);
    const navigate = useNavigate();

    const handleEditPost = () => {
        openDrawerWithPost({ id, title, description, category, tags, sections });
    };

    const handleDeletePost = () => {
        setPopupAction('delete');
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
    };

    const handleDestroyPost = () => {
        setPopupAction('destroy');
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
    };

    const handleRestorePost = () => {
        setPopupAction('restore');
        setShowPopup(true);
        document.body.style.overflow = 'hidden';
    };

    const confirmAction = async () => {
        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin");
            }

            const endpoint = popupAction === 'delete'
                ? `${process.env.REACT_APP_BACKEND_URL}/app/v1/temp-delete-post`
                : popupAction === 'destroy'
                    ? `${process.env.REACT_APP_BACKEND_URL}/app/v1/permanent-delete-post`
                    : `${process.env.REACT_APP_BACKEND_URL}/app/v1/restore-delete-post`; // Add restore endpoint

            const method = popupAction === 'delete' ? 'PUT' :
                popupAction === 'destroy' ? 'DELETE' : 'PUT'; // Restore uses PUT method

            const response = await fetch(endpoint, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ postId: id }), // Send postId as JSON
            });

            const data = await response.json();

            if (response.status !== 200) {
                toast.error(data.message || 'Error while doing action', {
                    position: 'top-center',
                    autoClose: 3000,
                    className: "custom-toast"
                });
            }

            toast(data.message || "Work done", {
                position: "top-center", // Center the toast horizontally at the top
                autoClose: 3000, // Auto close after 3 seconds
                className: "custom-toast", // Add custom class for styling
            });

            handleResendData();
            setShowPopup(false);
            document.body.style.overflow = 'auto'; // Enable scrolling
        } catch (error) {
            console.error(error);
            alert('Action failed!');
        }
    };

    const cancelAction = () => {
        setShowPopup(false);
        document.body.style.overflow = 'auto'; // Enable scrolling
    };

    const formateDate = (date) => {
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    }

    return (
        <div className='post-editor-post-list-layout-main-container'>
            <img src={imgURL} alt="Post Thumbnail" />
            <div className='post-editor-post-content-and-button-container'>
                <div className='post-editor-post-content-container'>
                    <span className='post-editor-post-content-timestamp'><MdOutlineDateRange />{formateDate(new Date(createdAt))}</span>
                    <span className='post-editor-post-content-title'>{title}</span>
                    <span className='post-editor-post-content-description'>{description}</span>
                </div>
                <div className='post-editor-button-container'>
                    {(() => {
                        switch (type) {
                            case "trash":
                                return (
                                    <>
                                        <span className='post-editor-button post-editor-one-button' onClick={handleRestorePost}>
                                            <FaEdit className='post-editor-button-icon' />Restore
                                        </span>
                                        <span className='post-editor-button post-editor-two-button' onClick={handleDestroyPost}>
                                            <AiFillDelete className='post-editor-button-icon' />Destroy
                                        </span>
                                    </>
                                );
                            default:
                                return (
                                    <>
                                        <span className='post-editor-button post-editor-one-button' onClick={handleEditPost}>
                                            <FaEdit className='post-editor-button-icon' />Edit
                                        </span>
                                        <span className='post-editor-button post-editor-two-button' onClick={handleDeletePost}>
                                            <AiFillDelete className='post-editor-button-icon' />Delete
                                        </span>
                                    </>
                                );
                        }
                    })()}
                </div>
            </div>

            {showPopup && <PopUpOverlay popupAction={popupAction} confirmAction={confirmAction} cancelAction={cancelAction} />}
        </div>
    );
}

export default PostsListLayout;
