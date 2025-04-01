// components/Blog/BlogDetail.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../utils/api';
import CommentForm from '../Comment/CommentForm';
import CommentList from '../Comment/CommentList';

const BlogDetail = () => {
  const [blog, setBlog] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        const response = await api.get(`/blogs/${id}`);
        setBlog(response.data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog:', error);
        setError('Failed to load blog. Please try again later.');
        setIsLoading(false);
      }
    };

    fetchBlog();
  }, [id]);

  const handleCommentAdded = (newComment) => {
    setBlog({
      ...blog,
      comments: [...blog.comments, newComment]
    });
  };

  const handleReplyAdded = (commentId, newReply) => {
    const updatedComments = blog.comments.map(comment => {
      if (comment._id === commentId) {
        return {
          ...comment,
          replies: [...comment.replies, newReply]
        };
      }
      return comment;
    });

    setBlog({
      ...blog,
      comments: updatedComments
    });
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

  if (!blog) {
    return <div className="alert alert-warning">Blog not found</div>;
  }

  return (
    <div className="row">
      <div className="col-12 mb-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h2>{blog.title}</h2>
            <div>
              <Link to="/blogs" className="btn btn-outline-secondary me-2">
                Back to Blogs
              </Link>
              <Link to={`/blogs/edit/${blog._id}`} className="btn btn-warning">
                Edit Blog
              </Link>
            </div>
          </div>
          <div className="card-body">
            <div className="text-center mb-4">
              <img 
                src= {`http://localhost:5000${blog.imageUrl}`} 
                alt={blog.title} 
                className="img-fluid rounded" 
                style={{ maxHeight: '400px' }}
              />
            </div>
            <div className="blog-content">
              {blog.description.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
            <hr />
            <div className="blog-meta">
              <small className="text-muted">
                Posted by: {blog.author.email} on {new Date(blog.createdAt).toLocaleDateString()}
              </small>
            </div>
          </div>
        </div>
      </div>

      <div className="col-12">
        <div className="card mb-4">
          <div className="card-header">
            <h3>Comments</h3>
          </div>
          <div className="card-body">
            <CommentForm 
              blogId={blog._id} 
              onCommentAdded={handleCommentAdded} 
            />
            <CommentList 
              comments={blog.comments} 
              onReplyAdded={handleReplyAdded} 
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;