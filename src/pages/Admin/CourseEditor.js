import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import apiService from '../../services/api';
import ModuleEditModal from './ModuleEditModal';
import LessonEditModal from './LessonEditModal';
import './CourseEditor.css';
import CourseEditModal from './CourseEditModal';

const CourseEditor = () => {
  const { courseId } = useParams();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  // State for managing modals
  const [isCourseModalOpen, setIsCourseModalOpen] = useState(false); // For editing course details
  const [isModuleModalOpen, setIsModuleModalOpen] = useState(false);
  const [selectedModule, setSelectedModule] = useState(null);
  const [isLessonModalOpen, setIsLessonModalOpen] = useState(false);
  const [selectedLesson, setSelectedLesson] = useState(null);
  const [activeModule, setActiveModule] = useState(null); // To track which module a new lesson belongs to

  const fetchCourseDetails = async () => {
    // We don't need to setIsLoading(true) here as it's handled in the initial load
    setError(null);
    try {
      const response = await apiService.getCourseByIdForAdmin(courseId);
      if (response.success) {
        setCourse(response.data);
      } else {
        throw new Error(response.message || 'Failed to fetch course details');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsLoading(false); // Make sure loading is always set to false in the end
    }
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    setIsLoading(true);
    fetchCourseDetails();
  }, [courseId]);

  // --- MODULE HANDLER FUNCTIONS ---
  const handleOpenCourseModal = () => setIsCourseModalOpen(true);
  const handleCloseCourseModal = () => setIsCourseModalOpen(false);

  const handleSaveCourseDetails = async (formData) => {
    try {
      const response = await apiService.updateCourse(courseId, formData);
      if (response.success) {
        fetchCourseDetails(); // Refresh the page data
        handleCloseCourseModal();
      } else {
        throw new Error(response.message || 'Failed to update course details');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleOpenAddModule = () => {
    setSelectedModule(null);
    setIsModuleModalOpen(true);
  };

  const handleOpenEditModule = (module) => {
    setSelectedModule(module);
    setIsModuleModalOpen(true);
  };

  const handleCloseModuleModal = () => {
    setIsModuleModalOpen(false);
    setSelectedModule(null);
  };

  const handleSaveModule = async (formData) => {
    try {
      let response;
      if (selectedModule) {
        response = await apiService.updateModule(selectedModule._id, formData);
      } else {
        response = await apiService.addModuleToCourse(courseId, formData);
      }
      if (response.success) {
        fetchCourseDetails();
        handleCloseModuleModal();
      } else {
        throw new Error(response.message || 'Failed to save module');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteModule = async (moduleId) => {
    if (window.confirm('Are you sure you want to delete this module and all its lessons?')) {
      try {
        await apiService.deleteModule(moduleId);
        fetchCourseDetails();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  // --- LESSON HANDLER FUNCTIONS ---
  const handleOpenAddLesson = (module) => {
    setActiveModule(module);
    setSelectedLesson(null);
    setIsLessonModalOpen(true);
  };

  const handleOpenEditLesson = (lesson, module) => {
    setActiveModule(module);
    setSelectedLesson(lesson);
    setIsLessonModalOpen(true);
  };

  const handleCloseLessonModal = () => {
    setIsLessonModalOpen(false);
    setSelectedLesson(null);
    setActiveModule(null);
  };

  const handleSaveLesson = async (formData) => {
    try {
      let response;
      if (selectedLesson) {
        response = await apiService.updateLesson(selectedLesson._id, formData);
      } else {
        response = await apiService.addLessonToModule(activeModule._id, formData);
      }
      if (response.success) {
        fetchCourseDetails();
        handleCloseLessonModal();
      } else {
        throw new Error(response.message || 'Failed to save lesson');
      }
    } catch (err) {
      alert(`Error: ${err.message}`);
    }
  };

  const handleDeleteLesson = async (lessonId) => {
    if (window.confirm('Are you sure you want to delete this lesson?')) {
      try {
        await apiService.deleteLesson(lessonId);
        fetchCourseDetails();
      } catch (err) {
        alert(`Error: ${err.message}`);
      }
    }
  };

  if (isLoading) {
    return <div className="loading-spinner">Loading course editor...</div>;
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!course) {
    return <div className="error-message">Course not found.</div>;
  }

  return (
    <div className="course-editor-container">
      <div className="editor-header">
        <Link to="/admin/courses" className="back-link">
          <i className="fas fa-arrow-left"></i> Back to Courses
        </Link>
        <h2>Course Editor: <span>{course.title}</span></h2>
        <button className="btn-primary-admin" onClick={handleOpenCourseModal}>
          <i className="fas fa-pen"></i> Edit Course Details
        </button>
      </div>

      <div className="curriculum-manager">
        <h3>Curriculum</h3>
        <div className="modules-list">
          {course.modules && course.modules.sort((a, b) => a.order - b.order).map((module) => (
            <div key={module._id} className="module-item">
              <div className="module-header">
                <h4>{module.order}. {module.title}</h4>
                <div className="item-actions">
                  <button className="action-btn" onClick={() => handleOpenEditModule(module)}>
                    <i className="fas fa-pen"></i> Edit
                  </button>
                  <button className="action-btn btn-delete" onClick={() => handleDeleteModule(module._id)}>
                    <i className="fas fa-trash"></i> Delete
                  </button>
                </div>
              </div>
              <p>{module.description}</p>

              <div className="lessons-list">
                {module.lessons && module.lessons.sort((a, b) => a.order - b.order).map(lesson => (
                  <div key={lesson._id} className="lesson-item">
                    <span className="lesson-title">
                      <i className={`fas ${lesson.type === 'Video' ? 'fa-play-circle' : 'fa-file-alt'}`}></i>
                      {lesson.order}. {lesson.title}
                    </span>
                    <div className="item-actions">
                      <button className="action-btn" onClick={() => handleOpenEditLesson(lesson, module)}>
                        <i className="fas fa-pen"></i> Edit
                      </button>
                      <button className="action-btn btn-delete" onClick={() => handleDeleteLesson(lesson._id)}>
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </div>
                  </div>
                ))}
                <button className="btn-add-item-small" onClick={() => handleOpenAddLesson(module)}>
                  <i className="fas fa-plus"></i> Add Lesson
                </button>
              </div>
            </div>
          ))}
          <button className="btn-add-item" onClick={handleOpenAddModule}>
            <i className="fas fa-plus"></i> Add Module
          </button>
        </div>
      </div>

      <ModuleEditModal
        module={selectedModule}
        isOpen={isModuleModalOpen}
        onClose={handleCloseModuleModal}
        onSave={handleSaveModule}
        courseModulesCount={course?.modules?.length || 0}
        parentCourseTier={course?.subscriptionTier}
      />

      <LessonEditModal
        lesson={selectedLesson}
        isOpen={isLessonModalOpen}
        onClose={handleCloseLessonModal}
        onSave={handleSaveLesson}
        moduleLessonsCount={activeModule?.lessons?.length || 0}
      />

      <CourseEditModal
        course={course}
        isOpen={isCourseModalOpen}
        onClose={handleCloseCourseModal}
        onSave={handleSaveCourseDetails}
      />
    </div>
  );
};

export default CourseEditor;