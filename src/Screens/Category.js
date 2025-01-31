import React from 'react';
import '../Styles/Category.css';
import Nav from '../Components/Nav.js';
import { useNavigate } from 'react-router-dom';

function Category() {
    const navigate = useNavigate();
    const categories = [
        { name: "Technology", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738274578/PenChronicles%20assets/modern-education-Skillstork-1568x882_dtgkjs.jpg" },
        { name: "Health", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738274623/PenChronicles%20assets/resize.aspx_awuxrb.jpg" },
        { name: "Education", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738274662/PenChronicles%20assets/Skillstork-1568x882_chm8zb.jpg" },
        { name: "Lifestyle", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275019/PenChronicles%20assets/GettyImages-1648880480-5fae58fc9abe48f8a984afac55e65bc6_mjtwla.jpg" },
        { name: "Sports", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275104/PenChronicles%20assets/steady--not-slow-virat-kohlis-121-ball-101-was-masterclass-in-odi-batting-on-tricky-pitch-courtes-062658268-16x9_0.jpg_lpjiqs.jpg" },
        { name: "Finance", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275161/PenChronicles%20assets/7-very-good-reasons-to-do-master-s-in-finance_bmq6fm.jpg" },
        { name: "Entertainment", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275218/PenChronicles%20assets/entertainment-industry_tag7dh.jpg" },
        { name: "Travel", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275278/PenChronicles%20assets/While-the-past-year-was-about-revenge-and-revival-_1673351689949_asoyjc.jpg" },
        { name: "Food", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275395/PenChronicles%20assets/default-pasta_wglhjt.jpg" },
        { name: "Business", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275399/PenChronicles%20assets/resize.aspx_crikjv.jpg" },
        { name: "Politics", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275477/PenChronicles%20assets/images_kx0cib.jpg" },
        { name: "Environment", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275579/PenChronicles%20assets/images_dw56yo.jpg" },
        { name: "Fashion", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275586/PenChronicles%20assets/640px-Carolina_Herrera_AW14_12_yefeqv.jpg" },
        { name: "Science", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275712/PenChronicles%20assets/images_pfkzol.jpg" },
        { name: "Art", image: "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738275717/PenChronicles%20assets/1_4pWQwWVzJZSQM1dmd67BSw_chmjjx.png" }
    ];

    const handleCategoryClick = (category) => {
        navigate(`/category/${encodeURIComponent(category)}/related-posts`);
    };

    return (
        <div className='categories-wrapper-container'>
            <Nav />
            <div className="categories-container">
                <h1 className="categories-title">Explore Our Categories</h1>
                <p className="categories-subtitle">Discover a variety of topics that inspire and inform.</p>
                <div className="categories-grid">
                    {categories.map((category, index) => (
                        <div key={index} className="category-card" onClick={() => handleCategoryClick(category.name.toLowerCase())}>
                            <div className="category-image">
                                <img src={category.image} alt={category.name} />
                            </div>
                            <h3>{category.name}</h3>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
export default Category;
