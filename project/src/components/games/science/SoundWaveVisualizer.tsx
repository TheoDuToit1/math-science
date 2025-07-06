import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface SoundItem {
  id: string;
  label: string;
  audioSrc: string;
  waveType: 'tight' | 'medium' | 'wide';
  icon: string;
}

interface WaveOption {
  id: string;
  type: 'tight' | 'medium' | 'wide';
}

const SoundWaveVisualizer: React.FC = () => {
  const [currentAudio, setCurrentAudio] = useState<HTMLAudioElement | null>(null);
  const [draggedWave, setDraggedWave] = useState<string | null>(null);
  const [matches, setMatches] = useState<Record<string, string>>({});
  const [feedback, setFeedback] = useState<{id: string, correct: boolean} | null>(null);
  const [completed, setCompleted] = useState(false);

  const soundItems: SoundItem[] = [
    { 
      id: 'whistle', 
      label: 'Whistle', 
      audioSrc: '/images/science/s4_secret_sound_journey/old-train-steam-whistle-256872.mp3',
      waveType: 'tight',
      icon: '/images/science/s4_secret_sound_journey/whistle.png',
    },
    { 
      id: 'drum', 
      label: 'Drum', 
      audioSrc: '/images/science/s4_secret_sound_journey/alarm-clock-short-6402.mp3',
      waveType: 'wide',
      icon: '/images/science/s4_secret_sound_journey/drum.png',
    },
    { 
      id: 'guitar', 
      label: 'Guitar', 
      audioSrc: '/images/science/s4_secret_sound_journey/cat-meow-6226.mp3', // placeholder, update if you have a guitar sound
      waveType: 'medium',
      icon: '/images/science/s4_secret_sound_journey/guitar.png',
    },
  ];

  const waveOptions: WaveOption[] = [
    { id: 'tight-wave', type: 'tight' },
    { id: 'medium-wave', type: 'medium' },
    { id: 'wide-wave', type: 'wide' },
  ];

  const playSound = (src: string) => {
    if (currentAudio) {
      currentAudio.pause();
      currentAudio.currentTime = 0;
    }
    const audio = new Audio(src);
    audio.play();
    setCurrentAudio(audio);
  };

  const handleDragStart = (waveId: string) => {
    setDraggedWave(waveId);
  };

  const handleDrop = (soundId: string) => {
    if (!draggedWave) return;
    
    const waveType = waveOptions.find(w => w.id === draggedWave)?.type;
    const soundItem = soundItems.find(s => s.id === soundId);
    
    if (waveType && soundItem) {
      const isCorrect = waveType === soundItem.waveType;
      setMatches(prev => ({...prev, [soundId]: draggedWave}));
      setFeedback({id: soundId, correct: isCorrect});
      
      // Play feedback sound
      playSound(isCorrect ? '/audio/correct.mp3' : '/audio/incorrect.mp3');
      
      setTimeout(() => {
        setFeedback(null);
        
        // Check if all matches are correct
        const allMatched = soundItems.every(item => {
          const matchedWaveId = matches[item.id];
          if (!matchedWaveId) return false;
          const matchedWave = waveOptions.find(w => w.id === matchedWaveId);
          return matchedWave?.type === item.waveType;
        });
        
        if (allMatched && Object.keys(matches).length === soundItems.length) {
          setCompleted(true);
          playSound('/audio/cheer.mp3');
        }
      }, 1500);
    }
    
    setDraggedWave(null);
  };

  const renderWaveShape = (type: 'tight' | 'medium' | 'wide', size: 'sm' | 'lg' = 'lg') => {
    const height = size === 'lg' ? 60 : 30;
    const width = size === 'lg' ? 120 : 60;
    
    const getPath = () => {
      switch (type) {
        case 'tight':
          return `M0,${height/2} ${Array(8).fill(0).map((_, i) => 
            `Q${width*(i+0.25)/8},${i%2===0 ? 0 : height} ${width*(i+0.5)/8},${height/2}`
          ).join(' ')} L${width},${height/2}`;
        case 'medium':
          return `M0,${height/2} ${Array(4).fill(0).map((_, i) => 
            `Q${width*(i+0.25)/4},${i%2===0 ? 0 : height} ${width*(i+0.5)/4},${height/2}`
          ).join(' ')} L${width},${height/2}`;
        case 'wide':
          return `M0,${height/2} ${Array(2).fill(0).map((_, i) => 
            `Q${width*(i+0.25)/2},${i%2===0 ? 0 : height} ${width*(i+0.5)/2},${height/2}`
          ).join(' ')} L${width},${height/2}`;
      }
    };

    return (
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`}>
        <path d={getPath()} fill="none" stroke="#3B82F6" strokeWidth="3" />
      </svg>
    );
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold text-center mb-4">Sound Wave Visualizer</h3>
      
      <div className="mb-6">
        <p className="text-center mb-4">Drag the correct sound wave shape to match each sound.</p>
      </div>

      {completed ? (
        <div className="bg-green-100 p-4 rounded-lg text-center">
          <h3 className="text-xl font-bold text-green-800 mb-2">Great job! 🎉</h3>
          <p>You've matched all sound waves correctly!</p>
          <p className="mt-2">High pitch sounds (like whistles) make tight waves.</p>
          <p>Low pitch sounds (like drums) make wide waves.</p>
        </div>
      ) : (
        <>
          <div className="flex justify-center mb-6">
            <div className="grid grid-cols-3 gap-4">
              {waveOptions.map(wave => (
                <motion.div
                  key={wave.id}
                  className={`p-3 bg-blue-50 rounded-lg cursor-grab flex flex-col items-center ${
                    Object.values(matches).includes(wave.id) ? 'opacity-50' : ''
                  }`}
                  draggable
                  onDragStart={() => handleDragStart(wave.id)}
                  whileHover={{ scale: 1.05 }}
                >
                  {renderWaveShape(wave.type)}
                  <div className="mt-2 text-sm font-medium text-gray-700">
                    {wave.type === 'tight' ? 'Tight Waves' : 
                     wave.type === 'medium' ? 'Medium Waves' : 'Wide Waves'}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            {soundItems.map(item => (
              <div 
                key={item.id}
                className={`p-4 border-2 rounded-lg flex items-center justify-between ${
                  feedback?.id === item.id 
                    ? feedback.correct ? 'border-green-500 bg-green-50' : 'border-red-500 bg-red-50'
                    : matches[item.id] ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
                }`}
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(item.id)}
              >
                <div className="flex items-center">
                  <img src={item.icon} alt={item.label} className="w-10 h-10 mr-2" />
                  <div>
                    <h4 className="font-bold">{item.label}</h4>
                    <button 
                      className="ml-2 w-8 h-8 bg-gray-200 text-indigo-700 rounded-full flex items-center justify-center"
                      onClick={() => playSound(item.audioSrc)}
                    >
                      <span className="material-icons">play_arrow</span>
                    </button>
                  </div>
                </div>

                <div className="w-32 h-16 border border-dashed border-gray-400 rounded flex items-center justify-center">
                  {matches[item.id] ? (
                    <div className="flex flex-col items-center">
                      {renderWaveShape(waveOptions.find(w => w.id === matches[item.id])?.type || 'medium', 'sm')}
                    </div>
                  ) : (
                    <span className="text-gray-400">Drop wave here</span>
                  )}
                </div>

                {feedback?.id === item.id && (
                  <div className={`ml-2 ${feedback.correct ? 'text-green-600' : 'text-red-600'}`}>
                    {feedback.correct ? '✓ Correct!' : '✗ Try again'}
                  </div>
                )}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default SoundWaveVisualizer; 