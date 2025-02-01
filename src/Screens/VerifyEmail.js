import React from 'react';
import { useNavigate, useSearchParams } from "react-router-dom";
import '../Styles/VerifyEmail.css';

const VerifyEmail = () => {
    const [searchParams] = useSearchParams();
    const status = searchParams.get("status");
    const navigate = useNavigate();

    const handlePageNotFound = () => {
        navigate("/404");  // Redirect to a 404 page if no status parameter
    };

    const renderMessage = () => {
        if (!status) {  // Check if the status is missing
            handlePageNotFound();
            return null;  // Don't render anything after redirect
        }

        switch(status) {
            case "success":
                return <h2>Email Verified Successfully ✅</h2>;
            case "already-verified":
                return <h2>Email Already Verified 🔄</h2>;
            case "invalid":
                return <h2>Invalid or Expired Token ❌</h2>;
            default:
                handlePageNotFound();
                return null;
        }
    };

    return (
        <div className="verify-email-container">
            {renderMessage()}
        </div>
    );
};

export default VerifyEmail;
