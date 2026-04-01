import React from 'react';
import { motion } from 'framer-motion';
import './HowItWorks.css';

const HowItWorks = () => {
  const steps = [
    {
      number: 1,
      title: 'Choose Your Pooja',
      description: 'Select the type of pooja that suits your needs and occasion'
    },
    {
      number: 2,
      title: 'Book & Pay',
      description: 'Complete your booking and make secure payment online'
    },
    {
      number: 3,
      title: 'Receive Details',
      description: 'Get confirmation with pooja details and live streaming link'
    }
  ];

  return (
    <section className="how-it-works">
      <div className="container">
        <div className="section-header">
          <h2>How Online Pooja Works</h2>
          <p>Simple steps to book and participate in our sacred ceremonies</p>
        </div>
        <div className="steps-container">
          {steps.map((step, index) => (
            <motion.div
              key={step.number}
              className="step"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <motion.div 
                className="step-number"
                whileHover={{ scale: 1.1 }}
                transition={{ duration: 0.3 }}
              >
                {step.number}
              </motion.div>
              <div className="step-content">
                <h3>{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
















