import React from 'react';
import { motion } from 'framer-motion';
import './Contact.css';

const Contact = () => {
  // All state and handler functions are removed as they are no longer needed.

  const adminEmail = "info@anandmaya.net";
  const subject = "Customer Feedback for Anandmaya";
  
  // Construct the mailto link
  const mailtoLink = `mailto:${adminEmail}?subject=${encodeURIComponent(subject)}`;

  return (
    <section id="contact" className="contact">
      <div className="container">
        <div className="section-header">
          <h2>Get in Touch</h2>
          <p>We'd love to hear from you and help you on your spiritual journey</p>
        </div>
        <div className="contact-content">
          <motion.div
            className="contact-info"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* The contact info details on the left side remain unchanged */}
            <div className="contact-item">
              <i className="fas fa-map-marker-alt"></i>
              <div>
                <h4>Address</h4>
                <p>Bhubaneswar <br />Odisha, India 751006</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-phone"></i>
              <div>
                <h4>Phone</h4>
                <p>+91-9690791055</p>
              </div>
            </div>
            <div className="contact-item">
              <i className="fas fa-envelope"></i>
              <div>
                <h4>Email</h4>
                <p>{adminEmail}</p>
              </div>
            </div>
          </motion.div>

          {/* --- THIS IS THE UPDATED FORM SECTION --- */}
          <motion.div
            className="contact-form" // We keep the class for styling
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {/* The input fields are removed as they are no longer functional */}
            <p className="contact-prompt">
              Have a question or a special request? Click the button below to send us an email directly from your favorite email application.
            </p>
            
            <motion.a
              href={mailtoLink} // The href now points to the mailto link
              className="btn btn-primary"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              Send an Email
            </motion.a>
          </motion.div>
          {/* ------------------------------------- */}

        </div>
      </div>
    </section>
  );
};

export default Contact;