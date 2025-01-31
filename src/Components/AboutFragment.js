import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import '../Styles/AboutFragment.css'
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { MdEditDocument } from "react-icons/md";
import { MdSave } from "react-icons/md";
import { MdCancel } from "react-icons/md";
import { FaPenNib } from "react-icons/fa";
import PopUpOverlay from "./PopUpOverlay";

function AboutFragment() {
    const [loading, setLoading] = useState(false);
    const [aboutAuthor, setAboutAuthor] = useState("");
    const [editAboutAuthorContent, setEditAboutAuthorContent] = useState("");
    const [showConfirmModal, setShowConfirmModal] = useState(false);
    const [popupAction, setPopupAction] = useState(null);
    const [isEditedMode, setIsEditedMode] = useState(false);
    const { userID } = useParams();
    const types = ["long", "middle", "short", "very-short"];
    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    useEffect(() => {
        const fetchAboutAuthor = async () => {
            try {
                setLoading(true)
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_URL}/app/v1/get-about-author`,
                    {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({ user_Id: userID }),
                    }
                );
                if (response.status !== 200) {
                }
                const data = await response.json();
                setAboutAuthor(data.aboutAuthor)
                setEditAboutAuthorContent(data.aboutAuthor);
            } catch (err) {
                console.log(err.message)
            } finally {
                setLoading(false)
            }
        };

        fetchAboutAuthor();
    }, [userID]);

    const updateAboutAuthor = async () => {
        const token = localStorage.getItem("token");
        if (!token) {
            return;
        }
        try {
            setLoading(true)
            const response = await fetch(
                `${process.env.REACT_APP_BACKEND_URL}/app/v1/update-about-author`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify({ about: editAboutAuthorContent }),
                }
            );
            const data = await response.json();
            setAboutAuthor(data.aboutAuthor);
            setEditAboutAuthorContent(data.aboutAuthor);
        } catch (err) {
            console.log(err.message)
        } finally {
            setIsEditedMode(false);
            setShowConfirmModal(false);
            setPopupAction(null)
            setLoading(false)
        }
    }

    const handleEditAboutAuthor = () => {
        setIsEditedMode((prev) => !prev)
    }

    const handleSaveOrCancel = () => {
        setShowConfirmModal(true);
        setPopupAction("save")
    }

    const confirmSave = async () => {
        await updateAboutAuthor();
        setShowConfirmModal(false);
        setPopupAction(null)
        setIsEditedMode(false);
    };

    const cancelSave = () => {
        setShowConfirmModal(false);
        setPopupAction(null)
        setIsEditedMode(false);
    };

    return (
        (loading) ?
            <div className="about-author-fragment-loader-main-container skeleton">
                <div class="about-author-header-container-skeleton">
                    <span class="skeleton-about-text"></span>
                    <span class="skeleton-button"></span>
                </div>
                <div className="about-author-content-container-skeleton">
                    {Array.from({ length: 36 }).map((_, index) => {
                        const randomType = types[Math.floor(Math.random() * types.length)];
                        return <p key={index} className={`skeleton-line para-text ${randomType}`}></p>;
                    })}
                </div>

            </div> :
            <div className="about-author-fragment-main-container">
                {localStorage.getItem("token") && localStorage.getItem("userId") === userID ? (
                    isEditedMode ? (
                        // Edit Mode
                        <div className="about-author-content-edit-container">
                            <div className="about-author-buttons-container">
                                <span className="about-author-text">
                                    # About author <FaPenNib className="about-author-text-icon" />
                                </span>
                                <div className="about-author-buttons-container">
                                    <span className="about-author-button" onClick={handleEditAboutAuthor}>
                                        <MdCancel className="about-author-button-icon" /> Cancel
                                    </span>
                                    <span className="about-author-button" onClick={handleSaveOrCancel}>
                                        <MdSave className="about-author-button-icon" /> Save it
                                    </span>
                                </div>
                            </div>
                            <ReactQuill
                                theme="snow"
                                value={editAboutAuthorContent}
                                onChange={(value) => setEditAboutAuthorContent(value)}
                                modules={modules}
                                placeholder="Write section content here..."
                            />
                        </div>
                    ) : (
                        // View Mode (User can Edit)
                        <>
                            <div className="about-author-buttons-container">
                                <span className="about-author-text">
                                    # About author <FaPenNib className="about-author-text-icon" />
                                </span>
                                <span className="about-author-button" onClick={handleEditAboutAuthor}>
                                    <MdEditDocument className="about-author-button-icon" /> Edit about
                                </span>
                            </div>
                            <div className="about-author-content-container">
                                <span className="about-author-content" dangerouslySetInnerHTML={{ __html: aboutAuthor }}></span>
                            </div>
                        </>
                    )
                ) : (
                    // View Mode (For Other Users)
                    <>
                        <span className="about-author-text">
                            # About author <FaPenNib className="about-author-text-icon" />
                        </span>
                        <div className="about-author-content-container">
                            <span className="about-author-content" dangerouslySetInnerHTML={{ __html: aboutAuthor }}></span>
                        </div>
                    </>
                )}
                {showConfirmModal && <PopUpOverlay popupAction={popupAction} confirmAction={confirmSave} cancelAction={cancelSave} />}
            </div>
    )
}

export default AboutFragment