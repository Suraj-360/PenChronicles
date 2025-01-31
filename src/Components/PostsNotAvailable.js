import React from 'react'
import '../Styles/PostsNotAvailable.css'

function PostsNotAvailable() {
    return (
        <div className="posts-not-available-container">
            <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1736453697/PenChronicles%20assets/no-post-available_uzttqe.png"
                className='post-not-available-image'
            />
            <span className='post-not-available-text'>Posts not available</span>
        </div>
    )
}

export default PostsNotAvailable
