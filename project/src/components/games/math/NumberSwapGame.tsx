import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Digit {
  id: string;
  value: number;
}

interface Challenge {
  digits: number[];
  goal: 'largest' | 'smallest';
}

const NumberSwapGame: React.FC = () => {
  const [digits, setDigits] = useState<Digit[]>([]);
  const [currentChallenge, setCurrentChallenge] = useState<Challenge | null>(null);
  const [draggedDigit, setDraggedDigit] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  
  // Challenges for each level
  const challenges: Challenge[] = [
    { digits: [3, 0, 4], goal: 'largest' },
    { digits: [5, 2, 0], goal: 'smallest' },
    { digits: [7, 0, 9, 1], goal: 'largest' },
    { digits: [8, 3, 0, 5], goal: 'smallest' },
    { digits: [6, 0, 2, 0, 4], goal: 'largest' },
    { digits: [9, 1, 0, 5, 0], goal: 'smallest' },
  ];
  
  // Initialize game
  useEffect(() => {
    startLevel(level);
  }, [level]);
  
  const startLevel = (levelNum: number) => {
    const challengeIndex = Math.min(levelNum - 1, challenges.length - 1);
    const challenge = challenges[challengeIndex];
    
    setCurrentChallenge(challenge);
    
    // Create digit objects with unique IDs
    const digitObjects = challenge.digits.map((d, i) => ({
      id: `digit-${i}`,
      value: d
    }));
    
    setDigits(digitObjects);
    setShowFeedback(false);
    setIsCorrect(false);
  };
  
  const handleDragStart = (digitId: string) => {
    setDraggedDigit(digitId);
  };
  
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };
  
  const handleDrop = (targetId: string) => {
    if (!draggedDigit || draggedDigit === targetId) {
      setDraggedDigit(null);
      return;
    }
    
    // Swap the digits
    const updatedDigits = [...digits];
    const draggedIndex = updatedDigits.findIndex(d => d.id === draggedDigit);
    const targetIndex = updatedDigits.findIndex(d => d.id === targetId);
    
    if (draggedIndex !== -1 && targetIndex !== -1) {
      // Swap positions
      [updatedDigits[draggedIndex], updatedDigits[targetIndex]] = 
        [updatedDigits[targetIndex], updatedDigits[draggedIndex]];
      
      setDigits(updatedDigits);
      
      // Play sound
      try {
        new Audio('/audio/pop.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
    
    setDraggedDigit(null);
  };
  
  const checkAnswer = () => {
    if (!currentChallenge) return;
    
    const currentNumber = Number(digits.map(d => d.value).join(''));
    
    // Calculate the correct answer
    const sortedDigits = [...currentChallenge.digits].sort((a, b) => 
      currentChallenge.goal === 'largest' ? b - a : a - b
    );
    
    // Handle leading zeros for smallest number
    if (currentChallenge.goal === 'smallest') {
      // Find first non-zero digit
      const firstNonZeroIndex = sortedDigits.findIndex(d => d !== 0);
      if (firstNonZeroIndex > 0) {
        // Swap first digit with first non-zero digit
        [sortedDigits[0], sortedDigits[firstNonZeroIndex]] = 
          [sortedDigits[firstNonZeroIndex], sortedDigits[0]];
      }
    }
    
    const correctNumber = Number(sortedDigits.join(''));
    
    const correct = currentNumber === correctNumber;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    // Play appropriate sound
    try {
      new Audio(correct ? '/audio/correct.mp3' : '/audio/incorrect.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
    
    if (correct) {
      setScore(prev => prev + 1);
      
      // Move to next level after delay
      setTimeout(() => {
        setShowFeedback(false);
        if (level < challenges.length) {
          setLevel(prev => prev + 1);
        } else {
          // Game completed
        }
      }, 2000);
    }
  };
  
  const resetGame = () => {
    setLevel(1);
    setScore(0);
    startLevel(1);
  };
  
  // Get color for digit based on value
  const getDigitColor = (value: number) => {
    switch (value) {
      case 0: return 'bg-gray-200 border-gray-400';
      case 1: case 2: case 3: return 'bg-blue-100 border-blue-300';
      case 4: case 5: case 6: return 'bg-green-100 border-green-300';
      case 7: case 8: case 9: return 'bg-red-100 border-red-300';
      default: return 'bg-gray-100 border-gray-300';
    }
  };
  
  // Render place value blocks
  const renderPlaceValueBlocks = () => {
    const number = Number(digits.map(d => d.value).join(''));
    const numDigits = digits.length;
    
    return (
      <div className="flex justify-center gap-2 mt-4">
        {digits.map((digit, i) => {
          const placeValue = Math.pow(10, numDigits - i - 1);
          const value = digit.value * placeValue;
          
          return (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-14 h-14 ${getDigitColor(digit.value)} rounded-lg flex items-center justify-center font-bold text-xl border-2`}>
                {digit.value}
              </div>
              <div className="text-xs mt-1">
                {digit.value} × {placeValue} = {value}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-2">Number Swap Game</h2>
      
      {currentChallenge && (
        <>
          <div className="text-center mb-6">
            <p className="text-lg font-medium">
              Make the <span className="font-bold text-blue-600">{currentChallenge.goal}</span> possible number!
            </p>
            <p className="text-sm text-gray-600">
              Drag and swap the digits to rearrange them
            </p>
          </div>
          
          {/* Digit display */}
          <div className="flex justify-center gap-2 mb-6">
            {digits.map(digit => (
              <motion.div
                key={digit.id}
                draggable
                onDragStart={() => handleDragStart(digit.id)}
                onDragOver={handleDragOver}
                onDrop={() => handleDrop(digit.id)}
                className={`w-16 h-16 ${getDigitColor(digit.value)} rounded-lg flex items-center justify-center text-2xl font-bold border-2 cursor-move ${draggedDigit === digit.id ? 'opacity-50' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {digit.value}
              </motion.div>
            ))}
          </div>
          
          {/* Number display */}
          <div className="text-3xl font-bold mb-6">
            {digits.map(d => d.value).join('')}
          </div>
          
          {/* Place value visualization */}
          {renderPlaceValueBlocks()}
          
          {/* Check answer button */}
          <button
            onClick={checkAnswer}
            className="mt-6 px-6 py-2 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600"
          >
            Check Answer
          </button>
          
          {/* Feedback */}
          {showFeedback && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`mt-4 p-3 rounded-lg text-center ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
            >
              {isCorrect ? (
                <>
                  <div className="text-xl font-bold">Correct! 🎉</div>
                  <div>That's the {currentChallenge.goal} number you can make!</div>
                  {level < challenges.length && (
                    <div className="text-sm mt-2">Next challenge coming up...</div>
                  )}
                </>
              ) : (
                <>
                  <div className="text-xl font-bold">Not quite right</div>
                  <div>Try rearranging the digits differently</div>
                </>
              )}
            </motion.div>
          )}
          
          {/* Progress */}
          <div className="mt-6 text-center">
            <div className="font-medium">Level {level}/{challenges.length}</div>
            <div className="text-sm text-gray-600">Score: {score}</div>
          </div>
          
          {/* Reset button */}
          {level > 1 && (
            <button
              onClick={resetGame}
              className="mt-4 px-4 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
            >
              Restart Game
            </button>
          )}
        </>
      )}
    </div>
  );
};

export default NumberSwapGame; 