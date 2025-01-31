import React, { useEffect, useState } from 'react'
import '../Styles/Home.css'
import Nav from '../Components/Nav.js'
import { ImArrowUpRight } from "react-icons/im"
import { SlCalender } from "react-icons/sl"
import SearchSection from '../Components/SearchSection.js'
import { motion } from 'framer-motion';
import Footer from '../Components/Footer.js'
import { CiTimer } from "react-icons/ci";
import 'react-toastify/dist/ReactToastify.css';
import BlogCardSkeleton from '../Components/BlogCardSkeleton.js'
import { useNavigate } from 'react-router-dom'
import PostsListWithPagination from '../Components/PostsListWithPagination.js'
import PostsNotAvailable from '../Components/PostsNotAvailable.js'

function Home() {
  const [recentPosts, setRecentPosts] = useState([]);
  const [trendingPosts, setTrendingPosts] = useState([]);
  const [trandingLoading, setTrandingLoading] = useState(false);
  const navigate = useNavigate();

  const text = "Fresh perspectives, daily insights, and stories that matter—explore now!";

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const token = localStorage.getItem("token");

        if (token) {
          
          const recentResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/get-recent-posts`, {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`, // Include token if available
            },
          });

          if (!recentResponse.ok) {
            throw new Error("Failed to fetch recent posts");
          }
          const recentData = await recentResponse.json();
          setRecentPosts(recentData.recentPosts);
        }

        setTrandingLoading(true);
        // Always fetch trending posts
        const trendingResponse = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/get-trending-posts`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!trendingResponse.ok) {
          throw new Error("Failed to fetch trending posts");
        }

        setTrandingLoading(false);
        const trendingData = await trendingResponse.json();
        setTrendingPosts(trendingData.posts);

      } catch (error) {
        console.error("Error fetching posts:", error);
        setTrandingLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const truncateTags = (tags, maxChars) => {
    let charCount = 0;
    const truncatedTags = [];

    for (let tag of tags) {
      const tagLength = tag.length;
      if (charCount + tagLength <= maxChars) {
        truncatedTags.push(tag);
        charCount += tagLength + 1;
      } else {
        break;
      }
    }
    return truncatedTags;
  };

  const capitalizeWords = (phrase) => {
    return phrase
      .split(' ')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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

  const formateDate = (date) => {
    return new Intl.DateTimeFormat('en-GB', {
      day: 'numeric',
      month: 'long',
      year: 'numeric',
    }).format(date);
  }

  const truncateString = (str) => {
    if (str.length > 180) {
      return str.slice(0, 180) + '...';
    }
    return str;
  };

  const handleNavigateProfile = (id, event) => {
    event.stopPropagation();
    navigate(`/${id}/profile`)
  };

  const handleNavigateReadPost = (postId) => {
    navigate(`/readPost/${postId}`);
  };

  return (
    <div className='home-container-wrapper'>
      <Nav
        isBell={true}
      />

      {/* Header Text Section */}
      <div className="the-blog-heading">
        {text.split("").map((char, index) => {
          // Check if the character is a space, if so, don't animate it
          return (
            <motion.span
              key={index}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.05, type: "spring", stiffness: 50 }}
            >
              {char === " " ? "\u00A0" : char}  {/* "\u00A0" is a non-breaking space */}
            </motion.span>
          );
        })}

      </div>

      <SearchSection />

      {/* Recent blog posts section */}
      {(recentPosts && recentPosts.length >= 4) &&
        <>
          <span className='recent-blog-header'># Recent viewed posts <CiTimer className='recent-blog-header-icon' /></span>
          <div className='recent-blogs-main-container'>
            <div className='recent-blog-top-left-container' onClick={() => handleNavigateReadPost(recentPosts[0]._id)}>
              <div className='image-container'>
                <img src={recentPosts[0].thumbnail}></img>
              </div>
              <div className='recent-blog-top-left-content-container'>
                <div className='blog-author-and-timestamp'>
                  <span className='blog-author-and-timestamp-username' onClick={(event) => handleNavigateProfile(recentPosts[0].postBy._id, event)}>{recentPosts[0].postBy.username}</span>
                  <span><SlCalender />{formateDate(new Date(recentPosts[0].createdAt))}</span>
                </div>
                <div className='blog-heading-container'><span>{recentPosts[0].title}</span> <ImArrowUpRight className='heading-arrow' /></div>
                <p>{truncateString(recentPosts[0].description)}</p>
                <div className='blog-tag-container'>
                  {truncateTags(recentPosts[0].tags, 50)
                    .map(tag => capitalizeWords(tag))
                    .sort((a, b) => a.length - b.length)
                    .map((tag, index) => (
                      <span className="blog-tag-box" key={index} style={getRandomColorStyle()}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className='recent-blog-top-right-first-container' onClick={() => handleNavigateReadPost(recentPosts[1]._id)}>
              <div className='image-container'>
                <img src={recentPosts[1].thumbnail}></img>
              </div>
              <div className='recent-blog-top-right-first-container-content'>
                <div className='blog-author-and-timestamp'>
                  <span className='blog-author-and-timestamp-username' onClick={(event) => handleNavigateProfile(recentPosts[1].postBy._id, event)}>{recentPosts[1].postBy.username}</span>
                  <span><SlCalender />{formateDate(new Date(recentPosts[1].createdAt))}</span>
                </div>

                <div className='blog-heading-container'><span>{recentPosts[1].title}</span> <ImArrowUpRight className='heading-arrow' /></div>
                <p>{truncateString(recentPosts[1].description)}</p>
                <div className='blog-tag-container'>
                  {truncateTags(recentPosts[1].tags, 50)
                    .map(tag => capitalizeWords(tag))
                    .sort((a, b) => a.length - b.length)
                    .map((tag, index) => (
                      <span className="blog-tag-box" key={index} style={getRandomColorStyle()}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>

            <div className='recent-blog-top-right-second-container' onClick={() => handleNavigateReadPost(recentPosts[2]._id)}>
              <div className='image-container'>
                <img src={recentPosts[2].thumbnail}></img>
              </div>
              <div className='recent-blog-top-right-second-container-content'>
                <div className='blog-author-and-timestamp'>
                  <span className='blog-author-and-timestamp-username' onClick={(event) => handleNavigateProfile(recentPosts[2].postBy._id, event)}>{recentPosts[2].postBy.username}</span>
                  <span><SlCalender />{formateDate(new Date(recentPosts[2].createdAt))}</span>
                </div>

                <div className='blog-heading-container'><span>{recentPosts[2].title}</span> <ImArrowUpRight className='heading-arrow' /></div>
                <p>{truncateString(recentPosts[2].description)}</p>
                <div className='blog-tag-container'>
                  {truncateTags(recentPosts[2].tags, 50)
                    .map(tag => capitalizeWords(tag))
                    .sort((a, b) => a.length - b.length)
                    .map((tag, index) => (
                      <span className="blog-tag-box" key={index} style={getRandomColorStyle()}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
            <div className='recent-blog-bottom-container' onClick={() => handleNavigateReadPost(recentPosts[3]._id)}>
              <div className='image-container'>
                <img src={recentPosts[3].thumbnail}></img>
              </div>
              <div className='recent-blog-bottom-container-content'>
                <div className='blog-author-and-timestamp'>
                  <span className='blog-author-and-timestamp-username' onClick={(event) => handleNavigateProfile(recentPosts[3].postBy._id, event)}>{recentPosts[3].postBy.username}</span>
                  <span><SlCalender />{formateDate(new Date(recentPosts[3].createdAt))}</span>
                </div>

                <div className='blog-heading-container'><span>{recentPosts[3].title}</span> <ImArrowUpRight className='heading-arrow' /></div>
                <p>{truncateString(recentPosts[3].description)}</p>
                <div className='blog-tag-container'>
                  {truncateTags(recentPosts[3].tags, 50)
                    .map(tag => capitalizeWords(tag))
                    .sort((a, b) => a.length - b.length)
                    .map((tag, index) => (
                      <span className="blog-tag-box" key={index} style={getRandomColorStyle()}>
                        {tag}
                      </span>
                    ))}
                </div>
              </div>
            </div>
          </div>
        </>}

      <span className='horizontal-ruler'></span>

      {
        trandingLoading ? (
          <div className="trending-blogs-home-loading-main-container">
            {Array.from({ length: 8 }).map((_, i) => (
              <BlogCardSkeleton key={i} />
            ))}
          </div>
        ) : (
          <>
            <div className="all-blogs-home-main">
              {trendingPosts.length > 0 ?
                <>
                  <span className="all-blogs-home-main-header">
                    # Trending <ImArrowUpRight className="heading-arrow-all-blogs-home" />
                  </span>
                  <PostsListWithPagination posts={trendingPosts} />
                </>
                : <PostsNotAvailable />}
            </div>
          </>
        )
      }
      <Footer />
    </div>
  )
}

export default Home