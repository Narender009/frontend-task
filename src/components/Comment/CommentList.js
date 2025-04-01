// components/Comment/CommentList.js
import React, { useState } from 'react';
import CommentForm from './CommentForm';
import { useAuth } from '../../context/AuthContext';

const CommentList = ({ comments, onReplyAdded }) => {
  const [replyingTo, setReplyingTo] = useState(null);
  const { currentUser } = useAuth();

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleString(undefined, options);
  };

  const handleReplyClick = (commentId) => {
    setReplyingTo(commentId);
  };

  const handleCancelReply = () => {
    setReplyingTo(null);
  };

  const handleReplyAdded = (newReply) => {
    onReplyAdded(replyingTo, newReply);
    setReplyingTo(null);
  };

  if (!comments || comments.length === 0) {
    return <p className="text-muted">No comments yet. Be the first to comment!</p>;
  }

  return (
    <div className="comment-list mt-4">
      {comments.map((comment) => (
        <div key={comment._id} className="comment mb-4 border-bottom pb-2">
          <div className="d-flex">
            <div className="flex-shrink-0">
              <img 
                src={comment.author.profileImageUrl || 'https://via.placeholder.com/40'} 
                alt={comment.author.email} 
                className="rounded-circle"
                width="40"
                height="40"
              />
            </div>
            <div className="flex-grow-1 ms-3">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-0">{comment.author.email}</h6>
                <small className="text-muted">{formatDate(comment.createdAt)}</small>
              </div>
              <p className="mb-1">{comment.content}</p>
              <button 
                className="btn btn-sm btn-link p-0 text-decoration-none"
                onClick={() => handleReplyClick(comment._id)}
              >
                Reply
              </button>
              
              {replyingTo === comment._id && (
                <div className="mt-3">
                  <CommentForm 
                    commentId={comment._id} 
                    onReplyAdded={handleReplyAdded}
                    onCancel={handleCancelReply}
                  />
                </div>
              )}
              
              {/* Replies */}
              {comment.replies && comment.replies.length > 0 && (
                <div className="replies mt-3 ms-4">
                  {comment.replies.map((reply) => (
                    <div key={reply._id} className="reply mb-3">
                      <div className="d-flex">
                        <div className="flex-shrink-0">
                          <img 
                            src={reply.author.profileImageUrl || 'https://via.placeholder.com/30'} 
                            alt={reply.author.email} 
                            className="rounded-circle"
                            width="30"
                            height="30"
                          />
                        </div>
                        <div className="flex-grow-1 ms-2">
                          <div className="d-flex justify-content-between align-items-center">
                            <h6 className="mb-0 fs-6">{reply.author.email}</h6>
                            <small className="text-muted">{formatDate(reply.createdAt)}</small>
                          </div>
                          <p className="mb-0 small">{reply.content}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CommentList;