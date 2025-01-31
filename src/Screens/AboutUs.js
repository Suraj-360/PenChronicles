import React from "react";
import "../Styles/AboutUs.css";
import Nav from '../Components/Nav.js';

const AboutUs = () => {
    return (
        <div className="about-us-wrapper-container">
            <Nav />
            <div className="about-us-container">
                <header className="about-header">
                    <div className="header-content">
                        <h1>Our Story</h1>
                        <p>Where words meet style. Crafting stories with elegance and depth.</p>
                    </div>
                </header>
                <section className="about-content">
                    <div className="about-section mission">
                        <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1738269668/PenChronicles%20assets/20943892-Photoroom_pspc2i.png" alt="Our Vision" className="about-img" />
                        <div className="text-content">
                            <h2>Our Vision</h2>
                            <p>We believe that every voice matters. Our platform provides a space where creativity, knowledge, and fashion-forward thinking blend to create impactful stories.</p>
                        </div>
                    </div>
                    <div className="about-section team">
                        <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1738269684/PenChronicles%20assets/4669613-Photoroom_fnrrco.png" alt="Our Team" className="about-img" />
                        <div className="text-content">
                            <h2>Who We Are</h2>
                            <p>We are a collective of writers, trendsetters, and industry experts dedicated to delivering inspiring content. Our articles reflect innovation, passion, and authenticity.</p>
                        </div>
                    </div>
                    <div className="about-section join-us">
                        <div className="text-content">
                            <h2>Be a Part of the Movement</h2>
                            <p>Join our stylish revolution. Whether you're a writer, reader, or creative thinker, we welcome you to express yourself and explore the art of storytelling.</p>
                            <button className="join-btn">Join Now</button>
                        </div>
                        <img src="https://res.cloudinary.com/dtq2cn21c/image/upload/v1738269647/PenChronicles%20assets/10776006-Photoroom_ilajax.png" alt="Join Us" className="about-img" />
                    </div>
                </section>
            </div>
        </div>
    );
};

export default AboutUs;
