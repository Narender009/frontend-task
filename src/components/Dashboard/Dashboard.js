// components/Dashboard/Dashboard.js
import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Dashboard = () => {
  const { currentUser } = useAuth();
  
  return (
    <div className="row">
      <div className="col-md-8">
        <div className="card">
          <div className="card-header">
            <h3>Dashboard</h3>
          </div>
          <div className="card-body">
            <h4>Welcome, {currentUser.email}!</h4>
            <p>From here you can manage your blog posts.</p>
            <div className="d-grid gap-2 d-md-flex">
              <Link to="/blogs" className="btn btn-primary">
                View All Blogs
              </Link>
              <Link to="/blogs/add" className="btn btn-success">
                Add New Blog
              </Link>
            </div>
          </div>
        </div>
      </div>
      <div className="col-md-4">
        <div className="card">
          <div className="card-header">
            <h3>Profile</h3>
          </div>
          <div className="card-body text-center">
          <img 
              src={`http://localhost:5000${currentUser.profileImageUrl}`} 
              alt="Profile" 
              className="img-fluid rounded-circle mb-3 ml-10" 
              style={{ width: '150px', height: '150px', objectFit: 'cover' }}
            />

            <h5>{currentUser.email}</h5>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;