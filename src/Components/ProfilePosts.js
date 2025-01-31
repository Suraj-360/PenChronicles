import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { TiPin } from 'react-icons/ti';
import { TiPinOutline } from "react-icons/ti";
import { IoBookmark } from "react-icons/io5";
import '../Styles/ProfilePosts.css';
import BlogCard from './BlogCard';
import BlogCardSkeleton from './BlogCardSkeleton';

function ProfilePosts({ type }) {
  const [posts, setPosts] = useState([]);
  const [pinedPosts, setPinedPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isUpdated, setIsUpdated] = useState(false);
  const userID = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      setLoading(true);
      try {
        let user_Id = userID?.userID;
        const token = localStorage.getItem('token');

        if (!user_Id) {
          const storedUserId = localStorage.getItem('userId');
          if (token && storedUserId) {
            user_Id = storedUserId;
          } else {
            navigate('/signin');
            return;
          }
        }

        const apiUrl =
          type === 'posts'
            ? `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-profile-posts/`
            : `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-profile-saved-posts`;

        const headers = {
          'Content-Type': 'application/json',
        };

        // Add token to headers if it's a request for saved posts
        if (type === 'saved-posts' && token) {
          headers.Authorization = `Bearer ${token}`;
        }

        const response = await fetch(apiUrl, {
          method: 'POST',
          headers,
          body: JSON.stringify({ user_Id }),
        });

        const data = await response.json();

        if (response.status === 200) {
          if (type === 'posts') {
            const { posts } = data;
            const pinned = posts.filter((post) => post.isPinned);
            const unpinned = posts.filter((post) => !post.isPinned);

            setPinedPosts(pinned);
            setPosts(unpinned);
          } else if (type === 'saved-posts') {
            setPosts(data.savePosts || []);
          }
        } else {
          console.error(data.message || 'Error fetching posts');
        }
      } catch (error) {
        console.error('Error:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [userID, isUpdated, navigate, type]);

  const handleIsUpdated = () => {
    setIsUpdated((prev) => !prev);
  };

  if (loading) {
    return (
      <div className="profile-post-loading-main-container">
        {Array.from({ length: 8 }).map((_, i) => (
          <BlogCardSkeleton key={i} />
        ))}
      </div>
    );
  }

  if (!posts?.length && !pinedPosts?.length && type === 'posts') {
    return (
      <div className="profile-posts-not-available-container">
        <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1736453697/PenChronicles%20assets/no-post-available_uzttqe.png" />
        <span>No posts</span>
      </div>
    );
  }

  if (!posts?.length && type === 'saved-posts') {
    return (
      <div className="profile-posts-not-available-container">
        <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1736453697/PenChronicles%20assets/no-post-available_uzttqe.png" />
        <span>No saved posts</span>
      </div>
    );
  }

  return (
    <div className="profile-posts-main-container">
      {type === 'posts' && (
        <>
          {/* Pinned Posts Section */}
          {pinedPosts.length > 0 && (
            <>
              <span className="pinned-post-main-header">
                <TiPin className="profile-post-pin-icon" /> Pinned Posts
              </span>
              <div className="profile-posts-pinned-section">
                {pinedPosts.map((post) => (
                  <BlogCard
                    key={post._id}
                    post={post}
                    pinnedType={true}
                    savedType={false}
                    handleIsUpdated={handleIsUpdated}
                  />
                ))}
              </div>
              <span className='horizontal-ruler-profile-post'></span>
            </>
          )}

          {/* Unpinned Posts Section */}
          <span className="pinned-post-main-header">
            <TiPinOutline className="profile-post-pin-icon" /> Unpinned Posts
          </span>
          <div className="profile-posts-unpinned-section">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                pinnedType={true}
                savedType={false}
                handleIsUpdated={handleIsUpdated}
              />
            ))}
          </div>
        </>
      )}

      {type === 'saved-posts' && (
        <>
          <span className="pinned-post-main-header">
            <IoBookmark className="profile-post-pin-icon" /> Saved Posts
          </span>
          <div className="profile-posts-saved-section">
            {posts.map((post) => (
              <BlogCard
                key={post._id}
                post={post}
                pinnedType={false}
                savedType={true}
                handleIsUpdated={handleIsUpdated}
              />
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default ProfilePosts;
