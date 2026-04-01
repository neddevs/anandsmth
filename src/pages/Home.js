import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import Hero from '../components/Hero';
import ServiceSection from '../components/ServiceSection';
import Contact from '../components/Contact';
import Logo from '../components/Logo';
import YogaSymbol from '../components/YogaSymbol';
import YantraBackground from '../components/YantraBackground';
import SoundNotification from '../components/SoundNotification';
import AnimatedBackground from '../components/AnimatedBackground';
import LiveStreamingBanner from '../components/LiveStreamingBanner';
import BackgroundCarousel from '../components/BackgroundCarousel';
import './Home.css';

const Home = () => {
  const navigate = useNavigate();
  const [showSoundNotification, setShowSoundNotification] = useState(false);

  const handleServiceClick = (service) => {
    if (service === 'online-pooja') {
      navigate('/online-pooja');
      // Scroll to top of the page after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (service === 'live-darshan') {
      navigate('/live-darshan');
      // Scroll to top of the page after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (service === 'bhakti-store') {
      navigate('/bhakti-store');
      // Scroll to top of the page after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else if (service === 'bhakti-yoga') {
      navigate('/bhakti-yoga');
      // Scroll to top of the page after navigation
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 100);
    } else {
      // Scroll to section on same page
      const element = document.getElementById(service);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };


  const handleNotificationHide = () => {
    setShowSoundNotification(false);
  };

  return (
    <div className="home">
      {/* <AnimatedBackground />showing_Up
      showing_Up
       */}
      <BackgroundCarousel />
      <Hero onServiceClick={handleServiceClick} />
      {/* <LiveStreamingBanner onServiceClick={handleServiceClick} /> */}
      <ServiceSection
        id="online-pooja"
        title="Online Pooja"
        subtitle="Perform sacred rituals and prayers from anywhere in the world"
        icon="fas fa-hands-praying"
        description="Experience the power of traditional pooja ceremonies through our online platform. Our experienced priests conduct live pooja sessions that you can participate in from the comfort of your home."
        features={[
          // "Live streaming of pooja ceremonies",
          // "Interactive participation",
          "Personalized prayers and offerings",
          // "Recorded sessions for later viewing"
        ]}
        buttonText="Book Online Pooja"
        onButtonClick={() => navigate('/online-pooja')}
        imageUrl="https://images.unsplash.com/photo-1625072290979-cac544181be8?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <ServiceSection
        id="live-darshan"
        title="Live Darshan"
        subtitle="Watch live temple darshan and divine blessings from sacred places"
        icon="fas fa-video"
        description="Experience the divine presence through our live streaming of temple darshan from renowned spiritual centers. Join thousands of devotees in real-time worship and receive blessings from sacred deities."
        features={[
          "Live streaming from major temples",
          "HD quality video streaming",
          "Real-time aarti and ceremonies"
        ]}
        buttonText="Watch Live Darshan"
        onButtonClick={() => handleServiceClick('live-darshan')}
        imageUrl="https://images.unsplash.com/photo-1758467746090-06bd59666c50?q=80&w=659&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

        imageIcon="fas fa-video"
        imageText="Live Divine Darshan"
        reverse={true}
      />
      <ServiceSection
        id="bhakti-store"
        title="Bhakti Store"
        subtitle="Sacred items, books, and spiritual offerings for your journey"
        icon="fas fa-store"
        description="Discover a curated collection of spiritual items, sacred books, meditation tools, and devotional offerings. Each item is carefully selected to enhance your spiritual practice."
        features={[
          "Sacred idols and deities",
          "Spiritual books and scriptures",
          "Meditation and yoga accessories",
          "Incense, candles, and offerings"
        ]}
        buttonText="Visit Store"
        onButtonClick={() => navigate('/bhakti-store')}
        imageUrl="https://images.unsplash.com/photo-1693749390308-a50fe528479a?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        reverse={true}
      />
      <ServiceSection
        id="bhakti-yoga"
        title="Bhakti Yoga"
        subtitle="Yoga practices that connect body, mind, and spirit"
        icon="fas fa-spa"
        description="Experience the transformative power of Bhakti Yoga, where physical postures meet spiritual devotion. Our classes combine traditional yoga with devotional practices for complete spiritual growth."
        features={[
          "Traditional Hatha Yoga",
          "Devotional chanting and mantras",
          "Meditation and pranayama",
          "Spiritual philosophy integration"
        ]}
        buttonText="Join Yoga Classes"
        onButtonClick={() => handleServiceClick('bhakti-yoga')}
        imageUrl="https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&w=800&q=80"
      />
      <ServiceSection
        id="services"
        title="Other Upcoming Services"
        subtitle="Stay tuned with us for upcoming services like..."
        // icon="fas fa-heart"
        // description="We offer a complete range of spiritual services to support your journey of devotion and self-discovery. From individual counseling to group sessions, we provide guidance for every aspect of your spiritual growth."
        features={[
          "AI Astrology & Daily Horoscope: Integrate personalized Kundli/Birth Chart analysis, daily \"Shubh Muhurat\" (auspicious timings), and AI-driven personalized remedies.",
          "Virtual \"Seva\" & Charity: Allow users to perform Gau Seva (cow feeding), Brahmin Bhojan, or donate to specific temple renovation projects with digital certificates and video proof.",
          "Subscription-based \"Nirantar Chadhava\": Automated weekly or monthly offerings (flowers/sweets) made in the user's name at a chosen temple.",
          "Spiritual Content Feed: Short-form video content including Kathas, daily mantras, and explanations of Hindu rituals to educate younger users."
        ]} 
        imageUrl="https://plus.unsplash.com/premium_photo-1732489895154-3772980b2a43?q=80&w=1471&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"

        reverse={true}
      />
      <Contact />
    </div>
  );
};

export default Home;
