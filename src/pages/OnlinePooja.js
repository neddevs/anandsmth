import React, { useState, useEffect, useRef } from 'react';
import PoojaTypes from '../components/PoojaTypes';
import HowItWorks from '../components/HowItWorks';
import BookingForm from '../components/BookingForm';
import Testimonials from '../components/Testimonials';
import PageBackground from '../components/PageBackground';
import './OnlinePooja.css';

const OnlinePooja = () => {
  const [selectedPooja, setSelectedPooja] = useState(null);
  const bookingFormRef = useRef(null);

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handlePoojaSelect = (pooja) => {
    setSelectedPooja(pooja);
    bookingFormRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const imageUrl = 'https://images.unsplash.com/photo-1536570729710-552e7eb8ff1c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';
  
  return (
    <div className="online-pooja-page">
      {/* This is the part we will restyle */}
      <PageBackground imageUrl={imageUrl} />

      <div className="pooja-page-header">
        <div className="container-header">
          <h1>Online Pooja Services</h1>
          <p>Book your sacred ceremony and receive divine blessings from home.</p>
        </div>
      </div>

      <div className="pooja-main-content">
        <PoojaTypes onPoojaSelect={handlePoojaSelect} />

        <div ref={bookingFormRef}>
          <BookingForm selectedPooja={selectedPooja} />
        </div>
        <HowItWorks />

        <Testimonials />
      </div>
    </div>
  );
};

export default OnlinePooja;