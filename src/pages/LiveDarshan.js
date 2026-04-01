import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import PageBackground from '../components/PageBackground';
import './LiveDarshan.css';

const LiveDarshan = () => {
  const [selectedTemple, setSelectedTemple] = useState(null);

  const imageUrl = 'https://images.unsplash.com/photo-1536570729710-552e7eb8ff1c?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D';

  // Hardcoded temple data (can be moved to backend later)
  const temples = [
    {
      id: 'puri-jagannath',
      name: 'Puri Jagannath Temple (Source:Jai Jagannath TV)',
      location: 'Puri, Odisha',
      streamUrl: 'https://www.youtube.com/embed/live_stream?channel=UCET-LB-LgAuDS-Cy8nfH4-w',
      thumbnail: 'https://i.ytimg.com/vi/sMNef0oH280/maxresdefault.jpg',
    },
    {
      id: 'kashi-vishwanath',
      name: 'Kashi Vishwanath Temple',
      location: 'Varanasi, Uttar Pradesh',
      streamUrl: 'https://www.youtube.com/embed/eVVZiksNkB0',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/b/b0/Ganga_Dwar%2C_Gateway_of_Corridor_of_Kashi_Vishwanath_Temple%2C_Varanasi_2.webp',
    },
    {
      id: 'shirdi-sai',
      name: 'Shirdi Sai Baba Temple',
      location: 'Shirdi, Maharashtra',
      streamUrl: 'https://cam3.pc.cdn.bitgravity.com/cam/live/feed006/Saibaba/temple/feed/playlist.m3u8?e=1767013600&h=ef49a77dd9ce1794c9532871df3fc3a2',
      thumbnail: 'https://i.ytimg.com/vi/5K16QTKb8WU/maxresdefault.jpg',

    },
    {
      id: 'somnath-temple',
      name: 'Somnath Temple',
      location: 'Veraval, Gujarat',
      streamUrl: 'https://www.youtube.com/embed/k5gw-4H05-4',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/1/10/Somanath_mandir_%28cropped%29.jpg',
    },
    {
      id: 'vaishno-devi',
      name: 'Vaishno Devi Temple',
      location: 'Katra, Jammu & Kashmir',
      streamUrl: 'https://www.youtube.com/embed/v_S71-z4iS4',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/7/7e/Mata_vaishno_devi_pindi_photo.jpg',
    },
    {
      id: 'golden-temple',
      name: 'Golden Temple (Harmandir Sahib)',
      location: 'Amritsar, Punjab',
      streamUrl: 'https://www.youtube.com/embed/fwM92Grnzo8',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/94/The_Golden_Temple_of_Amrithsar_7.jpg/960px-The_Golden_Temple_of_Amrithsar_7.jpg',
    },
    {
      id: 'tirupati-balaji',
      name: 'Tirupati Balaji Temple',
      location: 'Tirupati, Andhra Pradesh',
      streamUrl: 'https://www.youtube.com/embed/L134f3_Uv4U',
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Tirumala_090615.jpg/1920px-Tirumala_090615.jpg',
    },
    {
      id: 'rameshwaram',
      name: 'Rameshwaram Temple',
      location: 'Rameshwaram, Tamil Nadu',
      streamUrl: 'https://cdn1.itekrfid.com/hls/local/index.m3u8', // Note: This is a high-quality darshan video, as a consistent 24/7 live stream is not always available.
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/84/Ramanathaswamy_temple7.JPG/1280px-Ramanathaswamy_temple7.JPG',
    },
    {
      id: 'Vitthal-Rukmini',
      name: 'Vitthal-RukminiTemple',
      location: 'Vitthal-Rukmini, Pandharpur, Maharashtra',
      streamUrl: 'https://cdn1.itekrfid.com/hls/local/index.m3u8', // Note: This is a high-quality darshan video, as a consistent 24/7 live stream is not always available.
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/2/21/Pandharpur_2013_Aashad_-_panoramio_%2810%29_%28cropped%29.jpg',
    },
    {
      id: 'Dwarkadhish',
      name: 'Dwarkadhish Temple',
      location: 'Dwarka, Gujurat',
      streamUrl: 'https://www.youtube.com/embed/kh240Izqlzg', // Note: This is a high-quality darshan video, as a consistent 24/7 live stream is not always available.
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/0/0c/Dwarakadheesh_Temple%2C_2014.jpg',
    },
    {
      id: 'Sidhhivinayak',
      name: 'Sidhhivinayak Temple',
      location: 'Mumbai, Maharashtra',
      streamUrl: 'https://www.youtube.com/embed/V1vzPmTvq6w', // Note: This is a high-quality darshan video, as a consistent 24/7 live stream is not always available.
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/f/f5/Img-07_Sri_Siddhivinayak_Jagdish_Mali.tif/lossy-page1-1280px-Img-07_Sri_Siddhivinayak_Jagdish_Mali.tif.jpg',
    },
    {
      id: 'ISKCON-Vrindavan',
      name: 'ISKCON Temple',
      location: 'Vrindavan, UP',
      streamUrl: 'https://www.youtube.com/embed/aGYD7FOdurk', // Note: This is a high-quality darshan video, as a consistent 24/7 live stream is not always available.
      thumbnail: 'https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Vrindavan%2C_India_%2821178969102%29.jpg/960px-Vrindavan%2C_India_%2821178969102%29.jpg',
    }
  ];

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  // Close player when Escape key is pressed
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        setSelectedTemple(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);


  return (
    <div className="live-darshan-page">
      <PageBackground imageUrl={imageUrl} />

      <div className="darshan-page-header">
        <div className="container-header">
          <h1>Live Darshan</h1>
          <p>Experience the divine presence from sacred temples across India, live and direct.</p>
        </div>
      </div>

      <div className="darshan-main-content">
        <div className="container">
          <motion.div
            className="temples-grid"
            initial="hidden"
            animate="visible"
            variants={{
              visible: { transition: { staggerChildren: 0.1 } }
            }}
          >
            {temples.map((temple) => (
              <motion.div
                key={temple.id}
                className="temple-card"
                onClick={() => setSelectedTemple(temple)}
                variants={{
                  hidden: { opacity: 0, y: 30 },
                  visible: { opacity: 1, y: 0 }
                }}
                whileHover={{ scale: 1.05 }}
                layoutId={`card-${temple.id}`} // For smooth animation
              >
                <img src={temple.thumbnail} alt={temple.name} className="card-thumbnail" />
                <div className="card-overlay"></div>
                <div className="card-content">
                  <h3>{temple.name}</h3>
                  <p>{temple.location}</p>
                </div>
                <div className="live-indicator">
                  <span className="live-dot"></span>LIVE
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </div>

      {/* --- MODAL FOR THE VIDEO PLAYER --- */}
      <AnimatePresence>
        {selectedTemple && (
          <motion.div
            className="stream-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div className="stream-modal-content" layoutId={`card-${selectedTemple.id}`}>
              <div className="video-container">
                <iframe
                  src={`${selectedTemple.streamUrl}?autoplay=1&mute=0&modestbranding=1`}
                  title={`Live Darshan - ${selectedTemple.name}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                ></iframe>
              </div>
              <div className="stream-info">
                <h2>{selectedTemple.name}</h2>
                <p>{selectedTemple.location}</p>
              </div>
            </motion.div>
            <button className="close-stream-btn" onClick={() => setSelectedTemple(null)}>
              <i className="fas fa-times"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LiveDarshan;