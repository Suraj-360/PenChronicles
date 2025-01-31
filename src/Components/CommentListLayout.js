import React, { useEffect, useState } from 'react';
import '../Styles/CommentListLayout.css';
import { AiFillLike } from "react-icons/ai";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { FaReply } from "react-icons/fa";
import { LuMessageSquareReply } from "react-icons/lu";
import { useNavigate } from 'react-router-dom';


dayjs.extend(relativeTime);

function CommentListLayout({ comment, handleCommentReply, handleLikeReply }) {
    const [showReplies, setShowReplies] = useState(false); // State to toggle replies
    const [replyText, setReplyText] = useState(''); // State to hold reply text
    const [isReplyInputActive, setIsReplyInputActive] = useState(false); // State for reply input visibility
    const [showReplyActions, setShowReplyActions] = useState(false); // State for actions (Cancel & Reply) visibility
    const [currentTime, setCurrentTime] = useState(dayjs()); // To track the current time
    const navigate = useNavigate();

    // Update currentTime every second
    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);

        return () => clearInterval(interval); // Cleanup interval on unmount
    }, []);

    const toggleReplies = () => {
        setShowReplies(!showReplies);
    };

    const activateReplyInput = () => {
        setIsReplyInputActive((prev) => !prev);
    };

    const cancelReply = () => {
        setIsReplyInputActive(false);
        setShowReplyActions(false);
        setReplyText('');
    };

    const submitReply = () => {
        if (replyText.trim()) {
            handleCommentReply(comment._id, replyText); // Pass comment ID and reply text to handler
            setReplyText('');
            setShowReplyActions(false); // Hide actions after submitting
            setIsReplyInputActive(false); // Hide input after submitting
        }
    };

    const handleNavigateProfileView = (id) => {
        navigate(`/${id}/profile`);
    }

    return (
        <div className='comment-list-layout-response-container'>
            {/* Header Section */}
            <div className='response-container-header'>
                <img
                    className='response-user-profile-pic'
                    src={comment.commentBy.profilePic}
                    alt='user-profile'
                />
                <div className='response-container-content-container'>
                    <span className='response-user-name' onClick={()=>handleNavigateProfileView(comment.commentBy._id)}>{comment.commentBy.username}</span>
                    <span className='response-user-timestamp'>{dayjs(comment.createdAt).from(currentTime)}</span>
                    <div className='response-container-content'>
                        {comment.comment}
                    </div>
                </div>
            </div>

            {/* Comment Content */}

            {/* Likes and Reply Section */}
            <div className='response-container-likes-and-reply'>
                <span className='response-interaction-icons-span like'>
                    <AiFillLike className={`response-interaction-icons ${localStorage.getItem("token") &&
                        localStorage.getItem("userId") &&
                        comment.likes.some((like) => like.likedBy._id === localStorage.getItem("userId"))
                        ? "post-liked"
                        : ""
                        }`}

                        onClick={() => handleLikeReply(comment._id)} />
                    {comment.likes.length}
                </span>
                <span className='reply-btn' onClick={activateReplyInput}>
                    <FaReply className='response-container-likes-and-reply-icons' /> Reply
                </span>
                <span className='view-replies-btn' onClick={toggleReplies}>
                    <LuMessageSquareReply className='response-container-likes-and-reply-icons' />
                    {showReplies ? 'Hide Replies' : 'View Replies'}
                    {showReplies ? <IoIosArrowUp className='response-container-likes-and-reply-icons' /> : <IoIosArrowDown className='response-container-likes-and-reply-icons' />}
                    ({comment.replies.length})
                </span>
            </div>

            {/* Reply Input Section */}
            {isReplyInputActive && (
                <div className='reply-input-container'>
                    <input
                        type='text'
                        placeholder='Write a reply...'
                        value={replyText}
                        onChange={(e) => setReplyText(e.target.value)}
                        onFocus={() => setShowReplyActions(true)} // Show actions when input is focused
                        className='reply-input-box'
                    />
                    {showReplyActions && (
                        <div className='reply-actions'>
                            <button onClick={cancelReply} className='reply-cancel-btn'>
                                Cancel
                            </button>
                            <button onClick={submitReply} className='reply-submit-btn'>
                                Reply
                            </button>
                        </div>
                    )}
                </div>
            )}

            {/* Replies Section */}
            {showReplies && (
                <div className='replies-container'>
                    {/* Existing Replies */}
                    {comment.replies.length > 0 ? (
                        comment.replies.map((reply) => (
                            <div key={reply.id} className='reply-item'>
                                <img
                                    className='reply-user-profile-pic'
                                    src={reply.replyBy.profilePic}
                                    alt='reply-profile'
                                />
                                <div className='reply-item-content'>
                                    <span className='reply-user-name' onClick={()=>handleNavigateProfileView(reply.replyBy._id)}>{reply.replyBy.username}</span>
                                    <span className='reply-user-name'>{dayjs(reply.createdAt).from(currentTime)}</span>
                                    <span className='reply-text'>{reply.text}</span>
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className='no-replies'>No replies yet</p>
                    )}
                </div>
            )}
        </div>
    );
}

export default CommentListLayout;