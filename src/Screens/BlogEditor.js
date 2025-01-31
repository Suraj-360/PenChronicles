import React, { useState } from 'react';
import '../Styles/BlogEditor.css';
import { FaTrash } from 'react-icons/fa';
import { RiDraftFill } from 'react-icons/ri';
import { MdPublishedWithChanges } from 'react-icons/md';
import { CiTimer } from 'react-icons/ci';
import { IoIosCreate } from 'react-icons/io';
import Nav from '../Components/Nav';
import CreateBlog from '../Components/CreateBlog';
import PostEditorPosts from '../Components/PostEditorPosts';

const BlogEditor = () => {
  const [activePostType, setActivePostType] = useState('create');
  const [editingPost, setEditingPost] = useState(null);

  const options = [
    { icon: <IoIosCreate />, text: 'Create Post', posttype: 'create' },
    { icon: <MdPublishedWithChanges />, text: 'Published Posts', posttype: 'published' },
    { icon: <RiDraftFill />, text: 'Draft Posts', posttype: 'draft' },
    { icon: <FaTrash />, text: 'Trash', posttype: 'trash' },
    { icon: <CiTimer />, text: 'Recent Posts', posttype: 'recent' },
  ];

  const handleOptionClick = (posttype) => {
    setActivePostType(posttype || 'create');
    setEditingPost(null);
  };


  const openDrawerWithPost = ({ id, title, description, category, tags, sections }) => {
    setEditingPost({ id, title, description, category, tags, sections });
    setActivePostType('create');
  };

  return (
    <div className='blog-editor-main-container'>
      <Nav
        isBell={true}
      />
      <div className='blog-editor-drawer'>
        {options.map((option, index) => (
          <div
            key={index}
            className={`blog-editor-drawer-option ${activePostType === option.posttype ? 'active' : ''}`}
            onClick={() => handleOptionClick(option.posttype)}
          >
            <div className='blog-editor-drawer-option-icon'>{option.icon}</div>
            <span className='blog-editor-drawer-option-text'>{option.text}</span>
          </div>
        ))}
      </div>

      <div className='blog-editor-option-container'>
        {activePostType !== 'create' ? (
          <PostEditorPosts posttype={activePostType} openDrawerWithPost={openDrawerWithPost} />
        ) : (
          <CreateBlog draftPost={editingPost} />
        )}
      </div>
    </div>
  );
};

export default BlogEditor;
