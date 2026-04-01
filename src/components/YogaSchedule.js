import React from 'react';
import { motion } from 'framer-motion';
import './YogaSchedule.css';

const YogaSchedule = () => {
  const schedule = [
    {
      day: 'Monday',
      classes: [
        { time: '6:00 AM', type: 'Morning Meditation', instructor: 'Priya Sharma', level: 'All Levels' },
        { time: '7:30 AM', type: 'Hatha Yoga', instructor: 'Rajesh Kumar', level: 'Beginner' },
        { time: '6:00 PM', type: 'Vinyasa Flow', instructor: 'Anita Patel', level: 'Intermediate' },
        { time: '7:30 PM', type: 'Pranayama Session', instructor: 'Dr. Vikram Singh', level: 'All Levels' }
      ]
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '6:00 AM', type: 'Sunrise Yoga', instructor: 'Meera Joshi', level: 'All Levels' },
        { time: '9:00 AM', type: 'Senior Yoga', instructor: 'Kavita Gupta', level: 'Beginner' },
        { time: '6:00 PM', type: 'Power Yoga', instructor: 'Arjun Reddy', level: 'Advanced' },
        { time: '8:00 PM', type: 'Restorative Yoga', instructor: 'Dr. Neha Agarwal', level: 'All Levels' }
      ]
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '6:00 AM', type: 'Mindful Movement', instructor: 'Priya Sharma', level: 'All Levels' },
        { time: '10:00 AM', type: 'Prenatal Yoga', instructor: 'Dr. Sunita Rao', level: 'Special' },
        { time: '6:00 PM', type: 'Yin Yoga', instructor: 'Rajesh Kumar', level: 'All Levels' },
        { time: '7:30 PM', type: 'Bhajan & Meditation', instructor: 'Swami Ji', level: 'All Levels' }
      ]
    },
    {
      day: 'Thursday',
      classes: [
        { time: '6:00 AM', type: 'Chakra Balancing', instructor: 'Anita Patel', level: 'Intermediate' },
        { time: '9:00 AM', type: 'Gentle Yoga', instructor: 'Meera Joshi', level: 'Beginner' },
        { time: '6:00 PM', type: 'Ashtanga Yoga', instructor: 'Arjun Reddy', level: 'Advanced' },
        { time: '8:00 PM', type: 'Sleep Yoga', instructor: 'Dr. Vikram Singh', level: 'All Levels' }
      ]
    },
    {
      day: 'Friday',
      classes: [
        { time: '6:00 AM', type: 'Morning Energizer', instructor: 'Rajesh Kumar', level: 'All Levels' },
        { time: '10:00 AM', type: 'Kids Yoga', instructor: 'Kavita Gupta', level: 'Children' },
        { time: '6:00 PM', type: 'Hot Yoga', instructor: 'Anita Patel', level: 'Intermediate' },
        { time: '7:30 PM', type: 'Mantra Chanting', instructor: 'Swami Ji', level: 'All Levels' }
      ]
    },
    {
      day: 'Saturday',
      classes: [
        { time: '7:00 AM', type: 'Weekend Warrior', instructor: 'Arjun Reddy', level: 'Advanced' },
        { time: '9:00 AM', type: 'Family Yoga', instructor: 'Meera Joshi', level: 'All Ages' },
        { time: '10:30 AM', type: 'Yoga Philosophy', instructor: 'Dr. Neha Agarwal', level: 'All Levels' },
        { time: '6:00 PM', type: 'Full Moon Yoga', instructor: 'Priya Sharma', level: 'All Levels' }
      ]
    },
    {
      day: 'Sunday',
      classes: [
        { time: '8:00 AM', type: 'Sunday Serenity', instructor: 'Dr. Sunita Rao', level: 'All Levels' },
        { time: '10:00 AM', type: 'Satsang', instructor: 'Swami Ji', level: 'All Levels' },
        { time: '6:00 PM', type: 'Weekend Wind-down', instructor: 'Kavita Gupta', level: 'All Levels' }
      ]
    }
  ];

  return (
    <section className="yoga-schedule">
      <div className="container">
        <motion.div 
          className="schedule-header"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2>Weekly Class Schedule</h2>
          <p>Join our diverse range of yoga classes throughout the week</p>
        </motion.div>

        <div className="schedule-grid">
          {schedule.map((day, dayIndex) => (
            <motion.div 
              key={day.day}
              className="schedule-day"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: dayIndex * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="day-header">
                <h3 className="day-name">{day.day}</h3>
              </div>
              
              <div className="day-classes">
                {day.classes.map((classItem, classIndex) => (
                  <motion.div 
                    key={classIndex}
                    className="class-item"
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: (dayIndex * 0.1) + (classIndex * 0.05) }}
                    viewport={{ once: true }}
                    whileHover={{ scale: 1.02, y: -2 }}
                  >
                    <div className="class-time">{classItem.time}</div>
                    <div className="class-details">
                      <div className="class-type">{classItem.type}</div>
                      <div className="class-instructor">with {classItem.instructor}</div>
                      <div className="class-level">{classItem.level}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="schedule-info"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          viewport={{ once: true }}
        >
          <div className="info-cards">
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-clock"></i>
              </div>
              <h4>Class Duration</h4>
              <p>Most classes are 60-75 minutes long</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-user-plus"></i>
              </div>
              <h4>Drop-in Welcome</h4>
              <p>No advance booking required for most classes</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-mats"></i>
              </div>
              <h4>Equipment Provided</h4>
              <p>Yoga mats and props available at the studio</p>
            </div>
            <div className="info-card">
              <div className="info-icon">
                <i className="fas fa-heart"></i>
              </div>
              <h4>Beginner Friendly</h4>
              <p>All levels welcome, modifications provided</p>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default YogaSchedule;










