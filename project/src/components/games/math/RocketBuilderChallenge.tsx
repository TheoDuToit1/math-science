import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';

interface RocketPart {
  id: string;
  name: string;
  riddle: string;
  answer: number;
  image: string;
  unlocked: boolean;
}

const RocketBuilderChallenge: React.FC = () => {
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [currentPartIndex, setCurrentPartIndex] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [rocketComplete, setRocketComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [launchInProgress, setLaunchInProgress] = useState(false);
  
  // Rocket parts with riddles
  const initialParts: RocketPart[] = [
    {
      id: 'base',
      name: 'Rocket Base',
      riddle: "I'm a number with 4 hundreds, 3 tens, and 2 ones. What am I?",
      answer: 432,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'body',
      name: 'Rocket Body',
      riddle: "I'm a number with 2 hundreds, 0 tens, and 5 ones. What am I?",
      answer: 205,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'cone',
      name: 'Rocket Cone',
      riddle: "I'm a number with 3 hundreds, 7 tens, and 0 ones. What am I?",
      answer: 370,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'boosters',
      name: 'Rocket Boosters',
      riddle: "I'm a number with 6 hundreds, 2 tens, and 4 ones. What am I?",
      answer: 624,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'engines',
      name: 'Rocket Engines',
      riddle: "I'm a number with 5 hundreds, 0 tens, and 9 ones. What am I?",
      answer: 509,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'fuel',
      name: 'Rocket Fuel',
      riddle: "I'm a number with 8 hundreds, 4 tens, and 0 ones. What am I?",
      answer: 840,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'wings',
      name: 'Rocket Wings',
      riddle: "I'm a number with 7 hundreds, 0 tens, and 6 ones. What am I?",
      answer: 706,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'antenna',
      name: 'Rocket Antenna',
      riddle: "I'm a number with 1 hundred, 5 tens, and 0 ones. What am I?",
      answer: 150,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'windows',
      name: 'Rocket Windows',
      riddle: "I'm a number with 9 hundreds, 2 tens, and 3 ones. What am I?",
      answer: 923,
      image: '🚀',
      unlocked: false
    },
    {
      id: 'door',
      name: 'Rocket Door',
      riddle: "I'm a number with 3 hundreds, 0 tens, and 8 ones. What am I?",
      answer: 308,
      image: '🚀',
      unlocked: false
    }
  ];
  
  // Track unlocked parts
  const [parts, setParts] = useState<RocketPart[]>(initialParts);
  
  // Current part
  const currentPart = parts[currentPartIndex];
  
  // Handle answer submission
  const handleSubmit = () => {
    // Convert answer to number
    const numAnswer = parseInt(userAnswer);
    
    // Check if answer is correct
    const correct = numAnswer === currentPart.answer;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      // Play success sound
      try {
        new Audio('/audio/correct.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      // Update part status
      const updatedParts = [...parts];
      updatedParts[currentPartIndex].unlocked = true;
      setParts(updatedParts);
      
      // Move to next part after delay
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer('');
        
        // Check if all parts are unlocked
        if (currentPartIndex < parts.length - 1) {
          setCurrentPartIndex(currentPartIndex + 1);
        } else {
          setRocketComplete(true);
          setShowConfetti(true);
          // Start countdown after rocket is complete
          startCountdown();
        }
      }, 2000);
    } else {
      // Play error sound
      try {
        new Audio('/audio/incorrect.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      // Reset after delay
      setTimeout(() => {
        setShowFeedback(false);
      }, 2000);
    }
  };
  
  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    // Only allow numbers
    const value = e.target.value.replace(/[^0-9]/g, '');
    setUserAnswer(value);
    
    // Play click sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };
  
  // Start countdown for rocket launch
  const startCountdown = () => {
    setCountdown(3);
  };
  
  // Handle countdown effect
  useEffect(() => {
    if (countdown === null) return;
    
    if (countdown > 0) {
      // Play countdown sound
      try {
        new Audio('/audio/pop.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      
      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Launch the rocket
      setLaunchInProgress(true);
      
      // Play launch sound
      try {
        new Audio('/audio/cheer.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
  }, [countdown]);
  
  return (
    <div className="flex flex-col items-center p-4">
      {showConfetti && <ConfettiEffect />}
      
      <h2 className="text-2xl font-bold mb-2">Rocket Builder Challenge</h2>
      
      <div className="text-center mb-6">
        <p className="text-lg font-medium">Build your rocket by solving place value riddles!</p>
        <p className="text-sm text-gray-600 mb-4">Unlock all parts to launch your rocket</p>
      </div>
      
      {/* Rocket display */}
      <div className="relative w-64 h-96 mb-8">
        {/* Base */}
        <motion.div 
          className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 text-6xl ${parts[0].unlocked ? 'opacity-100' : 'opacity-30'}`}
          animate={launchInProgress ? { y: -500, opacity: 0 } : {}}
          transition={{ duration: 3, ease: "easeInOut" }}
        >
          🚀
        </motion.div>
        
        {/* Flames when launching */}
        {launchInProgress && (
          <motion.div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 2] }}
            transition={{ duration: 1, repeat: 3 }}
          >
            <div className="text-6xl">🔥</div>
          </motion.div>
        )}
        
        {/* Countdown display */}
        {countdown !== null && countdown > 0 && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-7xl font-bold text-red-600"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            key={countdown}
          >
            {countdown}
          </motion.div>
        )}
        
        {/* Launch text */}
        {countdown === 0 && !launchInProgress && (
          <motion.div
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-5xl font-bold text-red-600"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1.5, opacity: 1 }}
          >
            LAUNCH!
          </motion.div>
        )}
      </div>
      
      {/* Progress indicator */}
      <div className="flex justify-center gap-2 mb-6">
        {parts.map((part, index) => (
          <div 
            key={part.id}
            className={`w-8 h-8 rounded-full ${
              currentPartIndex === index 
                ? 'bg-blue-500' 
                : part.unlocked 
                  ? 'bg-green-500' 
                  : 'bg-gray-300'
            } flex items-center justify-center text-white font-bold`}
          >
            {index + 1}
          </div>
        ))}
      </div>
      
      {/* Riddle and answer section */}
      {!rocketComplete && !launchInProgress && (
        <div className="bg-blue-50 rounded-xl p-6 max-w-md">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold mb-2">{currentPart.name}</h3>
            <p className="text-lg">{currentPart.riddle}</p>
          </div>
          
          {/* Answer input */}
          <div className="mb-4">
            <div className="flex justify-center gap-4 mb-4">
              <div className="flex flex-col items-center">
                <div className="text-sm mb-1">Hundreds</div>
                <input
                  type="text"
                  maxLength={1}
                  value={userAnswer.length >= 3 ? userAnswer.charAt(userAnswer.length - 3) : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 1) {
                      const newAnswer = userAnswer.length >= 3 
                        ? userAnswer.substring(0, userAnswer.length - 3) + value + userAnswer.substring(userAnswer.length - 2)
                        : value.padEnd(3, '0');
                      setUserAnswer(newAnswer);
                    }
                  }}
                  className="w-16 h-16 bg-blue-500 text-white rounded-lg text-center text-2xl font-bold"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm mb-1">Tens</div>
                <input
                  type="text"
                  maxLength={1}
                  value={userAnswer.length >= 2 ? userAnswer.charAt(userAnswer.length - 2) : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 1) {
                      const newAnswer = userAnswer.length >= 2
                        ? userAnswer.substring(0, userAnswer.length - 2) + value + userAnswer.substring(userAnswer.length - 1)
                        : value.padEnd(2, '0');
                      setUserAnswer(newAnswer);
                    }
                  }}
                  className="w-16 h-16 bg-red-500 text-white rounded-lg text-center text-2xl font-bold"
                />
              </div>
              
              <div className="flex flex-col items-center">
                <div className="text-sm mb-1">Ones</div>
                <input
                  type="text"
                  maxLength={1}
                  value={userAnswer.length >= 1 ? userAnswer.charAt(userAnswer.length - 1) : ''}
                  onChange={(e) => {
                    const value = e.target.value.replace(/[^0-9]/g, '');
                    if (value.length <= 1) {
                      const newAnswer = userAnswer.length >= 1
                        ? userAnswer.substring(0, userAnswer.length - 1) + value
                        : value;
                      setUserAnswer(newAnswer);
                    }
                  }}
                  className="w-16 h-16 bg-green-500 text-white rounded-lg text-center text-2xl font-bold"
                />
              </div>
            </div>
            
            <div className="text-center text-xl font-bold mb-4">
              Your answer: {userAnswer || '___'}
            </div>
          </div>
          
          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!userAnswer}
            className={`w-full py-3 rounded-lg font-bold ${
              userAnswer 
                ? 'bg-green-500 text-white hover:bg-green-600' 
                : 'bg-gray-300 text-gray-500 cursor-not-allowed'
            }`}
          >
            Check Answer
          </button>
        </div>
      )}
      
      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-3 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} max-w-md text-center`}
        >
          <div className="text-xl font-bold mb-2">
            {isCorrect ? '✓ Correct!' : '✗ Try Again'}
          </div>
          {isCorrect && (
            <div>You unlocked the {currentPart.name}!</div>
          )}
          {!isCorrect && (
            <div>Check your place values carefully.</div>
          )}
        </motion.div>
      )}
      
      {/* Rocket complete message */}
      {rocketComplete && !launchInProgress && countdown === null && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 bg-blue-100 text-blue-800 rounded-lg max-w-md text-center"
        >
          <div className="text-2xl font-bold mb-2">
            Rocket Complete! 🎉
          </div>
          <div className="mb-4">
            You've built all parts of the rocket!
          </div>
          <button
            onClick={startCountdown}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg font-bold hover:bg-blue-600"
          >
            Launch Rocket
          </button>
        </motion.div>
      )}
      
      {/* Launch success message */}
      {launchInProgress && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-6 bg-green-100 text-green-800 rounded-lg max-w-md text-center"
        >
          <div className="text-2xl font-bold mb-2">
            Liftoff! 🚀
          </div>
          <div>
            Your rocket is heading to space!
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default RocketBuilderChallenge; 