import React, { useState, useEffect } from 'react';
import '../Styles/Posts.css';
import Nav from '../Components/Nav';
import SearchSection from '../Components/SearchSection';
import { GiToggles } from "react-icons/gi";
import FilterPopup from '../Components/FilterPopup';
import BlogCardSkeleton from '../Components/BlogCardSkeleton.js';
import Footer from '../Components/Footer.js';
import PostsListWithPagination from '../Components/PostsListWithPagination.js';
import PostsNotAvailable from '../Components/PostsNotAvailable.js';

function Posts() {
    const [isFilterPopupOpen, setIsFilterPopupOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [filteredPosts, setFilteredPosts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const blogsPerPage = 8;
    const [filters, setFilters] = useState({ sortBy: "", categories: [], startDate: "", endDate: "" });

    const openFilterPopup = () => setIsFilterPopupOpen(true);
    const closeFilterPopup = () => setIsFilterPopupOpen(false);

    const applyFilters = (selectedFilters) => {
        setFilters(selectedFilters);

        setFilteredPosts(() => {
            let updatedPosts = [...posts];

            // Apply category filter
            if (selectedFilters.categories.length > 0) {
                updatedPosts = updatedPosts.filter(post =>
                    selectedFilters.categories.includes(post.category.toLowerCase())
                );
            }

            // Apply date range filter
            if (selectedFilters.startDate) {
                updatedPosts = updatedPosts.filter(post =>
                    new Date(post.createdAt) >= new Date(selectedFilters.startDate)
                );
            }

            if (selectedFilters.endDate) {
                updatedPosts = updatedPosts.filter(post =>
                    new Date(post.createdAt) <= new Date(selectedFilters.endDate)
                );
            }

            // Apply sorting
            if (selectedFilters.sortBy) {
                const sortMethods = {
                    latest: (a, b) => new Date(b.createdAt) - new Date(a.createdAt),
                    oldest: (a, b) => new Date(a.createdAt) - new Date(b.createdAt),
                    "most-popular": (a, b) => (b.views === a.views ? b.likesCount - a.likesCount : b.views - a.views),
                    "highest-rated": (a, b) => b.rating - a.rating
                };

                updatedPosts.sort(sortMethods[selectedFilters.sortBy]);
            }

            return updatedPosts;
        });

        setCurrentPage(1);
    };

    useEffect(() => {
        document.body.style.overflow = isFilterPopupOpen ? 'hidden' : '';

        return () => { document.body.style.overflow = ''; };
    }, [isFilterPopupOpen]);

    useEffect(() => {
        const fetchPosts = async () => {
            setLoading(true);
            try {
                const token = localStorage.getItem("token");
                const endpoint = `${process.env.REACT_APP_BACKEND_URL}/app/v1/${token ? "personalized-feed-post" : "public-feed-post"}`;
                const config = token ? { headers: { Authorization: `Bearer ${token}` } } : {};

                const response = await fetch(endpoint, config);
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);

                const data = await response.json();
                setPosts(data.feed);
                setFilteredPosts(data.feed);
            } catch (error) {
                console.error("Error fetching posts:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchPosts();
    }, []);

    return (
        <div className='posts-main-container-wrapper'>
            <Nav isBell={true} />
            <SearchSection />
            <div className='posts-feed-setting-button' onClick={openFilterPopup}>
                <span className='filter-button-container'>
                    <GiToggles className='posts-feed-setting-button-icon' />
                    <span className='filter-button-text'>Filter</span>
                </span>
            </div>

            {loading ? (
                <div className="feed-blogs-loading-main-container">
                    {Array.from({ length: blogsPerPage }).map((_, i) => <BlogCardSkeleton key={i} />)}
                </div>
            ) : (
                <div className='posts-header'>
                    {filteredPosts.length > 0 ? <PostsListWithPagination posts={filteredPosts} /> : <PostsNotAvailable />}
                </div>
            )}

            {isFilterPopupOpen && <FilterPopup onClose={closeFilterPopup} applyFilters={applyFilters} />}
            <Footer />
        </div>
    );
}

export default Posts;