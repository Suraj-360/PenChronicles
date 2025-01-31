import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import '../Styles/PostEditorPosts.css';
import PostsListLayout from './PostsListLayout';
import SkeletonLoader from './SkeletonLoader';

function PostEditorPosts({ posttype, openDrawerWithPost }) {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [resendData, setResendData] = useState(false);
  const navigate = useNavigate();

  const handleResendData = () => {
    setResendData((prev => !prev));
  }

  const images = {
    recent: 'https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/recent_wilgsa.png',
    published: 'https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/published_snomxz.png',
    draft: 'https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/draft_dik1d4.png',
    trash: 'https://res.cloudinary.com/dtq2cn21c/image/upload/v1736105540/PenChronicles%20assets/trash_h9raee.png',
  };

  const altText = `No ${posttype} posts`;
  const url = `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-${posttype}-post/`;

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      toast.error('Please login to continue', {
        position: 'top-center',
        autoClose: 3000,
        className: 'custom-toast',
      });
      navigate('/signin');
      return;
    }

    const fetchPosts = async () => {
      setLoading(true);
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          throw new Error('Failed to fetch posts');
        }

        const data = await response.json();
        setPosts(data.posts);
        console.log(posts);
      } catch (error) {
        console.error(error.message);
        toast.error('Error fetching posts', {
          position: 'top-center',
          autoClose: 3000,
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [url, resendData]);

  if (loading) {
    return (
      <div className='post-editor-posts-loader-main-container'>
        <div className='post-editor-posts-loader-main-header-container post-editor-header-skeleton'>
          <span className='post-editor-posts-loader-main-header-skeleton'></span>
        </div>
        {Array.from({ length: 7 }).map((_, i) => (
          <SkeletonLoader key={i} />
        ))}
      </div>
    );
  }

  return posts.length === 0 ? (
    <div className='post-editor-posts-main-container-empty'>
      <img src={images[posttype]} alt={altText} />
      <span>{altText}</span>
    </div>
  ) : (
    <div className='post-editor-posts-main-container'>
      <div className='post-editor-posts-header-container'>
        <span className='post-editor-posts-header'>{`# ${posttype.charAt(0).toUpperCase() + posttype.slice(1)} Posts`}</span>
      </div>
      <div className='post-editor-posts-content'>
        {posts.map((post, index) => (
          <PostsListLayout
            imgURL={post.thumbnail ? post.thumbnail :
              'https://res.cloudinary.com/dtq2cn21c/image/upload/v1735933286/PenChronicles%20assets/39603461-removebg-preview_gatlsh.png'
            }
            key={post._id}
            id={post._id}
            title={post.title}
            description={post.description}
            category={post.category}
            tags={post.tags}
            sections={post.sections}
            createdAt={post.createdAt}
            type={posttype}
            openDrawerWithPost={openDrawerWithPost}
            handleResendData={handleResendData}
          />
        ))}
      </div>
    </div>
  );
}

export default PostEditorPosts;
