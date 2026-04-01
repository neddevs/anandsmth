import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import './ProfilePage.css';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const { user, isLoading, logout } = useAuth();
  const navigate = useNavigate();

  // TODO : - To remove later
  const handleChangePassword = () => {
    // Show a confirmation dialog to the user
    if (window.confirm('You will be logged out to securely change your password. Do you want to continue?')) {
      logout();
      navigate('/forgot-password');
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading profile...</div>;
  }

  if (!user) {
    return <div className="error-message">Could not load user profile. Please try logging in again.</div>;
  }

  return (
    <div className="profile-page-container">
      <h2>My Profile</h2>
      <div className="profile-card">
        <div className="profile-avatar">
          <img src={user.avatar || `https://ui-avatars.com/api/?name=${user.fullName}&background=8B4513&color=fff`} alt="User Avatar" />
        </div>
        <div className="profile-details">
          <div className="detail-item">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{user.fullName}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Email Address</span>
            <span className="detail-value">{user.email}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Role</span>
            <span className="detail-value role-badge">{user.role}</span>
          </div>
          <div className="detail-item">
            <span className="detail-label">Member Since</span>
            <span className="detail-value">{new Date(user.createdAt).toLocaleDateString('en-IN', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
        </div>
        <div className="profile-actions">
          {/* We will add functionality to these buttons in a later phase */}
          <button className="btn btn-secondary" disabled>Edit Profile</button>
          <button className="btn btn-secondary" onClick={handleChangePassword} >Change Password</button>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;