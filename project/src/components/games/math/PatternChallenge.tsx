import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

const PatternChallenge: React.FC = () => {
  const [grid, setGrid] = useState<number[]>(Array.from({ length: 100 }, (_, i) => i + 1));
  const [highlightedNumbers, setHighlightedNumbers] = useState<number[]>([]);
  const [userHighlighted, setUserHighlighted] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [badgeUnlocked, setBadgeUnlocked] = useState(false);
  const [showPattern, setShowPattern] = useState(false);

  // Initialize the multiples of 9
  useEffect(() => {
    const multiplesOf9 = Array.from({ length: 11 }, (_, i) => 9 * (i + 1));
    setHighlightedNumbers(multiplesOf9);
  }, []);

  const handleNumberClick = (num: number) => {
    if (userHighlighted.includes(num)) {
      // Remove from highlighted
      setUserHighlighted(userHighlighted.filter(n => n !== num));
    } else {
      // Add to highlighted
      setUserHighlighted([...userHighlighted, num]);
    }
  };

  const checkAnswer = () => {
    // Sort both arrays to compare them properly
    const sortedUser = [...userHighlighted].sort((a, b) => a - b);
    const sortedCorrect = [...highlightedNumbers].sort((a, b) => a - b);
    
    // Check if arrays have the same length and all elements match
    const correct = 
      sortedUser.length === sortedCorrect.length && 
      sortedUser.every((value, index) => value === sortedCorrect[index]);
    
    setIsCorrect(correct);
    setShowAnswer(true);
    
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
        setBadgeUnlocked(true);
      }, 3000);
    }
  };

  const showAllMultiples = () => {
    setUserHighlighted(highlightedNumbers);
    setShowAnswer(true);
    setIsCorrect(true);
    setShowPattern(true);
  };

  const resetSelection = () => {
    setUserHighlighted([]);
    setShowAnswer(false);
    setIsCorrect(false);
  };

  // Calculate the sum of digits for a number
  const sumOfDigits = (num: number): number => {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Pattern Challenge</h2>
      
      <div className="mb-6 text-center">
        <div className="text-lg font-medium mb-2">
          Find all multiples of 9 from 1 to 100
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Click on the numbers that are multiples of 9
        </div>
        
        <div className="flex justify-center gap-2 mb-6">
          <button
            onClick={checkAnswer}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg"
            disabled={showAnswer}
          >
            Check Answer
          </button>
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          <button
            onClick={resetSelection}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg"
            disabled={userHighlighted.length === 0}
          >
            Reset
          </button>
        </div>
        
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="bg-yellow-50 p-4 rounded-lg mb-6"
          >
            <div className="text-lg font-medium mb-2">Hint:</div>
            <div className="text-sm">
              To find multiples of 9, you can:
              <ul className="list-disc list-inside mt-2">
                <li>Count by 9s: 9, 18, 27, 36...</li>
                <li>Or use the finger trick to help you!</li>
              </ul>
            </div>
          </motion.div>
        )}
        
        {showAnswer && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-4 rounded-lg mb-6 ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}
          >
            {isCorrect ? (
              <div className="flex items-center justify-center gap-2">
                <span className="text-2xl">✓</span>
                <span className="font-bold">Great job! You found all the multiples of 9!</span>
              </div>
            ) : (
              <div className="flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✗</span>
                  <span className="font-bold">Not quite right. Try again or see the answer.</span>
                </div>
                <button
                  onClick={showAllMultiples}
                  className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg mt-2"
                >
                  Show Me The Answer
                </button>
              </div>
            )}
          </motion.div>
        )}
      </div>
      
      {/* Number grid */}
      <div className="grid grid-cols-10 gap-2 mb-8">
        {grid.map(num => {
          const isHighlighted = userHighlighted.includes(num);
          const isMultipleOf9 = num % 9 === 0;
          
          return (
            <motion.div
              key={num}
              className={`aspect-square flex items-center justify-center rounded-lg cursor-pointer text-lg font-medium border-2 ${
                isHighlighted 
                  ? 'bg-blue-500 text-white border-blue-700'
                  : 'bg-gray-100 hover:bg-gray-200 border-transparent'
              }`}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !showAnswer && handleNumberClick(num)}
            >
              {num}
            </motion.div>
          );
        })}
      </div>
      
      {/* Pattern discovery section */}
      {showPattern && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-purple-50 p-6 rounded-lg mb-6"
        >
          <div className="text-xl font-bold text-center mb-4">
            Do you notice the pattern?
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {highlightedNumbers.map(num => (
              <div key={num} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex justify-between items-center">
                  <div className="text-xl font-bold">{num}</div>
                  <div className="text-sm">
                    {num.toString().split('').join(' + ')} = {sumOfDigits(num)}
                  </div>
                  <div className="text-lg font-medium">
                    {sumOfDigits(num) === 9 ? '= 9!' : sumOfDigits(num) > 9 ? `→ ${sumOfDigits(sumOfDigits(num))}` : ''}
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center mt-6 text-lg font-medium">
            In multiples of 9, the digits always add up to 9 (or a multiple of 9 for larger numbers)!
          </div>
        </motion.div>
      )}
      
      {/* Badge unlock animation */}
      {badgeUnlocked && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg text-white text-center"
        >
          <div className="text-2xl font-bold mb-2">🎉 Achievement Unlocked! 🎉</div>
          <div className="text-4xl mb-4">🏅</div>
          <div className="text-xl font-medium">9 Magic Badge</div>
          <div className="text-sm mt-2">
            You've discovered the magical patterns of 9!
          </div>
        </motion.div>
      )}
      
      {showConfetti && <ConfettiEffect />}
      {isCorrect && <SoundPlayer soundFile="/audio/correct.mp3" autoPlay />}
      {showAnswer && !isCorrect && <SoundPlayer soundFile="/audio/incorrect.mp3" autoPlay />}
    </div>
  );
};

export default PatternChallenge; 