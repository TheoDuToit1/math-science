import React, { useRef, useEffect, useState } from 'react';

// Sound effect types that can be played
export type SoundEffect = 
  | 'correct' 
  | 'wrong' 
  | 'snap' 
  | 'fail' 
  | 'win' 
  | 'start_warmup' 
  | 'start_core' 
  | 'myth_bust' 
  | 'wrap_up' 
  | 'click' 
  | 'bg_loop'
  | 'pop'
  | 'cheer'
  | 'incorrect'
  | 'complete'
  | 'powerup'
  | 'success'
  | 'error'
  | 'correct-6033';

// Props for the component
interface SoundPlayerProps {
  soundEnabled?: boolean;
  onSoundToggle?: (enabled: boolean) => void;
  volume?: number;
  sound?: string;
  autoPlay?: boolean;
}

// Component that manages and plays sounds
const SoundPlayer: React.FC<SoundPlayerProps> = ({ 
  soundEnabled = true,
  onSoundToggle,
  volume = 0.5,
  sound,
  autoPlay = false
}) => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(soundEnabled);
  
  // We need to create audio objects for each sound effect
  const audioRefs = useRef<{[key in SoundEffect]?: HTMLAudioElement}>({});
  const customAudioRef = useRef<HTMLAudioElement | null>(null);
  
  // Sound URLs - using local audio files
  const soundUrls: {[key in SoundEffect]: string} = {
    // Primary sound effects from our new audio files
    correct: '/audio/correct.mp3',
    wrong: '/audio/wrong.mp3',
    snap: '/audio/snap.mp3',
    fail: '/audio/fail.mp3',
    win: '/audio/win.mp3',
    start_warmup: '/audio/start_warmup.mp3',
    start_core: '/audio/start_core.mp3',
    myth_bust: '/audio/myth_bust.mp3',
    wrap_up: '/audio/wrap_up.mp3',
    click: '/audio/click.mp3',
    bg_loop: '/audio/bg_loop.mp3',
    'correct-6033': '/audio/correct-6033.mp3',
    
    // Legacy mappings for backward compatibility
    pop: '/audio/click.mp3',
    cheer: '/audio/win.mp3',
    incorrect: '/audio/wrong.mp3',
    complete: '/audio/win.mp3',
    powerup: '/audio/start_core.mp3',
    success: '/audio/correct.mp3',
    error: '/audio/wrong.mp3'
  };
  
  // Initialize audio objects on first render
  useEffect(() => {
    // Create an audio element for each sound
    Object.keys(soundUrls).forEach((key) => {
      const soundType = key as SoundEffect;
      const audio = new Audio(soundUrls[soundType]);
      audio.preload = 'auto';
      audio.volume = volume;
      audioRefs.current[soundType] = audio;
    });
    
    // Cleanup function to remove audio objects
    return () => {
      Object.keys(audioRefs.current).forEach(key => {
        const soundType = key as SoundEffect;
        if (audioRefs.current[soundType]) {
          audioRefs.current[soundType]!.pause();
          audioRefs.current[soundType] = undefined;
        }
      });
      
      if (customAudioRef.current) {
        customAudioRef.current.pause();
        customAudioRef.current = null;
      }
    };
  }, [volume]);
  
  // Handle custom sound file
  useEffect(() => {
    if (sound && isSoundEnabled) {
      const audio = new Audio(sound);
      audio.volume = volume;
      customAudioRef.current = audio;
      
      if (autoPlay) {
        audio.play().catch(e => console.log('Error playing custom sound:', e));
      }
      
      return () => {
        if (customAudioRef.current) {
          customAudioRef.current.pause();
          customAudioRef.current = null;
        }
      };
    }
  }, [sound, isSoundEnabled, autoPlay, volume]);
  
  // Update volume when it changes
  useEffect(() => {
    Object.keys(audioRefs.current).forEach(key => {
      const soundType = key as SoundEffect;
      if (audioRefs.current[soundType]) {
        audioRefs.current[soundType]!.volume = volume;
      }
    });
    
    if (customAudioRef.current) {
      customAudioRef.current.volume = volume;
    }
  }, [volume]);
  
  // Update sound enabled state
  useEffect(() => {
    setIsSoundEnabled(soundEnabled);
  }, [soundEnabled]);
  
  // Function to toggle sound
  const toggleSound = () => {
    const newState = !isSoundEnabled;
    setIsSoundEnabled(newState);
    if (onSoundToggle) onSoundToggle(newState);
  };
  
  // Function to play a sound
  const playSound = (sound: SoundEffect) => {
    if (isSoundEnabled && audioRefs.current[sound]) {
      // Reset the audio to start from the beginning
      const audio = audioRefs.current[sound]!;
      audio.currentTime = 0;
      audio.play().catch(e => console.log('Error playing sound:', e));
    }
  };
  
  // Expose the play function to the global window object
  React.useEffect(() => {
    // Add to window for global access
    (window as any).playGameSound = playSound;
    
    return () => {
      // Clean up
      delete (window as any).playGameSound;
    };
  }, [isSoundEnabled]);
  
  // This component doesn't render anything visible
  return null;
};

// Helper hook to make it easier to play sounds from other components
export const useSound = () => {
  const playSound = (sound: SoundEffect) => {
    // Call the global function if it exists
    if ((window as any).playGameSound) {
      (window as any).playGameSound(sound);
    }
  };
  
  return { playSound };
};

// Helper function to play sound effects directly
export const playSoundEffect = (sound: SoundEffect) => {
  if ((window as any).playGameSound) {
    (window as any).playGameSound(sound);
  }
};

export default SoundPlayer; 