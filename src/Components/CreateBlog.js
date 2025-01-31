import React, { useState, useEffect, useRef } from "react";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import '../Styles/CreatePost.css'
import { MdDelete } from "react-icons/md";
import { MdOutlineDataSaverOff } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { MdPreview } from "react-icons/md";
import { AiFillSave } from "react-icons/ai";
import { MdPublish } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { MdCancel } from "react-icons/md";

function CreateBlog({ draftPost }) {
    const [postId, setPostId] = useState(null);
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [thumbnail, setThumbnail] = useState(null);
    const [tags, setTags] = useState("");
    const [category, setCategory] = useState("");
    const [content, setContent] = useState("");
    const [sections, setSections] = useState([]);
    const [isPreviewOpen, setIsPreviewOpen] = useState(false);
    const [autoSaveStatus, setAutoSaveStatus] = useState("idle");
    const [errorMessage, setErrorMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const prevState = useRef({
        title: "",
        description:"",
        content: "",
        sections: []
    });

    const categories = [
        "Technology",
        "Health",
        "Education",
        "Lifestyle",
        "Sports",
        "Finance",
        "Entertainment",
        "Travel",
        "Food",
        "Business",
        "Politics",
        "Environment",
        "Fashion",
        "Science",
        "Art",
    ];

    const handleCategoryChange = (cat) => {
        setCategory(cat);
        setIsDropdownOpen(false);
    };

    useEffect(() => {
        if (!draftPost || Object.keys(draftPost).length === 0) return;

        setPostId(draftPost.id || null);
        setTitle(draftPost.title || "");
        setCategory(draftPost.category || "");
        setDescription(draftPost.description || "");
        setTags(reverseProcessTags(draftPost.tags || ""));
        setSections(draftPost.sections || []);
    }, [draftPost]);

    const modules = {
        toolbar: [
            [{ header: [1, 2, 3, false] }],
            ["bold", "italic", "underline", "strike"],
            [{ list: "ordered" }, { list: "bullet" }],
            ["link", "image"],
            ["clean"],
        ],
    };

    const processTags = (str) => {
        return str
            .split(',')                      // Split by commas
            .map(item => item.trim())         // Trim each item to remove extra spaces
            .map(item => item.toLowerCase())  // Convert to lowercase
            .filter(item => item.length > 0); // Remove empty strings if any
    }

    const reverseProcessTags = (postTags) => {
        if (!Array.isArray(postTags)) {
            throw new Error("Input must be an array.");
        }
        return postTags.join(", ");
    };

    const handleThumbnailChange = (e) => {
        const file = e.target.files[0];
        setThumbnail(file);
    };

    useEffect(() => {
        // Check if there is any actual change compared to previous state
        if (title !== prevState.current.title || description !== prevState.current.description || content !== prevState.current.content || !areSectionsEqual(sections, prevState.current.sections)) {
            const timer = setTimeout(() => {
                saveDraft();
                setAutoSaveStatus("saved"); // Show confirmation message
                setTimeout(() => setAutoSaveStatus("idle"), 60000); // Revert status after 10 seconds
            }, 60000); // Delay save for 60 seconds after last change

            prevState.current = { title, description, content, sections }; // Update previous state with current state

            return () => clearTimeout(timer); // Cleanup timer on unmount or before next execution
        }
    }, [title, description, content, sections]);

    // Function to compare sections for changes
    const areSectionsEqual = (newSections, oldSections) => {
        if (newSections.length !== oldSections.length) return false;
        for (let i = 0; i < newSections.length; i++) {
            if (newSections[i].title !== oldSections[i].title || newSections[i].content !== oldSections[i].content) {
                return false;
            }
        }
        return true;
    };

    const saveDraft = async () => {

        if (!title || !description || !category) {
            return;
        }

        const formData = new FormData();
        if (postId != undefined || postId != null) {
            formData.append("postId", postId);
        }

        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        const tagsList = processTags(tags); // Process tags into an array
        formData.append("tags", tagsList);
        formData.append("sections", JSON.stringify(sections));

        try {
            const token = localStorage.getItem("token"); // Fetch the token
            if (!token) {
                navigate("/signin")
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/save-post-draft`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData
            });

            if (response.status !== 200) {
                const result = await response.json();
                console.log(result.message)
                throw new Error("Failed to save draft!");
            }

            const result = await response.json();
            setPostId(result.post._id); // Update postId from server response
            setTags(reverseProcessTags(result.post.tags))
            setTitle(result.post.title)
            setDescription(result.post.description);
            setCategory(result.post.category);
            setSections(result.post.sections)
            toast.success("Draft saved successfully!");
        } catch (error) {
            toast.error(error.message || "An error occurred while saving the draft!");
        }
    };

    const handlePublish = async () => {
        if (!title.trim() || sections.length <= 0) {
            setErrorMessage("Title and Content in section are required for publishing!");
            return;
        }

        setErrorMessage("");
        setIsLoading(true);

        const tagsList = processTags(tags)

        const formData = new FormData();

        if (postId != undefined || postId != null) {
            formData.append("postId", postId);
        }

        formData.append("title", title);
        formData.append("description", description);
        formData.append("category", category);
        formData.append("tags", tagsList);
        formData.append("sections", JSON.stringify(sections));
        if (thumbnail) formData.append("file", thumbnail);

        sections.forEach((section, index) => {
            formData.append(`section_title_${index}`, section.title);
            formData.append(`section_content_${index}`, section.content);
        });

        formData.forEach((value, key) => {
            console.log(key, value);
        });

        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate("/signin");
                toast.success("Please login to continue")
            }
            const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/app/v1/create-post/`, {
                method: 'POST',
                headers:
                {
                    'Authorization': `Bearer ${token}`
                },
                body: formData,
            });

            setIsLoading(false);
            if (response.status === 200) {
                toast.success("Blog Published Successfully!");
                clearEditor();
                navigate("/write")
            }
        } catch (error) {
            setIsLoading(false);
            setErrorMessage("Failed to publish post please try again later!!");
        }
    };

    const clearEditor = () => {
        setTitle("");
        setDescription("")
        setCategory("")
        setThumbnail(null);
        setTags("");
        setContent("");
        setSections([]);
    };

    const handlePreview = () => {
        console.log(sections)
        if (!title && sections.length <= 0) {
            setErrorMessage("Add title and content to preview");
            return;
        }
        setErrorMessage(""); // Clear the error message if validation passes
        setIsPreviewOpen(true);
    };

    // Add a new section
    const addSection = () => {
        setSections([
            ...sections,
            { id: Date.now(), title: "", content: "" },
        ]);
    };

    // Handle section title and content changes
    const handleSectionChange = (id, field, value) => {
        setSections(sections.map((section) =>
            section.id === id ? { ...section, [field]: value } : section
        ));
    };

    // Delete a section
    const deleteSection = (id) => {
        setSections(sections.filter((section) => section.id !== id));
    };

    return (
        (isLoading) ? (
            <div className="loading-overlay">
                <div className="loader">
                    <span>Publishing...</span>
                    <div className="spinner"></div>
                </div>
            </div>
        ) :
            <>
                {
                    (!isPreviewOpen) ? <div className="blog-editor-container">
                        <h1>Post Editor</h1>
                        <div className="error-message-container">
                            {errorMessage && <p className="error-message">*{errorMessage}*</p>}
                        </div>
                        <div className='horizontal-ruler'></div>
                        <div className="editor-actions">
                            <span onClick={saveDraft} className="save-draft-button editor-actions-buttons">
                                Save Draft
                                <AiFillSave className="save-draft-icon editor-actions-buttons-icons" />
                            </span>
                            <span onClick={handlePreview} className="preview-button editor-actions-buttons">
                                Preview
                                <MdPreview className="preview-icon editor-actions-buttons-icons" />
                            </span>
                            <span onClick={handlePublish} className="publish-button editor-actions-buttons">
                                Publish
                                <MdPublish className="publish-icon editor-actions-buttons-icons" />
                            </span>
                            <>
                                {autoSaveStatus === "saving" && (
                                    <span className="saving save-button editor-actions-buttons">
                                        Auto saving... <MdOutlineDataSaverOff className="rotating-icon editor-actions-buttons-icons" />
                                    </span>
                                )}
                                {autoSaveStatus === "saved" && (
                                    <span className="saved save-button editor-actions-buttons">
                                        Auto saved <GiConfirmed className="confirmed-icon" />
                                    </span>
                                )}
                                {autoSaveStatus === "idle" && (
                                    <span className="idle save-button editor-actions-buttons">
                                        Auto save <MdOutlineDataSaverOff className="idle-icon" />
                                    </span>
                                )}
                            </>
                        </div>
                        <div className='horizontal-ruler'></div>
                        <div className="form-group">
                            <label>Title <span className="required">*</span></label>
                            <input
                                type="text"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Enter post title"
                            />
                        </div>

                        <div className="form-group">
                            <label>Description <span className="required">*</span></label>
                            <input
                                type="text"
                                value={description}
                                onChange={(e) => setDescription(e.target.value)}
                                placeholder="Enter post description"
                            />
                        </div>

                        <div className="form-group">
                            <label>
                                Category <span className="required">*</span>
                            </label>
                            <div
                                className="dropdown-container"
                                onClick={() => setIsDropdownOpen((prev) => !prev)}
                            >
                                <div className="dropdown-selected">
                                    {category || "Select a category"}
                                </div>
                                {isDropdownOpen && (
                                    <div className="dropdown-options">
                                        {categories.map((cat) => (
                                            <div
                                                key={cat}
                                                className="dropdown-option"
                                                onClick={(e) => {
                                                    e.stopPropagation(); // Prevent triggering dropdown toggle
                                                    handleCategoryChange(cat);
                                                }}
                                            >
                                                {cat}
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="form-group">
                            <label>Thumbnail <span className="required">*</span></label>
                            <input type="file" onChange={handleThumbnailChange} />
                        </div>

                        <div className="form-group">
                            <label>Tags (comma-separated) <span className="required">*</span></label>
                            <input
                                type="text"
                                value={tags}
                                onChange={(e) => setTags(e.target.value)}
                                placeholder="e.g., React, JavaScript"
                            />
                        </div>

                        {/* Add Section Button */}
                        <div className="form-group add-section" onClick={addSection}>
                            <span>Add Section + <span className="required">*</span></span>
                        </div>

                        {/* Render Sections */}
                        {sections.map((section, index) => (
                            <div key={section.id} className="section-container">
                                <div className="section-header">
                                    <span>Section {index + 1}</span>
                                    <span className="section-delete-button-container">
                                        <span className="section-delete-button-text">Delete Section</span>
                                        <MdDelete className="delete-section-btn" onClick={() => deleteSection(section.id)} />
                                    </span>
                                </div>
                                <div className="form-group">
                                    <label>Section Title</label>
                                    <input
                                        type="text"
                                        value={section.title}
                                        onChange={(e) => handleSectionChange(section.id, "title", e.target.value)}
                                        placeholder="Enter section title"
                                    />
                                </div>
                                <ReactQuill
                                    theme="snow"
                                    value={section.content}
                                    onChange={(value) => handleSectionChange(section.id, "content", value)}
                                    modules={modules}
                                    placeholder="Write section content here..."
                                />
                            </div>
                        ))}
                    </div> :
                        <div className="preview-model-main-container">
                            <div className="preview-model-header">
                                <span className="preview-model-header-text">Preview Mode</span>
                                {/* <button onClick={() => setIsPreviewOpen(false)}></button> */}
                                <span className="preview-model-header-button" onClick={() => setIsPreviewOpen(false)}>
                                    <MdCancel className="preview-model-header-button-icon" /> Close Preview
                                </span>
                            </div>
                            <span className='preview-model-post-title'>{title}</span>
                            {thumbnail && (
                                <img
                                    src={URL.createObjectURL(thumbnail)}
                                    alt="Thumbnail"
                                    className='preview-model-post-image'
                                />
                            )}
                            <span className='preview-model-post-description'>{description}</span>
                            {
                                sections.map((section, index) => (
                                    <div key={index} className="preview-model-post-section-container">
                                        <span className='preview-model-post-section-title'>{section.title}</span>
                                        <span
                                            className="preview-model-post-content"
                                            dangerouslySetInnerHTML={{ __html: section.content }}
                                        ></span>
                                    </div>
                                ))
                            }

                        </div>

                }

            </>
    );
}

export default CreateBlog;
