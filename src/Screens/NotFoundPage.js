import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../Styles/NotFoundPage.css';  // Importing styles for this page

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoBack = () => {
        navigate(-1);
    };

    return (
        <div className="not-found-container">
            <div className="not-found-content">
                <h1 className="not-found-title">404 - Oops, Page Not Found!</h1>
                <p className="not-found-description">
                    We couldn't find the page you're looking for. But don’t worry, the journey isn’t over! 
                    Let’s get you back on track.
                </p>
                <div className="button-group">
                    <Link to="/" className="back-home-link">Return to PenChronicles</Link>
                    <button onClick={handleGoBack} className="go-back-button">
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;
