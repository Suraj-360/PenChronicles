import React, { useState } from 'react';
import { FaWhatsapp, FaFacebookF, FaTwitter, FaCopy } from 'react-icons/fa';
import '../Styles/SharePopUp.css';

function SharePopUp({ show, onClose }) {
    const [copied, setCopied] = useState(false);
    const url = window.location.href;

    if (!show) return null;

    // Function to handle WhatsApp share
    const handleWhatsAppShare = () => {
        const message = "Check this out!";  // Customize your message
        const shareUrl = `https://wa.me/?text=${encodeURIComponent(message)}%20${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    };

    // Function to handle Facebook share
    const handleFacebookShare = () => {
        const shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    };

    // Function to handle X (Twitter) share
    const handleXShare = () => {
        const shareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}`;
        window.open(shareUrl, '_blank');
    };

    const handleCopy = () => {
        navigator.clipboard.writeText(url).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }).catch(err => {
            console.error('Failed to copy: ', err);
        });
    };

    return (
        <div className="super-share-popup-overlay-main-container">
            <div className="share-popup-content">
                <button className="close-button" onClick={onClose}>
                    &times;
                </button>
                <h3>Share this content</h3>

                <div className="share-buttons-container">
                    {/* WhatsApp Share Button */}
                    <button className="share-button whatsapp" onClick={handleWhatsAppShare}>
                        <FaWhatsapp size={30}  className='share-button-social-icon whatsapp' />
                    </button>

                    {/* Facebook Share Button */}
                    <button className="share-button facebook" onClick={handleFacebookShare}>
                        <FaFacebookF size={30} className='share-button-social-icon facebook' />
                    </button>

                    {/* X (Twitter) Share Button */}
                    <button className="share-button twitter" onClick={handleXShare}>
                        <FaTwitter size={30} className='share-button-social-icon twitter' />
                    </button>
                </div>

                {/* URL Text with Copy Button */}
                <div className="url-container">
                    <p>{url}</p>
                    <button className="copy-button" onClick={handleCopy}>
                        {copied ? 'Copied!' : <FaCopy />}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SharePopUp;
