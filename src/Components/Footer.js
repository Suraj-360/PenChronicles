import React from "react";
import "../Styles/Footer.css"; // External CSS for styling
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin } from "react-icons/fa";

function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                {/* About PenChronicles */}
                <div className="footer-section about">
                    <h2 className="footer-logo">PenChronicles</h2>
                    <p>
                        Dive into a world of words. PenChronicles is your go-to destination for insightful blogs, inspiring articles, and stories that connect hearts and minds.
                    </p>
                </div>

                {/* Explore Section */}
                <div className="footer-section links">
                    <h3>Explore</h3>
                    <ul>
                        <li><a href="/about">About Us</a></li>
                        <li><a href="/categories">Categories</a></li>
                        <li><a href="/popular-posts">Popular Posts</a></li>
                        <li><a href="#">Contact Us</a></li>
                    </ul>
                </div>

                {/* Stay Connected */}
                <div className="footer-section contact">
                    <h3>Stay Connected</h3>
                    <p>Email: hello@penchronicles.com</p>
                    <p>Phone: +123 456 7890</p>
                </div>

                {/* Social Media */}
                <div className="footer-section social">
                    <h3>Follow Us</h3>
                    <div className="social-icons">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer"><FaFacebook /></a>
                        <a href="https://twitter.com" target="_blank" rel="noopener noreferrer"><FaTwitter /></a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer"><FaInstagram /></a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer"><FaLinkedin /></a>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} PenChronicles. Crafting stories, inspiring minds.</p>
            </div>
        </footer>
    );
};

export default Footer;
