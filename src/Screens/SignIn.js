import React, { useState ,useEffect} from 'react'
import { useNavigate } from 'react-router-dom'
import '../Styles/SignIn.css'
import { MdOutlineMailOutline } from "react-icons/md";
import { IoLockClosed } from "react-icons/io5";
import { IoEye } from "react-icons/io5";
import { IoEyeOff } from "react-icons/io5";
import { useTheme } from '../Components/ThemeContext'
import { MdOutlineDarkMode } from "react-icons/md";
import { MdDarkMode } from "react-icons/md";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function SignIn() {

    const [signInData, setSignInData] = useState({
        email:"",
        password:""
    })

    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const { isDarkMode, toggleDarkMode} = useTheme();
    const navigate = useNavigate();

    const signinimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294672/PenChronicles%20assets/signin_twzy6t.png"
    const laptopimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294756/PenChronicles%20assets/laptop_xfqryp.png"
    const googleimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294735/PenChronicles%20assets/google_lopok0.png"
    const facebookimg = "https://res.cloudinary.com/dtq2cn21c/image/upload/v1738294720/PenChronicles%20assets/facebook_jfxmei.png"

    const onChangeHandler = (event) => {
        setSignInData({
            ...signInData,
            [event.target.name]: event.target.value
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");

        // Mock validation or server error handling
        if (!signInData.email || !signInData.password) {
            setError("Both email and password are required.");
            return;
        }

        if (!/\S+@\S+\.\S+/.test(signInData.email)) {
            setError("Please enter a valid email address.");
            return;
        }

        try {
            //setIsLoading(true);
            
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/signin-account/`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(signInData)
            });

            const json = await response.json();

            if (response.status === 200) {
                const { token, userId, expiresIn } = json;

                if (!token || !userId || !expiresIn) {
                    setError('Invalid response from server');
                    return;
                }

                const expirationTime = new Date().getTime() + expiresIn * 1000;

                localStorage.setItem("token", token);
                localStorage.setItem("userId", userId);
                localStorage.setItem("tokenExpiration", expirationTime);
                toast("Login successful!", {
                    position: "top-center", // Center the toast horizontally at the top
                    autoClose: 3000, // Auto close after 3 seconds
                    className: "custom-toast" // Add custom class for styling
                });
                
                navigate('/');
            } else {
                setError(json.message || 'Login failed');
                //setIsLoading(false);
            }
        } catch (error) {
            setError('An error occurred. Please try again.');
            //setIsLoading(false);
        }
    };

    const handleShowPassword = () => {
        setShowPassword((prev) => !prev);
    }

    const handleSignUpNavigate = ()=>{
        navigate("/signup")
    }

    useEffect(() => {
        document.body.classList.toggle('dark-mode', isDarkMode);
    }, [isDarkMode]);

    return (
        <div className='signin-main-container'>
            {(isDarkMode) ? <button className='toggle-theme-sign-in-page' onClick={toggleDarkMode}>Light Mode <MdOutlineDarkMode className='svg-icon-toggle-sign-in-page' /></button> : <button className='toggle-theme-sign-in-page' onClick={toggleDarkMode}>Dark Mode <MdDarkMode className='svg-icon-toggle-sign-in-page dark-mode-gold' /></button>}
            <div className='signin-left-container'>
                <img src={signinimg} className='signin-girl-image'></img>
                <img src={laptopimg} className='signin-laptop-image'></img>
            </div>

            <div className='signin-right-container'>
                <h1>PenChronicles</h1>
                <div className="form-container">
                    <span className='create-account'>Sign-In Account</span>
                    <div className='signup-with-other-container'>
                        <button className='google-btn-signin'>
                            <img src={googleimg}></img>
                            Sign in with Google
                        </button>
                        <button className='facebook-btn-signin'>
                            <img src={facebookimg}></img>
                            Sign in with Facebook
                        </button>
                    </div>
                    <span className='optional-text'>-OR-</span>
                    {/* Error Message */}
                    {error && <p className="error-message">{error}</p>}

                    <form className="sign-in-form" onSubmit={handleSubmit}>
                        <div className="input-group">
                            <MdOutlineMailOutline className='signin-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type="email"
                                name="email"
                                placeholder="Email"
                                className="form-input"
                                value={signInData.email}
                                onChange={onChangeHandler}
                            />
                        </div>

                        <div className="input-group">
                            <IoLockClosed className='signin-input-icon' />
                            <span className='required'>*</span>
                            <input
                                type={(showPassword) ? "text" : "password"}
                                name="password"
                                placeholder="Password"
                                className="form-input"
                                value={signInData.password}
                                onChange={onChangeHandler}
                            />
                            {(showPassword) ? <IoEyeOff className='password-show-eye-icon' onClick={handleShowPassword} /> : <IoEye className='password-show-eye-icon' onClick={handleShowPassword} />}
                        </div>
                        <span className="input-group forgot-password">Forgot Password</span>
                        <button type="submit" className="submit-button">
                            Sign In
                        </button>
                        <div className="input-group dont-have-account"> Don't have account? <span onClick={handleSignUpNavigate}>Sign-Up</span></div>
                    </form>
                </div>
            </div>
        </div>
    )
}

export default SignIn