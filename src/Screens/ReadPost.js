import React, { useState, useEffect } from 'react';
import '../Styles/ReadPost.css';
import Nav from '../Components/Nav.js';
import { AiFillLike } from "react-icons/ai";
import { FaComment } from "react-icons/fa6";
import { FaShare } from "react-icons/fa";
import { FaCirclePlay } from "react-icons/fa6";
import { RxCross2 } from "react-icons/rx";
import { FaRegStopCircle } from "react-icons/fa";
import BlogCard from '../Components/BlogCard.js'
import { useNavigate, useParams } from 'react-router-dom';
import { SlCalender } from "react-icons/sl";
import { IoMdClock } from "react-icons/io";
import CommentListLayout from '../Components/CommentListLayout.js';
import { MdRecommend } from "react-icons/md";
import { IoEye } from "react-icons/io5";
import { IoBookmark } from "react-icons/io5";
import { BsBookmarkHeart } from "react-icons/bs";

function ReadPost() {
    const [post, setPost] = useState({
        _id: "",
        title: "",
        description: "",
        tags: [],
        postBy: {
            _id: "",
            username: ""
        },
        views: 0,
        thumbnail: "",
        comments: [],
        likes: [],
        sections: [
            {
                _id: "",
                title: "",
                content: ""
            }
        ],
        readingTime: "",
        createdAt: new Date().toISOString() // Default to current date
    });

    const [relatedPosts, setRelatedPosts] = useState([]);
    const [isSaved, setIsSaved] = useState(post.isSaved);
    const [panelVisibility, setPanelVisibility] = useState(false);
    const [yourThought, setYourThought] = useState("");
    const [followings, setFollowings] = useState([]);
    const [reRender, setReRender] = useState(false);
    const navigate = useNavigate();
    const { postId } = useParams();

    const handleCommentBoxPanel = () => {
        setPanelVisibility((prev) => !prev);
    };

    useEffect(() => {
        const fetchPostRead = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-post-by-id`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ postId }),
                    }
                );

                if (response.status === 200) {
                    const data = await response.json();
                    setPost((prevPost) => ({
                        ...prevPost,
                        ...data.post
                    }));
                    setRelatedPosts(data.relatedPosts);
                }
                if (response.status === 404) {
                    console.log("not found")
                    navigate('/404-not-found')
                }
            } catch (err) {
                console.log(err.message)
            } finally {
            }
        };

        const postSavedOrNot = async () => {
            if (!localStorage.getItem("token")) {
                return;
            }
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/app/v1/user-saved-post-status`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ post_Id: postId }),
                    }
                );
                const data = await response.json();
                if (response.status == 200) {
                    setIsSaved(data.isSaved);
                }

            } catch (err) {
                console.log(err.message)
            } finally {
            }
        };

        const viewPost = async () => {
            if (!localStorage.getItem("token")) {
                return;
            }
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/app/v1/view-post`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ post_Id: postId }),
                    }
                );
                const data = await response.json();
                if (response.status !== 200) {
                    console.log(data.message)
                    return
                }

            } catch (err) {
                console.log(err.message)
            } finally {
            }
        };

        const getUserFollowingsDetails = async () => {
            if (!localStorage.getItem("token")) {
                return;
            }
            try {
                const token = localStorage.getItem("token")
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-user-followings-details`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                            Authorization: `Bearer ${token}`,
                        }
                    }
                );
                const data = await response.json();
                if (response.status === 200) {
                    console.log(data.message)
                    setFollowings(data.followings)
                    return
                }

            } catch (err) {
                console.log(err.message)
            } finally {
            }
        };

        fetchPostRead();
        postSavedOrNot();
        viewPost();
        getUserFollowingsDetails();
    }, [postId, reRender]);

    const handleLikePost = async () => {
        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin")
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/like-post/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ post_Id: postId }),
            });

            if (response.status === 200) {
                setReRender((prev) => !prev);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleCommentPost = async () => {
        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin");
                return;
            }

            if (yourThought.trim().length === 0) {
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/comment-post/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ post_Id: postId, comment: yourThought }),
            });

            if (response.ok) { // `response.ok` checks for status in the range 200–299
                setReRender((prev) => !prev); // Trigger re-render
                setYourThought(""); // Optionally clear the input
            } else if (response.status === 401) {
                navigate("/signin"); // Redirect for unauthorized
            } else {
                const errorData = await response.json();
                alert(errorData.message || "Failed to post the comment.");
            }
        } catch (error) {
            console.error("Error posting comment:", error.message);
            alert("An error occurred while posting your comment. Please try again.");
        }
    };

    const handleUnsavePost = async (event, post_Id) => {
        event.stopPropagation();
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                navigate("/signin")
            }

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/toggle-save-post`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },

                body: JSON.stringify({ post_Id }),
            });
            const data = await response.json();

            if (response.status === 200) {
                setIsSaved(data.isSaved);
            }
        } catch (error) {
            console.error("Error:", error.message);
        }
    };

    const handleCommentReply = async (comment_Id, reply) => {
        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin");
                return;
            }

            if (reply.trim().length === 0) {
                return;
            }

            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/reply-on-comment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ post_Id: postId, comment_Id, reply }),
            });

            if (response.ok) { // `response.ok` checks for status in the range 200–299
                setReRender((prev) => !prev);
            } else if (response.status === 401) {
                navigate("/signin"); // Redirect for unauthorized
            } else {
                const errorData = await response.json();
                console.log(errorData.message)
            }
        } catch (error) {
            console.error("Error posting comment:", error.message);
            alert("An error occurred while posting your comment. Please try again.");
        }
    };

    const handleCommentLike = async (comment_Id) => {
        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin")
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/like-comment/`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({ post_Id: postId, comment_Id }),
            });

            if (response.status === 200) {
                setReRender((prev) => !prev);
            }

        } catch (error) {
            console.log(error.message)
        }
    }

    const handleNavigateProfileView = () => {
        navigate(`/${post.postBy._id}/profile`);
    }

    const [isSpeaking, setIsSpeaking] = useState(false);
    const [queue, setQueue] = useState([]);
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (isSpeaking && queue.length > 0 && currentIndex < queue.length) {
            speakContent(queue[currentIndex]);
        }
    }, [isSpeaking, queue, currentIndex]);

    useEffect(() => {
        return () => {
            window.speechSynthesis.cancel(); // Stop any ongoing speech
        };
    }, []);
    
    const speakContent = (item) => {
        if (!item) return;

        const utterance = new SpeechSynthesisUtterance(item.content);
        const voices = window.speechSynthesis.getVoices();
        utterance.voice = voices.find(
            (v) => v.name === "Microsoft Zira - English (United States)"
        ) || null;
        utterance.rate = 1;
        utterance.pitch = 1;

        // Highlight the current element
        item.element.style.backgroundColor = "#a0eca0e6";
        item.element.style.transition = "background-color 0.3s ease";

        // On end of utterance
        utterance.onend = () => {
            item.element.style.backgroundColor = ""; // Remove highlight

            // Check if it's the last element
            if (currentIndex + 1 >= queue.length) {
                console.log("All content read. Stopping.");
                stopListening(); // Stop the process after finishing
            } else {
                setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next
            }
        };

        // On error
        utterance.onerror = () => {
            item.element.style.backgroundColor = ""; // Remove highlight

            // Check if it's the last element
            if (currentIndex + 1 >= queue.length) {
                stopListening(); // Stop the process after finishing
            } else {
                setCurrentIndex((prevIndex) => prevIndex + 1); // Move to next
            }
        };

        window.speechSynthesis.speak(utterance);
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

    const stopListening = () => {
        if (!isSpeaking) return;

        // Cancel current speech
        window.speechSynthesis.cancel();

        // Remove highlights
        queue.forEach((item) => {
            item.element.style.backgroundColor = "";
        });

        // Reset state
        setIsSpeaking(false);
        setQueue([]);
        setCurrentIndex(0);
    };

    const handleListen = () => {
        if (isSpeaking) return;

        const descriptionContainer = document.querySelector(".post-description");
        const sectionContainers = document.querySelectorAll(".post-section-container");

        const newQueue = [];

        // Add description content to queue
        if (descriptionContainer && descriptionContainer.textContent.trim()) {
            newQueue.push({
                element: descriptionContainer,
                content: descriptionContainer.textContent.trim(),
            });
        }

        // Add section content to queue
        sectionContainers.forEach((section) => {
            const title = section.querySelector(".post-section-title");
            const content = section.querySelector(".post-content");

            if (title && title.textContent.trim()) {
                newQueue.push({ element: title, content: title.textContent.trim() });
            }
            if (content && content.textContent.trim()) {
                newQueue.push({ element: content, content: content.textContent.trim() });
            }
        });

        if (newQueue.length === 0) {
            return;
        }

        setQueue(newQueue);
        setCurrentIndex(0);
        setIsSpeaking(true);
    };

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
                    Authorization: `Bearer ${token}`, // Include token in the headers
                },
                body: JSON.stringify({ author_Id }),
            });
            if (response.status === 200) {
                setReRender((prev) => !prev);
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const formateDate = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            return "Invalid Date"; // Fallback value
        }
        return new Intl.DateTimeFormat('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric',
        }).format(date);
    };

    const formateTime = (date) => {
        if (!(date instanceof Date) || isNaN(date)) {
            return "Invalid Time"; // Fallback value
        }
        let hours = date.getHours();
        const minutes = date.getMinutes().toString().padStart(2, "0");
        const ampm = hours >= 12 ? "PM" : "AM";
        hours = hours % 12 || 12;
        return `${hours}:${minutes} ${ampm}`;
    };

    const getBackgroundFromColor = (color) => {
        const hexToRgb = (hex) => {
            const shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
            const fullHex = hex.replace(shorthandRegex, (m, r, g, b) => r + r + g + g + b + b);
            const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(fullHex);
            return result
                ? { r: parseInt(result[1], 16), g: parseInt(result[2], 16), b: parseInt(result[3], 16) }
                : null;
        };

        const rgb = hexToRgb(color);
        if (!rgb) return 'rgba(0, 0, 0, 0.1)'; // Default transparent gray if invalid color
        return `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 0.2)`;
    };

    const getRandomColorStyle = () => {
        const textColor = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
        const backgroundColor = getBackgroundFromColor(textColor);
        return { backgroundColor, color: textColor };
    };

    const handleTagClick = (tag, event) => {
        event.stopPropagation();
        navigate(`/tag/${encodeURIComponent(tag)}/related-posts`);
    };

    return (
        <div className='read-post-main-container'>
            <Nav
                isBell={true}
            />
            {panelVisibility &&
                <div className='comment-box-panel'>
                    <div className='comment-box-panel-header'>
                        <h2>Responses ({post.comments.length})</h2>
                        <RxCross2 className='close-comment-box-panel' onClick={handleCommentBoxPanel} />
                    </div>
                    <form className='comment-box-form-container'>
                        <div className="comment-box-input-group">
                            <input
                                type="text"
                                placeholder="What are your thought?"
                                className="form-input-comment-box"
                                value={yourThought}
                                onChange={(e) => setYourThought(e.target.value)}
                            />
                            <span className='comment-box-respond-button' onClick={handleCommentPost}>Respond</span>
                        </div>
                    </form>
                    <span className='horizontal-ruler'></span>
                    <div className='responses-main-container'>
                        {
                            post.comments.map((item, index) => {
                                return (
                                    <CommentListLayout
                                        comment={item}
                                        handleCommentReply={handleCommentReply}
                                        handleLikeReply={handleCommentLike}
                                    />
                                )
                            })
                        }
                    </div>
                </div>
            }
            <div className='post-main-container'>
                <div className='about-author-main-container'>
                    <img src={post.postBy.profilePic} alt="Author" />
                    <div className='author'>
                        <span className='author-name' onClick={handleNavigateProfileView}>{post.postBy.username}</span>
                        {!localStorage.getItem("token") ? (
                            // Case 1: Token nahi hai, toh "Follow" show karna
                            <span className='follow-following-author follow-author-button' onClick={() => handleAuthorFollowUnfollow(post.postBy._id)}>Follow</span>
                        ) : localStorage.getItem("userId") === post.postBy._id ? (
                            // Case 2: User apni khud ki post dekh raha hai, kuch nahi dikhana
                            null
                        ) : followings.includes(post.postBy._id) ? (
                            // Case 3: Followings list me user hai, toh "Following" show karna
                            <span className='follow-following-author following-author-button' onClick={() => handleAuthorFollowUnfollow(post.postBy._id)}>Following</span>
                        ) : (
                            // Case 4: Default case, agar following nahi hai toh "Follow" show karna
                            <span className='follow-following-author follow-author-button' onClick={() => handleAuthorFollowUnfollow(post.postBy._id)}>Follow</span>
                        )}
                    </div>
                    <div className='followers-count-and-post-timestamp'>
                        <span className='followers-count'>{formatNumber(post.postBy.followersCount)} Followers</span>
                        <div className='wrapper-read-time-and-last-update'>
                            <span className='read-time'>{post.readingTime}</span>
                            <span className='last-update'><SlCalender />{formateDate(new Date(post.createdAt))}</span>
                            <span className='last-update'><IoMdClock /> {formateTime(new Date(post.createdAt))}</span>
                        </div>
                    </div>
                </div>
                <span className='horizontal-ruler'></span>
                <div className='post-interactions-main'>
                    <div className='post-interactions'>
                        <span className='post-interaction-icons-span like'>
                            <AiFillLike
                                className={`post-interaction-icons ${localStorage.getItem("token") &&
                                    localStorage.getItem("userId") &&
                                    post.likes.some((like) => like.likedBy._id === localStorage.getItem("userId"))
                                    ? "post-liked"
                                    : ""
                                    }`}

                                onClick={handleLikePost}
                            />
                            {formatNumber(post.likes.length)}
                            <span className='hover-like hover-text'>Like</span>
                        </span>
                        <span className='post-interaction-icons-span comment' onClick={handleCommentBoxPanel}>
                            <FaComment className='post-interaction-icons' />
                            {formatNumber(post.comments.length)}
                            <span className='hover-comment hover-text'>Comment</span>
                        </span>

                        <span className='post-interaction-icons-span views'>
                            <IoEye className='post-interaction-icons' />
                            {formatNumber(post.views)}
                            <span className='hover-views hover-text'>Post views</span>
                        </span>
                    </div>
                    <div className='post-interactions'>
                        <span
                            className="post-interaction-icons-span listen"
                            onClick={isSpeaking ? stopListening : handleListen}
                        >
                            {isSpeaking ? (
                                <FaRegStopCircle className="post-interaction-icons" />
                            ) : (
                                <FaCirclePlay className="post-interaction-icons" />
                            )}
                            <span className="hover-listen hover-text">Listen</span>
                        </span>
                        {
                            !localStorage.getItem("token") ? (
                                <span className='post-interaction-icons-span save'>
                                    <BsBookmarkHeart className='post-interaction-icons' />
                                    <span className='hover-save hover-text'>Save</span>
                                </span>
                            ) : isSaved ? (
                                <span className='post-interaction-icons-span save'>
                                    <IoBookmark className='post-interaction-icons' onClick={(event) => handleUnsavePost(event, post._id)} />
                                    <span className='hover-save hover-text'>Unsave it!</span>
                                </span>
                            ) : (
                                <span className='post-interaction-icons-span save'>
                                    <BsBookmarkHeart className='post-interaction-icons' onClick={(event) => handleUnsavePost(event, post._id)} />
                                    <span className='hover-save hover-text'>Save it!</span>
                                </span>
                            )
                        }
                        <span className='post-interaction-icons-span share'>
                            <FaShare className='post-interaction-icons' />
                            <span className='hover-share hover-text'>Share</span>
                        </span>
                    </div>
                </div>
                <span className='horizontal-ruler'></span>
                <span className='post-title'>{post.title}</span>
                <img className='post-image' src={post.thumbnail} alt="Post" />
                <span className='post-description'>{post.description}</span>
                {
                    post.sections.map((section, index) => (
                        <div key={index} className="post-section-container">
                            <span className='post-section-title'>{section.title}</span>
                            <span
                                className="post-content"
                                dangerouslySetInnerHTML={{ __html: section.content }}
                            ></span>
                        </div>
                    ))
                }
                <div className='post-tags-container'>
                    {post.tags.map((tag, index) => (
                        <span className='post-tag' key={index} style={getRandomColorStyle()} onClick={(event) => handleTagClick(tag.toLowerCase(), event)}>{tag}</span>
                    ))}
                </div>
            </div>
            <div className='post-suggestion-main-container'>
                <span className='horizontal-ruler'></span>
                {
                    (relatedPosts.length > 0) &&
                    <>
                        <span className='post-suggestion-header'># Related Posts <MdRecommend className='post-suggestion-header-icon' /></span>
                        <div className='post-suggestion-container'>
                            {relatedPosts.map((post, index) => (
                                <BlogCard
                                    key={index}
                                    post={post}
                                    pinnedType={false}
                                    handleIsUpdated={() => { }}
                                />
                            ))}
                        </div>
                    </>
                }
            </div>
        </div>
    );
}

export default ReadPost;