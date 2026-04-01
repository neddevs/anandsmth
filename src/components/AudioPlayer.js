import React, { useState, useEffect, useRef } from 'react';
import './AudioPlayer.css';

const AudioPlayer = ({ 
  src, 
  autoPlay = false, 
  volume = 0.7, 
  onPlay, 
  onEnded,
  showControls = false 
}) => {
  const audioRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);
  const [userInteracted, setUserInteracted] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Set volume
    audio.volume = volume;

    // Auto-play if enabled and user has interacted
    if (autoPlay && userInteracted && !hasPlayed) {
      playAudio();
    }

    const handlePlay = () => {
      setIsPlaying(true);
      onPlay && onPlay();
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setHasPlayed(true);
      onEnded && onEnded();
    };

    const handlePause = () => {
      setIsPlaying(false);
    };

    audio.addEventListener('play', handlePlay);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('pause', handlePause);

    return () => {
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('pause', handlePause);
    };
  }, [autoPlay, volume, userInteracted, hasPlayed, onPlay, onEnded]);

  // Enable audio on first user interaction
  useEffect(() => {
    const enableAudio = () => {
      setUserInteracted(true);
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };

    document.addEventListener('click', enableAudio);
    document.addEventListener('touchstart', enableAudio);
    document.addEventListener('keydown', enableAudio);

    return () => {
      document.removeEventListener('click', enableAudio);
      document.removeEventListener('touchstart', enableAudio);
      document.removeEventListener('keydown', enableAudio);
    };
  }, []);

  const playAudio = async () => {
    if (!audioRef.current || !userInteracted) return;
    
    try {
      await audioRef.current.play();
    } catch (error) {
      console.log('Audio play failed:', error);
    }
  };

  const pauseAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pauseAudio();
    } else {
      playAudio();
    }
  };

  return (
    <div className="audio-player">
      <audio
        ref={audioRef}
        src={src}
        preload="auto"
        loop={false}
      />
      
      {showControls && (
        <button 
          className="audio-control-btn"
          onClick={togglePlayPause}
          title={isPlaying ? 'Pause' : 'Play'}
        >
          <i className={`fas ${isPlaying ? 'fa-pause' : 'fa-play'}`}></i>
        </button>
      )}
    </div>
  );
};

export default AudioPlayer;













