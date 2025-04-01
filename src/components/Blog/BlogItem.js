import React from 'react';
import { Link } from 'react-router-dom';

const BlogItem = ({ blog, onDeleteClick }) => {
  // Truncate description to a reasonable length for the table
  const truncateDescription = (text, maxLength = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '...';
  };

  return (
    <tr>
      <td>{blog.title}</td>
      <td>
        <img 
          src= {`http://localhost:5000${blog.imageUrl}`} 
          alt={blog.title}
          style={{ width: '80px', height: '60px', objectFit: 'cover' }}
          className="img-thumbnail"
        />
      </td>
      <td>{truncateDescription(blog.description)}</td>
      <td>
        <div className="btn-group">
          <Link to={`/blogs/${blog._id}`} className="btn btn-sm btn-info me-1">
            View
          </Link>
          <Link to={`/blogs/edit/${blog._id}`} className="btn btn-sm btn-warning me-1">
            Edit
          </Link>
          <button 
            className="btn btn-sm btn-danger"
            onClick={() => onDeleteClick(blog)}
          >
            Delete
          </button>
        </div>
      </td>
    </tr>
  );
};

export default BlogItem;