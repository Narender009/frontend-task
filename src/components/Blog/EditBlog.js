// components/Blog/EditBlog.js
import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import api from '../../utils/api';

const EditBlog = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });
  const [blogImage, setBlogImage] = useState(null);
  const [currentImage, setCurrentImage] = useState('');
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [isFetching, setIsFetching] = useState(true);
  
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        const blog = response.data;
        
        setFormData({
          title: blog.title,
          description: blog.description
        });
        
        setCurrentImage(blog.imageUrl);
        setIsFetching(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        navigate('/blogs');
      }
    };
    
    fetchBlog();
  }, [id, navigate]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
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
      
      if (blogImage) {
        data.append('blogImage', blogImage);
      }
      
      await api.put(`/blogs/${id}`, data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      navigate('/blogs');
    } catch (error) {
      console.error('Edit blog error:', error);
      setErrors(prev => ({
        ...prev,
        form: error.response?.data?.message || 'Failed to update blog. Please try again.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  if (isFetching) {
    return (
      <div className="text-center p-5">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="row justify-content-center">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3>Edit Blog</h3>
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
                {currentImage && (
                  <div className="mb-2">
                    <img 
                      src= {`http://localhost:5000${currentImage}`}
                      alt="Current blog image" 
                      className="img-thumbnail mb-2" 
                      style={{ height: '150px' }}
                    />
                    <p className="text-muted">Current image</p>
                  </div>
                )}
                <input
                  type="file"
                  className="form-control"
                  id="blogImage"
                  name="blogImage"
                  accept="image/*"
                  onChange={handleFileChange}
                />
                <small className="text-muted">Leave empty to keep the current image</small>
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
                  {isLoading ? 'Updating...' : 'Update Blog'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditBlog;