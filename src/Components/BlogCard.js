import React from 'react';
import { SlCalender } from "react-icons/sl";
import { TiPin, TiPinOutline } from 'react-icons/ti';
import '../Styles/BlogCard.css';
import { useNavigate, useParams } from 'react-router-dom';
import { IoBookmark } from "react-icons/io5";

const BlogCard = ({ post, pinnedType, savedType, handleIsUpdated }) => {
  const userID = useParams();
  const navigate = useNavigate();

  const handlePinUnPinned = async (event, postId) => {
    event.stopPropagation();
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/signin")
      }

      if (post.postBy._id !== localStorage.getItem("userId")) {
        return;
      }
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/pin-unpin-post`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },

        body: JSON.stringify({ postId }),
      });

      const data = await response.json();

      if (response.status === 200) {
        handleIsUpdated();
      } else {
        console.error(data.message || "Error toggling pin status");
      }
    } catch (error) {
      console.error("Error:", error.message);
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

      if (response.status === 200) {
        handleIsUpdated();
      }
    } catch (error) {
      console.error("Error:", error.message);
    }
  };

  // Helper function to calculate transparent background color
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

  const truncateTags = (tags, maxChars) => {
    let charCount = 0;
    const truncatedTags = [];

    for (let tag of tags) {
      const tagLength = tag.length;
      if (charCount + tagLength <= maxChars) {
        truncatedTags.push(tag);
        charCount += tagLength + 1; // Account for the space between tags
      } else {
        break;
      }
    }

    return truncatedTags;
  };

  const formateDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  const formateTime = (date) => {
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
  }

  const handleNavigateReadPost = (postId) => {
    navigate(`/readPost/${postId}`);
  };

  const capitalizeWords = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleTagClick = (tag, event) => {
    event.stopPropagation();
    navigate(`/tag/${encodeURIComponent(tag)}/related-posts`);
  };

  const handleNavigateProfile = (id, event) => {
    event.stopPropagation();
    navigate(`/${id}/profile`)
  };

  if (!post || !post.thumbnail) {
    ///console.error("Invalid blog data:", post);
    return null; // or return a placeholder
  }

  return (
    <div className="post-article-card-container" onClick={() => handleNavigateReadPost(post._id)}>
      <img src={post.thumbnail} alt="post thumbnail"></img>
      <div className='post-article-card-container-icon-container'>
        {
          (pinnedType && (post.postBy._id === localStorage.getItem("userId"))) && <span className='post-article-card-pin-unpin-icon-container'>
            {(pinnedType && post.isPinned) && <TiPin className='post-article-card-pin-unpin-icon' onClick={(event) => handlePinUnPinned(event, post._id)} />}
            {(pinnedType && !post.isPinned) && <TiPinOutline className='post-article-card-pin-unpin-icon' onClick={(event) => handlePinUnPinned(event, post._id)} />}
          </span>
        }
        {
          (savedType && (localStorage.getItem("userId"))) && <span className='post-article-card-pin-unpin-icon-container'>
            <IoBookmark className='post-article-card-pin-unpin-icon' onClick={(event) => handleUnsavePost(event, post._id)}/>
          </span>
        }
      </div>
      {(!pinnedType) && <div className="blog-author-and-timestamp">
        <span className='blog-author-username' onClick={(event) => handleNavigateProfile(post.postBy._id, event)}>{post.postBy.username}</span>
        <span>
          <SlCalender /> {formateDate(new Date(post.createdAt))}
        </span>
      </div>}

      {(pinnedType) && <span className='post-article-date-time-only'>
        <SlCalender /> {formateDate(new Date(post.createdAt))}
      </span>}
      <span className="post-article-post-title">{post.title}</span>
      <span className='post-article-description'>{post.description}</span>
      <div className="post-article-tags-container">
        {truncateTags(post.tags, 24)
          .map(tag => capitalizeWords(tag))
          .sort((a, b) => a.length - b.length)
          .map((tag, index) => (
            <span className="post-article-post-tag" key={index} style={getRandomColorStyle()} onClick={(event) => handleTagClick(tag.toLowerCase(), event)}>
              {tag}
            </span>
          ))}
      </div>
    </div>
  );
};

export default BlogCard;
