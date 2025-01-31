import React from 'react'
import '../Styles/SkeletonLoader.css';

function SkeletonLoader() {
    return (
        <div class="draft-post-list-layout-main-container-skeleton skeleton">
            <div class="skeleton-image"></div>
            <div className='draft-post-content-and-button-container-skeleton'>
                <div class="draft-post-content-container-skeleton">
                    <p class="skeleton-line skeleton-title"></p>
                    <p class="skeleton-line skeleton-description"></p>
                    <p class="skeleton-line skeleton-date"></p>
                </div>
                <div class="draft-edit-button-container-skeleton">
                    <span class="skeleton-button"></span>
                    <span class="skeleton-button"></span>
                </div>
            </div>
        </div>

    )
}

export default SkeletonLoader