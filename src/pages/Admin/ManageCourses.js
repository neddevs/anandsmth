import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for navigation
import apiService from '../../services/api';
import CourseEditModal from './CourseEditModal'; // Import the modal component
import './ManageCourses.css';

const ManageCourses = () => {
  const [courses, setCourses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize the navigate function

  // --- STATE FOR MODAL MANAGEMENT ---
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);

  const fetchCourses = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await apiService.getAllCoursesAdmin();
      if (response.success) {
        setCourses(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch courses');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    fetchCourses();
  }, []);

  // --- HANDLER FUNCTIONS FOR THE MODAL ---
  const handleOpenAddModal = () => {
    setSelectedCourse(null); // Explicitly set to null for 'Add' mode
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleSaveCourse = async (formData) => {
    try {
      // This handler is now specifically for creating a new course
      const response = await apiService.createCourse(formData);

      if (response.success) {
        fetchCourses(); // Refresh the list to show the newly created course
        handleCloseModal();
        // You could add a success toast notification here
      } else {
        throw new Error(response.message || 'Failed to save course');
      }
    } catch (err) {
      // Displaying the error in an alert for simplicity
      alert(`Error: ${err.message}`);
    }
  };

  const handleDelete = async (courseId) => {
    if (window.confirm('Are you sure you want to delete this course and all its modules and lessons? This is irreversible.')) {
      try {
        await apiService.deleteCourse(courseId);
        fetchCourses(); // Refresh the list after deletion
      } catch (err) {
        setError(err.message);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading courses...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  return (
    <div className="manage-courses-container">
      <div className="header-section">
        <h2>Manage Yoga Courses</h2>
        {/* The "New Course" button is now fully functional */}
        <button className="btn-primary-admin" onClick={handleOpenAddModal}>
          <i className="fas fa-plus"></i> New Course
        </button>
      </div>

      <div className="courses-table-wrapper">
        <table className="courses-table">
          <thead>
            <tr>
              <th>Thumbnail</th>
              <th>Title</th>
              <th>Subscription</th>
              <th>Status</th>
              <th>Modules</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {courses.length > 0 ? (
              courses.map((course) => (
                <tr key={course._id}>
                  <td data-label="Thumbnail">
                    <img src={course.thumbnail} alt={course.title} className="course-table-thumbnail" />
                  </td>
                  <td data-label="Title">{course.title}</td>
                  <td data-label="Subscription">
                    <span className={`tier-badge tier-${course.subscriptionTier.toLowerCase()}`}>
                      {course.subscriptionTier}
                    </span>
                  </td>
                  <td data-label="Status">
                    <span className={`status-badge ${course.isPublished ? 'status-published' : 'status-draft'}`}>
                      {course.isPublished ? 'Published' : 'Draft'}
                    </span>
                  </td>
                  <td data-label="Modules">{course.modules.length}</td>
                  <td data-label="Actions" className="action-cell">
                    {/* This button now navigates to the dedicated editor page */}
                    <button className="action-btn" onClick={() => navigate(`/admin/courses/${course._id}/edit`)}>
                      <i className="fas fa-edit"></i> Manage
                    </button>
                    <button className="action-btn btn-delete" onClick={() => handleDelete(course._id)}>
                      <i className="fas fa-trash"></i> Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-results">No courses found. Create one to get started!</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      {/* --- RENDER THE MODAL WITH CORRECT PROPS --- */}
      {/* This modal is now wired up for adding new courses */}
      <CourseEditModal
        course={selectedCourse} // This will be null when adding a new course
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        onSave={handleSaveCourse}
      />
    </div>
  );
};

export default ManageCourses;