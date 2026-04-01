import React from 'react';
import { motion } from 'framer-motion';
import './Testimonials.css';

const Testimonials = () => {
  const testimonials = [
    {
      content: "The online pooja experience was truly divine. I felt connected to the divine energy even from miles away. The priest was very knowledgeable and the ceremony was conducted with utmost devotion.",
      author: "Priya Sharma",
      location: "Mumbai, India"
    },
    {
      content: "I was skeptical about online pooja initially, but the experience exceeded my expectations. The quality of the ceremony and the spiritual energy was incredible. Highly recommended!",
      author: "Rajesh Kumar",
      location: "Delhi, India"
    },
    {
      content: "As someone living abroad, this online pooja service has been a blessing. I can now participate in traditional ceremonies and maintain my spiritual connection with my roots.",
      author: "Anita Patel",
      location: "New York, USA"
    }
  ];

  return (
    <section className="testimonials">
      <div className="container">
        <div className="section-header">
          <h2>What Our Devotees Say</h2>
          <p>Experiences from our community of spiritual seekers</p>
        </div>
        <div className="testimonials-grid">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              className="testimonial-card"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <div className="testimonial-content">
                <p>"{testimonial.content}"</p>
              </div>
              <div className="testimonial-author">
                <div className="author-avatar">
                  <i className="fas fa-user"></i>
                </div>
                <div className="author-info">
                  <h4>{testimonial.author}</h4>
                  <span>{testimonial.location}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
















