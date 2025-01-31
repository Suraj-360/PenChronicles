import React from 'react';
import '../Styles/BlogCardSkeleton.css'; // Reuse existing styles and add skeleton-specific ones.

const BlogCardSkeleton = () => {
  return (
    <div className="post-article-card-container-skeleton post-card-skeleton">
      <div className="post-card-skeleton-thumbnail"></div>
      <div className="post-card-skeleton-pin-icon-container">
        <div className="post-card-skeleton-pin-icon"></div>
      </div>
      <div className="post-card-skeleton-author-and-timestamp">
        <div className="post-card-skeleton-text post-card-skeleton-small"></div>
      </div>
      <div className="post-card-skeleton-title"></div>
      <div className="post-card-skeleton-description"></div>
      <div className="post-card-skeleton-tags">
        <div className="post-card-skeleton-tag"></div>
        <div className="post-card-skeleton-tag"></div>
        <div className="post-card-skeleton-tag"></div>
      </div>
    </div>
  );
};

export default BlogCardSkeleton;
