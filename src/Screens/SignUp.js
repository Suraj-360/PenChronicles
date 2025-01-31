import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/SignUp.css'
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useTheme } from '../Components/ThemeContext'
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function Signup() {

    const [signUpData, setSignUpData] = useState({
        username: "",
        email: "",
        password: "",
        confirmPassword: ""
    });

    const signupimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294692/PenChronicles%20assets/signup_glisvx.png"
    const laptopimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294756/PenChronicles%20assets/laptop_xfqryp.png"
    const googleimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294735/PenChronicles%20assets/google_lopok0.png"
    const facebookimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294720/PenChronicles%20assets/facebook_jfxmei.png"

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const { isDarkMode, toggleDarkMode } = useTheme();
    const navigate = useNavigate();


    const onChangeHandler = (event) => {
        setSignUpData({
            ...signUpData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        // Mock validation or server error handling
        if (!signUpData.username || !signUpData.email || !signUpData.password || !signUpData.confirmPassword) {
            setError("Both email and password are required.");
            return;
        }

        if (signUpData.password !== signUpData.confirmPassword) {
            setError("Password and Confirm Password not matched!!");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(signUpData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/create-account/`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(signUpData)
        });

        const json = await response.json();
        setError(json.message);
        if (response.status === 200) {
            toast("Please verify your email to create account", {
                position: "top-center",
                autoClose: 3000,
                className: "custom-toast"
            });
            navigate("/signin")
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    }

    const handleShowConfirmPassword = () => {
        setShowConfirmPassword((prev) => !prev);
    }

    const handleSignInNavigate = () => {
        navigate("/signin")
    }

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className='signup-main-container'>
            {(isDarkMode) ? <button className='toggle-theme-sign-up-page' onClick={toggleDarkMode}>Light Mode <MdOutlineDarkMode className='svg-icon-toggle-sign-up-page' /></button> : <button className='toggle-theme-sign-up-page' onClick={toggleDarkMode}>Dark Mode <MdDarkMode className='svg-icon-toggle-sign-in-page dark-mode-gold' /></button>}
            <div className='signup-left-container'>
                <img src={signupimg} className='signup-girl-image'></img>
                <img src={laptopimg} className='signup-laptop-image'></img>
            </div>
            <div className='signup-right-container'>
                <h1>PenChronicles</h1>
                <div className="form-container">
                    <span className='create-account'>Sign-Up Account</span>
                    <div className='signup-with-other-container'>
                        <button className='google-btn-signup'>
                            <img src={googleimg}></img>
                            Sign in with Google
                        </button>
                        <button className='facebook-btn-signup'>
                            <img src={facebookimg}></img>
                            Sign in with Facebook
                        </button>
                    </div>
                    <span className='optional-text'>-OR-</span>
                    {/* Error Message */}
                    {error && <p className="error-message">{error}</p>}

                    <form className="sign-in-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <MdOutlineMailOutline className='signup-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type="text"
                                id='username'
                                name='username'
                                value={signUpData.username}
                                onChange={onChangeHandler}
                                placeholder="Name"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <MdOutlineMailOutline className='signup-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type="email"
                                id='email'
                                name='email'
                                value={signUpData.email}
                                onChange={onChangeHandler}
                                placeholder="Email"
                                className="form-input"
                            />
                        </div>

                        <div className="input-group">
                            <IoLockClosed className='signup-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type={(showPassword) ? "text" : "password"}
                                id='password'
                                name='password'
                                value={signUpData.password}
                                onChange={onChangeHandler}
                                placeholder="Password"
                                className="form-input"
                            />
                            {(showPassword) ? <IoEyeOff className='password-show-eye-icon' onClick={handleShowPassword} /> : <IoEye className='password-show-eye-icon' onClick={handleShowPassword} />}
                        </div>

                        <div className="input-group">
                            <IoLockClosed className='signup-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type={(showConfirmPassword) ? "text" : "password"}
                                id='confirmPassword'
                                name='confirmPassword'
                                value={signUpData.confirmPassword}
                                onChange={onChangeHandler}
                                placeholder="Comfirm Password"
                                className="form-input"
                            />
                            {(showConfirmPassword) ? <IoEyeOff className='password-show-eye-icon' onClick={handleShowConfirmPassword} /> : <IoEye className='password-show-eye-icon' onClick={handleShowConfirmPassword} />}
                        </div>
                        <button type="submit" className="submit-button">
                            Sign Up
                        </button>
                        <div className="input-group dont-have-account"> Already have account? <span onClick={handleSignInNavigate}>Sign-In</span></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default Signup;