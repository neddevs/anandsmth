import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import apiService from '../services/api';
import PageBackground from '../components/PageBackground';
import './BhaktiYoga.css';

const BhaktiYoga = () => {
  const [catalogues, setCatalogues] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const imageUrl = 'https://images.unsplash.com/photo-1536570729710-552e7eb8ff1c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });

    const fetchCataloguesWithCourses = async () => {
      try {
        const response = await apiService.getAllPublishedCourses();
        if (response.success) {
          const activeCatalogues = response.data.filter(cat => cat.courses && cat.courses.length > 0);
          setCatalogues(activeCatalogues);
        } else {
          throw new Error(response.message || 'Failed to load courses.');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCataloguesWithCourses();
  }, []);

  const getTierClassName = (tier) => `tier-badge tier-${tier.toLowerCase()}`;

  return (
    <div className="bhakti-yoga-page">
      <PageBackground imageUrl={imageUrl} />
      
      <div className="yoga-page-header">
        <div className="container">
          <h1>Bhakti Yoga Courses</h1>
          <p>Embark on a transformative journey with our curated courses for spiritual, physical, and mental wellness.</p>
        </div>
      </div>

      <div className="yoga-main-content">
        <div className="container">
          {isLoading ? (
            <div className="loading-spinner">Loading Courses...</div>
          ) : error ? (
            <div className="error-message">Error: {error}</div>
          ) : (
            <div className="catalogues-container">
              {catalogues.length > 0 ? (
                catalogues.map(catalogue => (
                  <div key={catalogue._id} className="catalogue-section">
                    <div className="catalogue-header">
                      <h2 className="catalogue-title">{catalogue.name}</h2>
                      <p className="catalogue-description">{catalogue.description}</p>
                    </div>
                    <div className="course-grid">
                      {catalogue.courses.map((course) => (
                        <motion.div
                          key={course._id}
                          className="course-card"
                          whileHover={{ y: -8 }}
                          transition={{ type: 'spring', stiffness: 300 }}
                        >
                          <Link to={`/bhakti-yoga/courses/${course._id}`} className="card-link-wrapper">
                            
                            {/* --- 1. THUMBNAIL --- */}
                            <div className="card-thumbnail">
                              <img src={course.thumbnail} alt={course.title} />
                            </div>

                            {/* --- 2. TEXT CONTENT WRAPPER --- */}
                            <div className="card-text-content">
                              <div className="card-header">
                                <p className="course-level">{course.level}</p>
                                <span className={getTierClassName(course.subscriptionTier)}>
                                  {course.subscriptionTier}
                                </span>
                              </div>
                              <h3>{course.title}</h3>
                              <p className="course-description">
                                {course.description.length > 120
                                  ? `${course.description.substring(0, 120)}...`
                                  : course.description}
                              </p>
                            </div>

                          </Link>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                ))
              ) : (
                <p className="no-results-message">No courses are available at the moment. Please check back later.</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BhaktiYoga;