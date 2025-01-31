import React, { useState } from "react";
import "../Styles/SearchSection.css";
import { FaSearch } from "react-icons/fa";
import BlogCard from "./BlogCard";
import AuthorCard from "./AuthorCard";
import { FaArrowLeft } from "react-icons/fa6";
import { FaArrowRight } from "react-icons/fa6";
import { MdClear } from "react-icons/md";
import BlogCardSkeleton from "./BlogCardSkeleton";

const SearchSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [posts, setPosts] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const blogsPerPage = 8;
  const authorPerPage = 8;

  const [currentPage, setCurrentPage] = useState(1);
  const [currentAuthorPage, setCurrentAuthorPage] = useState(1);

  const [currentBlogs, setCurrentBlogs] = useState([]);
  const [currentAuthors, setCurrentAuthors] = useState([]);

  const [totalPages, setTotalPages] = useState(0);
  const [totalAuthorPages, setTotalAuthorPages] = useState(0);

  const [searchContent, setSearchContent] = useState("Posts");
  const [clearSearchSeaction, setClearSearchSeaction] = useState(true);
  const colors = ["#C58E21", "#72428A", "#FFD35A", "#CA2242", "#2790DC", "#6E8E59", "#E73879", "#E88D67"];

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    const indexOfLastBlog = pageNumber * blogsPerPage;
    const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
    setCurrentBlogs(posts.slice(indexOfFirstBlog, indexOfLastBlog));
  };

  const handleAuthorsPageChange = (pageNumber) => {
    setCurrentAuthorPage(pageNumber);
    const indexOfLastAuthor = pageNumber * authorPerPage;
    const indexOfFirstAuthor = indexOfLastAuthor - authorPerPage;
    setCurrentAuthors(users.slice(indexOfFirstAuthor, indexOfLastAuthor));
  };

  const handleSearch = async () => {
    try {
      setLoading(true); // Start loading
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/search`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ query: searchQuery }), // sending query in the body
      });

      if (!response.ok) {
        throw new Error("Failed to fetch posts");
      }

      const data = await response.json();
      setPosts(data.posts);
      setUsers(data.users);

      const totalPosts = data.posts;
      const totalAuthors = data.users;
      setTotalPages(Math.ceil(totalPosts.length / blogsPerPage));
      setTotalAuthorPages(Math.ceil(totalAuthors.length / authorPerPage));

      setCurrentBlogs(totalPosts.slice(0, blogsPerPage)); // Display first 8 posts
      setCurrentAuthors(totalAuthors.slice(0, authorPerPage));

      setClearSearchSeaction(false);
      setLoading(false); // Stop loading
    } catch (error) {
      console.error("Error during API call:", error);
      setLoading(false); // Stop loading on error
    }
  };

  const handleClear = () => {
    setClearSearchSeaction(true);
    setSearchQuery("");
    setPosts([]); // Clear posts when clear is clicked
    setUsers([]);
  };

  return (
    <div className="search-section-main-container">
      <div className="search-section">
        <h2 className="search-title">Find What You Love</h2>
        <div className="search-bar">
          <FaSearch className="search-icon" />
          <input
            type="text"
            placeholder="Search here..."
            className="search-input"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-button" onClick={handleSearch}>
            Search
          </button>
        </div>
      </div>

      {/* Display loading indicator */}
      {loading ? (
        <div className="search-data-section-loading-main-container">
          {Array.from({ length: 8 }).map((_, i) => (
            <BlogCardSkeleton key={i} />
          ))}
        </div>
      ) : (
        <>
          {(!clearSearchSeaction) && (
            <div className="search-data-section">
              <div className="search-clear-button-main-container">
                <span className="search-clear-button-main-container-header">
                  # Search result <FaSearch className="search-clear-button-main-container-header-icon" />
                </span>
                <span className='search-clear-button-container' onClick={handleClear}>
                  <MdClear className='search-clear-button-icon' />
                  <span className='search-clear-button-text'>Clear Search</span>
                </span>
              </div>
              <div className="search-data-section-nav-option">
                <span className={searchContent === "Posts" ? "active" : ""} onClick={() => setSearchContent("Posts")}>
                  Posts
                </span>
                <span className={searchContent === "Authors" ? "active" : ""} onClick={() => setSearchContent("Authors")}>
                  Authors
                </span>
              </div>

              {(() => {
                switch (searchContent) {
                  case "Posts":
                    return (
                      <>
                        {(posts.length > 0) ? (
                          <div className="search-data-section-outer">
                            <div className="search-data-section-inner">
                              {currentBlogs.map((post) => (
                                <BlogCard
                                  key={post._id}
                                  post={post}
                                  pinnedType={false}
                                  handleIsUpdated={() => { }}
                                />
                              ))}
                            </div>

                            {/* Pagination Controls */}
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
                        ) : (
                          <div>No Posts</div>
                        )}
                      </>
                    );
                  case "Authors":
                    return (
                      <>
                        {(users.length > 0) ? (
                          <div className="search-data-section-outer">
                            <div className="search-data-section-inner">
                              {currentAuthors.map((user, index) => (
                                <AuthorCard
                                  key={user._id}
                                  author={user}
                                  color={colors[index % colors.length]}
                                />
                              ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="pagination-controls">
                              <div className="pagination-number-buttons">
                                {Array.from({ length: totalAuthorPages }, (_, i) => {
                                  const pageNumber = i + 1;
                                  if (
                                    pageNumber === 1 || // Always show the first page
                                    pageNumber === totalAuthorPages || // Always show the last page
                                    (pageNumber >= currentAuthorPage - 2 && pageNumber <= currentAuthorPage + 2) // Show nearby pages
                                  ) {
                                    return (
                                      <button
                                        key={pageNumber}
                                        className={currentAuthorPage === pageNumber ? 'active-page' : ''}
                                        onClick={() => handleAuthorsPageChange(pageNumber)}
                                      >
                                        {pageNumber}
                                      </button>
                                    );
                                  } else if (
                                    (pageNumber === currentAuthorPage - 3 && pageNumber !== 2) || // Add "..." before current range
                                    (pageNumber === currentAuthorPage + 3 && pageNumber !== totalAuthorPages - 1) // Add "..." after current range
                                  ) {
                                    return <span key={pageNumber} className='pagination-dots'>...</span>;
                                  }
                                  return null;
                                })}
                              </div>

                              <div className="pagination-action-buttons">
                                <button
                                  disabled={currentAuthorPage === 1}
                                  onClick={() => handleAuthorsPageChange(currentAuthorPage - 1)}
                                >
                                  <FaArrowLeft /> Previous
                                </button>
                                <button
                                  disabled={currentAuthorPage === totalAuthorPages}
                                  onClick={() => handleAuthorsPageChange(currentAuthorPage + 1)}
                                >
                                  Next <FaArrowRight />
                                </button>
                              </div>
                            </div>
                          </div>
                        ) : (
                          <div>No author</div>
                        )}
                      </>
                    );
                  default:
                    return (
                      <>
                        {(posts.length > 0) ? (
                          <div className="search-data-section-outer">
                            <div className="search-data-section-inner">
                              {currentBlogs.map((post) => (
                                <BlogCard
                                  key={post._id}
                                  post={post}
                                  pinnedType={false}
                                  handleIsUpdated={() => { }}
                                />
                              ))}
                            </div>

                            {/* Pagination Controls */}
                            <div className="pagination-controls">
                              <button
                                disabled={currentPage === 1}
                                onClick={() => handlePageChange(currentPage - 1)}
                              >
                                <FaArrowLeft /> Previous
                              </button>
                              <div className="pagination-number-buttons">
                                {Array.from({ length: totalPages }, (_, i) => (
                                  <button
                                    key={i + 1}
                                    className={currentPage === i + 1 ? 'active-page' : ''}
                                    onClick={() => handlePageChange(i + 1)}
                                  >
                                    {i + 1}
                                  </button>
                                ))}
                              </div>
                              <button
                                disabled={currentPage === totalPages}
                                onClick={() => handlePageChange(currentPage + 1)}
                              >
                                Next <FaArrowRight />
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div>No Posts</div>
                        )}
                      </>
                    );
                }
              })()}
            </div>
          )}
          {(!clearSearchSeaction) && <span className='horizontal-ruler-search-section'></span>}
        </>
      )}
    </div>
  );
};

export default SearchSection;

