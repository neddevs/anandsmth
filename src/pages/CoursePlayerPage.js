import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import LiteYouTubeEmbed from 'react-lite-youtube-embed';
import 'react-lite-youtube-embed/dist/LiteYouTubeEmbed.css';
import apiService from '../services/api';
import './CoursePlayerPage.css'; 

const CoursePlayerPage = () => {
  const { id: courseId } = useParams();
  const navigate = useNavigate();

  const [courseData, setCourseData] = useState(null);
  const [enrollment, setEnrollment] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchEnrolledCourse = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const response = await apiService.getEnrolledCourse(courseId);
        if (response.success) {
          const course = response.data.course;
          const enrollmentData = response.data.enrollment;
          setCourseData(course);
          setEnrollment(enrollmentData);

          // Find the first accessible lesson to start with
          let firstAccessibleLesson = null;
          for (const module of course.modules.sort((a, b) => a.order - b.order)) {
            if (module.hasAccess && module.lessons?.length > 0) {
              firstAccessibleLesson = module.lessons.sort((a, b) => a.order - b.order)[0];
              break;
            }
          }
          setCurrentLesson(firstAccessibleLesson);

        } else {
          throw new Error(response.message || 'Failed to fetch course content.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchEnrolledCourse();
  }, [courseId]);

  const handleMarkAsComplete = async () => {
    if (!currentLesson || isLessonCompleted(currentLesson._id)) return;
    try {
      const response = await apiService.markLessonAsComplete(currentLesson._id);
      if (response.success) {
        setEnrollment(response.data); // Update enrollment with new progress
      }
    } catch (err) {
      console.error("Failed to mark lesson as complete:", err);
    }
  };

  const isLessonCompleted = (lessonId) => {
    return enrollment?.progress.some(p => p.lesson === lessonId);
  };

  const getYouTubeId = (url) => {
    if (!url) return null;
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const totalLessons = courseData?.modules.reduce((acc, module) => acc + (module.lessons?.length || 0), 0) || 0;
  const completedLessons = enrollment?.progress.length || 0;
  const completionPercentage = totalLessons > 0 ? (completedLessons / totalLessons) * 100 : 0;

  // Find the module that the current lesson belongs to
  const currentModule = currentLesson
    ? courseData?.modules.find(m => m.lessons.some(l => l._id === currentLesson._id))
    : null;

  const videoId = getYouTubeId(currentLesson?.videoUrl);

  if (isLoading) { return <div className="loading-spinner">Loading Course Player...</div>; }
  if (error) { return <div className="error-message">Error: {error}</div>; }
  if (!courseData) { return <div className="error-message">Course content not found.</div>; }

  return (
    <div className="course-player-page">
      <aside className="player-sidebar">
        <div className="sidebar-header">
          <Link to="/dashboard/courses" className="back-link">
            <i className="fas fa-arrow-left"></i> My Courses
          </Link>
          <h3>{courseData.title}</h3>
        </div>
        <div className="course-progress">
          <div className="progress-bar-container">
            <div className="progress-bar" style={{ width: `${completionPercentage}%` }}></div>
          </div>
          <p className="progress-text">{Math.round(completionPercentage)}% Complete ({completedLessons}/{totalLessons})</p>
        </div>
        <div className="curriculum-list">
          {courseData.modules.sort((a, b) => a.order - b.order).map((module) => (
            <div key={module._id} className="module-group">
              <h4 className="module-title">
                {module.title}
                {!module.hasAccess && <i className="fas fa-lock lock-icon"></i>}
              </h4>
              <ul className="lesson-list">
                {module.lessons.sort((a, b) => a.order - b.order).map((lesson) => (
                  <li
                    key={lesson._id}
                    className={`lesson-item ${!module.hasAccess ? 'locked' : ''} ${currentLesson?._id === lesson._id ? 'active' : ''}`}
                    onClick={() => module.hasAccess && setCurrentLesson(lesson)}
                  >
                    <i className={`fas ${!module.hasAccess ? 'fa-lock' : (isLessonCompleted(lesson._id) ? 'fa-check-circle completed-icon' : (lesson.type === 'Video' ? 'fa-play-circle' : 'fa-file-alt'))}`}></i>
                    <span>{lesson.title}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </aside>
      <main className="player-main-content">
        {currentLesson ? (
          <>
            <div className="video-player-wrapper">
              {/* --- CRUCIAL ACCESS CHECK --- */}
              {currentModule?.hasAccess ? (
                // User has access, show the content
                currentLesson.type === 'Video' && videoId ? (
                  <LiteYouTubeEmbed id={videoId} title={currentLesson.title} />
                ) : (
                  <div className="non-video-content">
                    <h3><i className={`fas ${currentLesson.type === 'PDF' ? 'fa-file-pdf' : 'fa-file-alt'}`}></i> {currentLesson.title}</h3>
                    <p>{currentLesson.textContent || "This lesson's primary content is a downloadable resource."}</p>
                  </div>
                )
              ) : (
                // User does NOT have access, show the upsell message
                <div className="content-locked-overlay">
                  <i className="fas fa-lock"></i>
                  <h3>This Content is Locked</h3>
                  <p>This module is only available for '{currentModule?.subscriptionTier}' subscribers.</p>
                  <button onClick={() => navigate('/subscribe')} className="btn-subscribe-now">
                    Upgrade Your Plan
                  </button>
                </div>
              )}
            </div>

            <div className="lesson-header">
              <h1>{currentLesson.title}</h1>
              {currentModule?.hasAccess && (
                <button
                  className={`btn-complete ${isLessonCompleted(currentLesson._id) ? 'completed' : ''}`}
                  onClick={handleMarkAsComplete}
                  disabled={isLessonCompleted(currentLesson._id)}
                >
                  {isLessonCompleted(currentLesson._id) ? '✓ Completed' : 'Mark as Complete'}
                </button>
              )}
            </div>

            {currentModule?.hasAccess && currentLesson.notesUrl && (
              <div className="lesson-details">
                <a href={currentLesson.notesUrl} target="_blank" rel="noopener noreferrer" className="btn-download-notes">
                  <i className="fas fa-download"></i> View or Download Notes
                </a>
              </div>
            )}
          </>
        ) : (
          <div className="no-lesson-selected">
            <h3>Welcome!</h3>
            <p>Select a lesson from the sidebar to begin your journey.</p>
          </div>
        )}
      </main>
    </div>
  );
};

export default CoursePlayerPage;