import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface SoundOption {
  id: string;
  label: string;
  audioSrc: string;
  icon: string;
}

const SoundDetective: React.FC = () => {
  const [options, setOptions] = useState<SoundOption[]>([]);
  const [currentSound, setCurrentSound] = useState<SoundOption | null>(null);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [rounds, setRounds] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);

  const soundOptions: SoundOption[] = [
    { 
      id: 'cat', 
      label: 'Cat Meow', 
      audioSrc: '/images/science/s4_secret_sound_journey/cat-meow-6226.mp3',
      icon: '🐱'
    },
    { 
      id: 'train', 
      label: 'Train Whistle', 
      audioSrc: '/images/science/s4_secret_sound_journey/old-train-steam-whistle-256872.mp3',
      icon: '🚂'
    },
    { 
      id: 'rain', 
      label: 'Raindrops', 
      audioSrc: '/images/science/s4_secret_sound_journey/rain-on-concrete-sound-30331.mp3',
      icon: '🌧️'
    },
    { 
      id: 'alarm', 
      label: 'Alarm Clock', 
      audioSrc: '/images/science/s4_secret_sound_journey/alarm-clock-short-6402.mp3',
      icon: '⏰'
    },
  ];

  // Initialize game with shuffled sounds
  useEffect(() => {
    startNewRound();
  }, []);

  const shuffleArray = <T extends unknown>(array: T[]): T[] => {
    const newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
  };

  const startNewRound = () => {
    const shuffled = shuffleArray(soundOptions);
    setOptions(shuffled);
    setCurrentSound(shuffled[0]);
    setSelectedOption(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  const playSound = (src: string) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
    const audio = new Audio(src);
    audioRef.current = audio;
    audio.play();
  };

  const handleOptionClick = (optionId: string) => {
    if (selectedOption !== null || showFeedback) return;
    
    setSelectedOption(optionId);
    const correct = optionId === currentSound?.id;
    setIsCorrect(correct);
    
    // Play feedback sound
    playSound(correct ? '/audio/correct.mp3' : '/audio/incorrect.mp3');
    
    // Show feedback
    setShowFeedback(true);
    
    // Update score
    if (correct) {
      setScore(score + 1);
    }
    
    // Move to next round after delay
    setTimeout(() => {
      setRounds(rounds + 1);
      if (rounds < 3) {
        startNewRound();
      }
    }, 2000);
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold text-center mb-4">Sound Detective</h3>
      
      <div className="mb-6">
        <p className="text-center mb-4">Listen to the mystery sound and guess what it is!</p>
      </div>

      {rounds < 4 ? (
        <>
          <div className="flex justify-center mb-6">
            <button
              className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-full flex items-center justify-center"
              onClick={() => currentSound && playSound(currentSound.audioSrc)}
            >
              <span className="material-icons mr-2">volume_up</span>
              Play Mystery Sound
            </button>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-6">
            {options.map(option => (
              <motion.button
                key={option.id}
                className={`p-4 border-2 rounded-lg flex flex-col items-center justify-center ${
                  selectedOption === option.id 
                    ? isCorrect 
                      ? 'border-green-500 bg-green-50' 
                      : 'border-red-500 bg-red-50'
                    : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'
                }`}
                onClick={() => handleOptionClick(option.id)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                disabled={selectedOption !== null || showFeedback}
              >
                <span className="text-4xl mb-2">{option.icon}</span>
                <span className="font-medium">{option.label}</span>
              </motion.button>
            ))}
          </div>

          {showFeedback && (
            <motion.div
              className={`p-4 rounded-lg text-center ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <span className="text-2xl mr-2">
                {isCorrect ? '🎉' : '😢'}
              </span>
              <span className="font-bold">
                {isCorrect ? 'Correct!' : 'Try again!'}
              </span>
            </motion.div>
          )}

          <div className="mt-4 flex justify-between items-center">
            <div className="text-sm text-gray-600">
              Score: {score}/4
            </div>
            <div className="flex">
              {[...Array(4)].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full mx-1 ${
                    i < rounds ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
        </>
      ) : (
        <div className="bg-indigo-100 p-6 rounded-lg text-center">
          <h3 className="text-2xl font-bold mb-4">
            {score === 4 ? '🏆 Perfect Score!' : score >= 2 ? '🎉 Good Job!' : '👍 Nice Try!'}
          </h3>
          <p className="mb-4">You got {score} out of 4 sounds correct!</p>
          <p className="mb-6">Sound detectives use their ears to identify sounds all around them.</p>
          <button
            className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              setScore(0);
              setRounds(0);
              startNewRound();
            }}
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default SoundDetective; 