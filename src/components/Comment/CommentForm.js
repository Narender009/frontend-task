// components/Comment/CommentForm.js
import React, { useState } from 'react';
import api from '../../utils/api';

const CommentForm = ({ blogId, commentId, onCommentAdded, onReplyAdded, onCancel }) => {
  const [content, setContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!content.trim()) return;
    
    setIsLoading(true);
    
    try {
      let response;
    
      if (commentId) {
        // This is a reply to a comment
        response = await api.post(`/comments/${commentId}/replies`, { content });
        onReplyAdded(response.data);
      } else {
        // This is a new comment on the blog
        response = await api.post(`/comments/${blogId}/addcomments`, { content });
        onCommentAdded(response.data);
      }
    
      setContent('');
      setError(null);
    
      if (onCancel) {
        onCancel();
      }
    } catch (error) {
      console.error('Error posting comment:', error.response ? error.response.data : error.message);
      setError(error.response ? error.response.data : 'Failed to post your comment. Please try again.');
    } finally {
      setIsLoading(false);
    }
    
  };

  return (
    <div className="comment-form mb-4">
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <textarea
            className="form-control"
            rows="3"
            placeholder={commentId ? "Write a reply..." : "Write a comment..."}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div className="d-flex justify-content-end">
          {onCancel && (
            <button 
              type="button" 
              className="btn btn-outline-secondary me-2" 
              onClick={onCancel}
            >
              Cancel
            </button>
          )}
          <button 
            type="submit" 
            className="btn btn-primary" 
            disabled={isLoading || !content.trim()}
          >
            {isLoading ? 'Posting...' : commentId ? 'Reply' : 'Comment'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default CommentForm;