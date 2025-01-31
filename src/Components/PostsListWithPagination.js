import React, { useEffect, useState } from 'react';
import '../Styles/PostsListWithPagination.css';
import BlogCard from '../Components/BlogCard';
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";

function PostsListWithPagination({ posts }) {
    const blogsPerPage = 8;
    const [currentBlogs, setCurrentBlogs] = useState([]);
    const [totalPages, setTotalPages] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);

    const handlePageChange = (pageNumber) => {
        setCurrentPage(pageNumber);
        const indexOfLastBlog = pageNumber * blogsPerPage;
        const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
        setCurrentBlogs(posts.slice(indexOfFirstBlog, indexOfLastBlog)); // Set posts for the current page
    };

    useEffect(() => {
        setTotalPages(Math.ceil(posts.length / blogsPerPage));
        setCurrentBlogs(posts.slice(0, blogsPerPage)); // Display first 8 posts
    }, [posts])


    return (
        <div className='tag-related-post-primary-main-container'>
            <div className="tag-related-posts-main-container">
                {currentBlogs.map((post, index) => (
                    <BlogCard
                        key={index}
                        post={post}
                        pinnedType={false}
                        handleIsUpdated={() => { }}
                    />
                ))}
            </div>

            <div className="pagination-controls">
                <div className="pagination-number-buttons">
                    {Array.from({ length: totalPages }, (_, i) => {
                        const pageNumber = i + 1;
                        if (
                            pageNumber === 1 || // Always show the first page
                            pageNumber === totalPages || // Always show the last page
                            (pageNumber >= currentPage - 2 && pageNumber <= currentPage + 2) // Show nearby pages
                        ) {
                            return (
                                <button
                                    key={pageNumber}
                                    className={currentPage === pageNumber ? 'active-page' : ''}
                                    onClick={() => handlePageChange(pageNumber)}
                                >
                                    {pageNumber}
                                </button>
                            );
                        } else if (
                            (pageNumber === currentPage - 3 && pageNumber !== 2) || // Add "..." before current range
                            (pageNumber === currentPage + 3 && pageNumber !== totalPages - 1) // Add "..." after current range
                        ) {
                            return <span key={pageNumber} className='pagination-dots'>...</span>;
                        }
                        return null;
                    })}
                </div>

                <div className="pagination-action-buttons">
                    <button
                        disabled={currentPage === 1}
                        onClick={() => handlePageChange(currentPage - 1)}
                    >
                        <FaArrowLeft /> Previous
                    </button>
                    <button
                        disabled={currentPage === totalPages}
                        onClick={() => handlePageChange(currentPage + 1)}
                    >
                        Next <FaArrowRight />
                    </button>
                </div>
            </div>
        </div>
    )
}

export default PostsListWithPagination