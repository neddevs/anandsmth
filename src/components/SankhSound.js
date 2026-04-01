import React, { useEffect, useRef } from 'react';

const SankhSound = ({ autoPlay = false, volume = 0.5, onPlay, onEnded }) => {
  const audioContextRef = useRef(null);
  const hasPlayedRef = useRef(false);

  // Generate Sankh sound using Web Audio API
  const generateSankhSound = () => {
    if (!audioContextRef.current) return;

    const audioContext = audioContextRef.current;
    const sampleRate = audioContext.sampleRate;
    const duration = 3; // 3 seconds for Sankh
    const buffer = audioContext.createBuffer(1, sampleRate * duration, sampleRate);
    const data = buffer.getChannelData(0);

    // Generate Sankh sound with characteristic frequencies
    for (let i = 0; i < buffer.length; i++) {
      const time = i / sampleRate;
      
      // Sankh has a deep, resonant sound
      let amplitude = 0;
      let frequency = 0;
      
      // Start with lower frequency and build up
      frequency = 80 + (time * 20); // Gradually increase from 80Hz to 140Hz
      amplitude = 0.8 * Math.exp(-time * 0.2);
      
      // Create the fundamental tone
      const fundamental = Math.sin(2 * Math.PI * frequency * time);
      
      // Add harmonics for richness
      const harmonic2 = Math.sin(2 * Math.PI * frequency * 2 * time) * 0.4;
      const harmonic3 = Math.sin(2 * Math.PI * frequency * 3 * time) * 0.2;
      const harmonic4 = Math.sin(2 * Math.PI * frequency * 4 * time) * 0.1;
      
      // Add some noise for the characteristic "wind" sound
      const noise = (Math.random() - 0.5) * 0.1 * amplitude;
      
      // Combine all components
      data[i] = (fundamental + harmonic2 + harmonic3 + harmonic4 + noise) * amplitude;
    }

    return buffer;
  };

  const playSankhSound = async () => {
    if (!audioContextRef.current || hasPlayedRef.current) return;

    try {
      const audioContext = audioContextRef.current;
      const buffer = generateSankhSound();
      const source = audioContext.createBufferSource();
      const gainNode = audioContext.createGain();

      source.buffer = buffer;
      gainNode.gain.value = volume;

      source.connect(gainNode);
      gainNode.connect(audioContext.destination);

      source.onended = () => {
        hasPlayedRef.current = true;
        onEnded && onEnded();
      };

      onPlay && onPlay();
      source.start();

    } catch (error) {
      console.log('Sankh sound play failed:', error);
    }
  };

  useEffect(() => {
    // Initialize audio context
    const initAudioContext = async () => {
      try {
        audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
        
        if (autoPlay && !hasPlayedRef.current) {
          // Wait a bit for the page to load
          setTimeout(() => {
            playSankhSound();
          }, 1000);
        }
      } catch (error) {
        console.log('Audio context initialization failed:', error);
      }
    };

    initAudioContext();

    // Enable audio on first user interaction
    const enableAudio = async () => {
      if (audioContextRef.current && audioContextRef.current.state === 'suspended') {
        await audioContextRef.current.resume();
      }
      
      if (autoPlay && !hasPlayedRef.current) {
        playSankhSound();
      }

      // Remove listeners after first interaction
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
  }, [autoPlay, volume, onPlay, onEnded]);

  return null; // This component doesn't render anything
};

export default SankhSound;