import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import '../Styles/RelatedPosts.css';
import Nav from './Nav';
import BlogCardSkeleton from './BlogCardSkeleton';
import PostsListWithPagination from './PostsListWithPagination';
import PostsNotAvailable from './PostsNotAvailable';
import Footer from '../Components/Footer.js';

function RelatedPosts({ type, apiEndpoint, queryParam }) {
    const params = useParams();
    const queryValue = params[queryParam];
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchPosts = async () => {
            try {
                setLoading(true);
                setError(null);

                let response;
                if (apiEndpoint === "get-trending-posts") {
                    // For popular posts, a GET request without body
                    response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/${apiEndpoint}`, {
                        method: "GET",
                        headers: {
                            "Content-Type": "application/json",
                        },
                    });
                } else {
                    // For others, send a POST request with queryParam
                    response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/${apiEndpoint}`, {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ [queryParam]: queryValue }), // Dynamic request body
                    });
                }

                if (!response.ok) {
                    throw new Error('Failed to fetch posts');
                }

                const data = await response.json();
                setPosts(data.posts || []);

            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, [queryValue, apiEndpoint]);

    return (
        <div className="related-posts-container-wrapper">
            <Nav isBell={true} />
            <div className="related-posts-header">
                <span className='related-posts-heading'>
                    {apiEndpoint === "get-trending-posts" ? "# Popular Posts" : `# Posts related to: ${queryValue}`}
                </span>
                {loading ? (
                    <div className="related-post-loading-main-container">
                        {Array.from({ length: 12 }).map((_, i) => (
                            <BlogCardSkeleton key={i} />
                        ))}
                    </div>
                ) : error ? (
                    <p className="error">{error}</p>
                ) : posts.length > 0 ? (
                    <PostsListWithPagination posts={posts} />
                ) : (
                    <PostsNotAvailable />
                )}
            </div>
            <Footer />
        </div>
    );
}

export default RelatedPosts;
