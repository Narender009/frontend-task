// components/Blog/AddBlog.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../utils/api';

const AddBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [blogImage, setBlogImage] = useState(null);
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!blogImage) {
      newErrors.blogImage = 'Blog image is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setBlogImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const data = new FormData();
      data.append('title', formData.title);
      data.append('description', formData.description);
      data.append('blogImage', blogImage);
      
      await api.post('/blogs', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/blogs');
    } catch (error) {
      console.error('Add blog error:', error);
      setErrors(prev => ({
        ...prev,
        form: error.response?.data?.message || 'Failed to add blog. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3>Add New Blog</h3>
          </div>
          <div className="card-body">
            {errors.form && (
              <div className="alert alert-danger">{errors.form}</div>
            )}
            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="title" className="form-label">Blog Title</label>
                <input
                  type="text"
                  className={`form-control ${errors.title ? 'is-invalid' : ''}`}
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                />
                {errors.title && <div className="invalid-feedback">{errors.title}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="blogImage" className="form-label">Blog Image</label>
                <input
                  type="file"
                  className={`form-control ${errors.blogImage ? 'is-invalid' : ''}`}
                  id="blogImage"
                  name="blogImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                {errors.blogImage && <div className="invalid-feedback">{errors.blogImage}</div>}
              </div>
              
              <div className="mb-3">
                <label htmlFor="description" className="form-label">Blog Description</label>
                <textarea
                  className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                  id="description"
                  name="description"
                  rows="6"
                  value={formData.description}
                  onChange={handleChange}
                ></textarea>
                {errors.description && <div className="invalid-feedback">{errors.description}</div>}
              </div>
              
              <div className="d-grid gap-2 d-md-flex justify-content-md-end">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  onClick={() => navigate('/blogs')}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary" disabled={isLoading}>
                  {isLoading ? 'Adding...' : 'Add Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddBlog;