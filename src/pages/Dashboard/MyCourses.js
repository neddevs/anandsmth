import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import apiService from '../../services/api';
import './MyCourses.css';

const MyCourses = () => {
  const [enrollments, setEnrollments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrollments = async () => {
      try {
        const response = await apiService.getMyEnrollments();
        if (response.success) {
          setEnrollments(response.data);
        } else {
          throw new Error(response.message || 'Failed to fetch courses');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrollments();
  }, []);

  if (isLoading) {
    return <div className="loading-spinner">Loading your courses...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="my-courses-container">
      <h2>My Bhakti Yoga Courses</h2>
      {enrollments.length === 0 ? (
        <div className="no-courses">
          <p>You are not enrolled in any courses yet.</p>
          <Link to="/bhakti-yoga" className="btn btn-primary">Explore Courses</Link>
        </div>
      ) : (
        <div className="enrolled-courses-grid">
          {enrollments.map((enrollment) => (
            <div key={enrollment._id} className="enrolled-course-card">
              <img src={enrollment.course?.thumbnail} alt={enrollment.course?.title} className="course-thumbnail" />
              <div className="course-info">
                <h3>{enrollment.course?.title || 'Course Title Missing'}</h3>
                <div className="progress-bar-container">
                  <div
                    className="progress-bar"
                    style={{ width: `${enrollment.completionPercentage}%` }}
                  ></div>
                </div>
                <p className="progress-text">{Math.round(enrollment.completionPercentage)}% Complete</p>
                <Link to={`/courses/player/${enrollment.course?._id}`} className="btn-resume">
                  {enrollment.completionPercentage > 0 ? 'Resume Course' : 'Start Course'}
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCourses;