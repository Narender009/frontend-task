// components/Blog/BlogList.js
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../utils/api';
import BlogItem from './BlogItem';
import ConfirmModal from '../UI/ConfirmModal';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [blogToDelete, setBlogToDelete] = useState(null);

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await api.get('/blogs');
      setBlogs(response.data);
      setIsLoading(false);
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setError('Failed to load blogs. Please try again later.');
      setIsLoading(false);
    }
  };

  const handleDeleteClick = (blog) => {
    setBlogToDelete(blog);
    setShowModal(true);
  };

  const confirmDelete = async () => {
    if (!blogToDelete) return;
    
    try {
      await api.delete(`/blogs/${blogToDelete._id}`);
      setBlogs(blogs.filter(blog => blog._id !== blogToDelete._id));
      setShowModal(false);
      setBlogToDelete(null);
    } catch (error) {
      console.error('Error deleting blog:', error);
      setError('Failed to delete blog. Please try again.');
    }
  };

  const cancelDelete = () => {
    setShowModal(false);
    setBlogToDelete(null);
  };

  if (isLoading) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return <div className="alert alert-danger">{error}</div>;
  }

  return (
    <div>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>My Blogs</h2>
        <Link to="/blogs/add" className="btn btn-primary">
          Add New Blog
        </Link>
      </div>
      
      {blogs.length === 0 ? (
        <div className="alert alert-info">
          You don't have any blogs yet. Click "Add New Blog" to create one.
        </div>
      ) : (
        <div className="table-responsive">
          <table className="table table-hover">
            <thead className="table-light">
              <tr>
                <th>Title</th>
                <th>Image</th>
                <th>Description</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {blogs.map(blog => (
                <BlogItem 
                  key={blog._id} 
                  blog={blog} 
                  onDeleteClick={handleDeleteClick} 
                />
              ))}
            </tbody>
          </table>
        </div>
      )}
      
      <ConfirmModal 
        show={showModal}
        title="Delete Blog"
        message="Are you sure you want to delete this blog? This action cannot be undone."
        onConfirm={confirmDelete}
        onCancel={cancelDelete}
      />
    </div>
  );
};

export default BlogList;