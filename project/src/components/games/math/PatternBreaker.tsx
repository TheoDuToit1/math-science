import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

// Types for pattern items
type PatternShape = '🔵' | '🔴' | '🔺' | '⚪' | '🟢' | '🟣' | '🟡' | '⬛';
type PatternItem = {
  id: string;
  shape: PatternShape;
};

interface PatternBreakerProps {
  onComplete?: () => void;
}

// Level definitions
interface Level {
  pattern: PatternShape[];
  options: PatternShape[];
  answer: PatternShape;
  explanation: string;
}

const levels: Level[] = [
  {
    pattern: ['🔵', '🔴', '🔵', '🔴'],
    options: ['🔵', '🔴', '🔺', '⚪'],
    answer: '🔵',
    explanation: 'The pattern alternates between blue and red circles.'
  },
  {
    pattern: ['🔺', '🔺', '🔵', '🔺', '🔺', '🔵'],
    options: ['🔵', '🔴', '🔺', '⚪'],
    answer: '🔵',
    explanation: 'The pattern is two triangles followed by a blue circle, repeating.'
  },
  {
    pattern: ['🔴', '🔵', '🔵', '🔴', '🔵', '🔵'],
    options: ['🔴', '🔵', '🟢', '⚪'],
    answer: '🔴',
    explanation: 'The pattern is one red circle followed by two blue circles, repeating.'
  },
  {
    pattern: ['🟡', '🔵', '🟡', '🔵', '🟡', '🔵', '🟡'],
    options: ['🔵', '🔴', '🟡', '⚪'],
    answer: '🔵',
    explanation: 'The pattern alternates between yellow and blue circles.'
  },
  {
    pattern: ['🔵', '🔵', '🔴', '🔵', '🔵', '🔵', '🔴', '🔵'],
    options: ['🔵', '🔴', '🟢', '⚪'],
    answer: '🔵',
    explanation: 'The pattern is two blue circles, one red circle, repeating, but with an extra blue circle each time.'
  },
  {
    pattern: ['⚪', '🔵', '🔵', '⚪', '🔵', '🔵', '🔵'],
    options: ['⚪', '🔵', '🔴', '🟢'],
    answer: '⚪',
    explanation: 'The pattern is one white circle followed by an increasing number of blue circles.'
  },
  {
    pattern: ['🔴', '🟡', '🟢', '🔴', '🟡', '🟢', '🔴'],
    options: ['🔴', '🟡', '🟢', '🔵'],
    answer: '🟡',
    explanation: 'The pattern is red, yellow, green, repeating.'
  },
  {
    pattern: ['🔵', '🔵', '🔴', '🔵', '🔵', '🔴', '🔵'],
    options: ['🔴', '🔵', '🟡', '⚪'],
    answer: '🔴',
    explanation: 'The pattern is two blue circles, one red circle, repeating.'
  },
  {
    pattern: ['🟢', '🟢', '🟢', '🔴', '🟢', '🟢', '🟢', '🔴'],
    options: ['🔴', '🟢', '🔵', '🟡'],
    answer: '🟢',
    explanation: 'Three green circles, one red, repeating.'
  },
  {
    pattern: ['🔺', '🔵', '🔺', '🔵', '🔺', '🔵', '🔺', '🔵', '🔺'],
    options: ['🔵', '🔺', '🟡', '⚪'],
    answer: '🔵',
    explanation: 'Alternating triangle and blue circle.'
  },
  {
    pattern: ['🟣', '🟡', '🟣', '🟡', '🟣', '🟡', '🟣'],
    options: ['🟡', '🟣', '🔴', '🔵'],
    answer: '🟡',
    explanation: 'Alternating purple and yellow circles.'
  },
  {
    pattern: ['🔵', '🔴', '🔵', '🔴', '🔵', '🔴', '🔵', '🔴', '🔵'],
    options: ['🔴', '🔵', '🟢', '⚪'],
    answer: '🔴',
    explanation: 'Alternating blue and red, always blue first.'
  },
  {
    pattern: ['🔺', '🔺', '🟢', '🔺', '🔺', '🟢', '🔺', '🔺'],
    options: ['🔺', '🟢', '🔴', '⚪'],
    answer: '🟢',
    explanation: 'Two triangles, one green, repeating.'
  },
  {
    pattern: ['🟡', '🟡', '🔴', '🟡', '🟡', '🔴', '🟡'],
    options: ['🔴', '🟡', '🔵', '🟢'],
    answer: '🔴',
    explanation: 'Two yellow, one red, repeating.'
  },
  {
    pattern: ['🔵', '🟢', '🔵', '🟢', '🔵', '🟢', '🔵'],
    options: ['🟢', '🔵', '🔴', '🟡'],
    answer: '🟢',
    explanation: 'Alternating blue and green.'
  },
];

const PatternBreaker: React.FC<PatternBreakerProps> = ({ onComplete }) => {
  const [currentLevel, setCurrentLevel] = useState(0);
  const [selectedOption, setSelectedOption] = useState<PatternShape | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  const [showHint, setShowHint] = useState(false);

  // Check the selected answer
  const checkAnswer = () => {
    if (!selectedOption) return;
    
    const correct = selectedOption === levels[currentLevel].answer;
    setIsCorrect(correct);
    
    if (correct) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
      
      // Add to completed levels if not already completed
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels([...completedLevels, currentLevel]);
      }
      
      // Show explanation after a short delay
      setTimeout(() => {
        setShowExplanation(true);
      }, 1000);
      
      // If all levels are completed, call the onComplete callback
      if (completedLevels.length === levels.length - 1 && !completedLevels.includes(currentLevel) && onComplete) {
        onComplete();
      }
    }
  };

  // Move to the next level
  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      resetLevel();
    }
  };

  // Move to the previous level
  const prevLevel = () => {
    if (currentLevel > 0) {
      setCurrentLevel(currentLevel - 1);
      resetLevel();
    }
  };

  // Reset the current level state
  const resetLevel = () => {
    setSelectedOption(null);
    setIsCorrect(null);
    setShowExplanation(false);
    setShowHint(false);
  };

  // Try again the current level
  const tryAgain = () => {
    resetLevel();
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Pattern Breaker</h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg mb-2">
          What comes next in the pattern?
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Level {currentLevel + 1} of {levels.length}
        </p>
      </div>
      
      {/* Pattern display */}
      <div className="bg-gray-100 p-6 rounded-lg mb-8">
        <div className="flex justify-center items-center gap-4 mb-6">
          {levels[currentLevel].pattern.map((shape, index) => (
            <motion.div
              key={index}
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.1 }}
              className="text-4xl"
            >
              {shape}
            </motion.div>
          ))}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: levels[currentLevel].pattern.length * 0.1 }}
            className="text-4xl bg-gray-200 w-12 h-12 rounded-full flex items-center justify-center"
          >
            ?
          </motion.div>
        </div>
        
        {/* Options */}
        <div className="flex justify-center gap-6">
          {levels[currentLevel].options.map((option, index) => (
            <motion.button
              key={index}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => !isCorrect && setSelectedOption(option)}
              className={`
                text-4xl p-3 rounded-lg
                ${selectedOption === option ? 'bg-blue-200 ring-2 ring-blue-500' : 'bg-white hover:bg-gray-200'}
                ${isCorrect !== null && option === levels[currentLevel].answer ? 'bg-green-200 ring-2 ring-green-500' : ''}
                ${isCorrect === false && selectedOption === option && option !== levels[currentLevel].answer ? 'bg-red-200 ring-2 ring-red-500' : ''}
                ${isCorrect !== null ? 'cursor-default' : 'cursor-pointer'}
              `}
              disabled={isCorrect !== null}
            >
              {option}
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Hint */}
      {showHint && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="bg-yellow-50 p-4 rounded-lg mb-6"
        >
          <div className="text-lg font-medium mb-2">Hint:</div>
          <div className="text-sm">
            Look for repeating shapes or a rule that determines what comes next.
            Try counting how many of each shape appear or if they follow a specific order.
          </div>
        </motion.div>
      )}
      
      {/* Explanation */}
      {showExplanation && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-green-50 p-4 rounded-lg mb-6"
        >
          <div className="text-lg font-medium mb-2">Pattern Explained:</div>
          <div className="text-sm">
            {levels[currentLevel].explanation}
          </div>
        </motion.div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-center gap-3 mb-6">
        {isCorrect === null ? (
          <>
            <button
              onClick={checkAnswer}
              disabled={!selectedOption}
              className={`
                px-4 py-2 rounded-lg font-medium
                ${!selectedOption ? 'bg-gray-200 text-gray-500' : 'bg-green-500 text-white hover:bg-green-600'}
              `}
            >
              Check Answer
            </button>
            <button
              onClick={() => setShowHint(!showHint)}
              className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
            >
              {showHint ? 'Hide Hint' : 'Show Hint'}
            </button>
          </>
        ) : isCorrect ? (
          <button
            onClick={nextLevel}
            disabled={currentLevel >= levels.length - 1}
            className={`
              px-4 py-2 rounded-lg font-medium
              ${currentLevel >= levels.length - 1 ? 'bg-gray-200 text-gray-500' : 'bg-blue-500 text-white hover:bg-blue-600'}
            `}
          >
            {currentLevel >= levels.length - 1 ? 'All Levels Completed!' : 'Next Pattern'}
          </button>
        ) : (
          <button
            onClick={tryAgain}
            className="px-4 py-2 bg-red-500 text-white rounded-lg font-medium hover:bg-red-600"
          >
            Try Again
          </button>
        )}
      </div>
      
      {/* Level navigation */}
      <div className="flex justify-between items-center">
        <button
          onClick={prevLevel}
          disabled={currentLevel === 0}
          className={`
            px-3 py-1 rounded-lg text-sm
            ${currentLevel === 0 ? 'bg-gray-200 text-gray-500' : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
          `}
        >
          ← Previous Level
        </button>
        
        <div className="flex gap-1">
          {levels.map((_, index) => (
            <div
              key={index}
              className={`
                w-3 h-3 rounded-full
                ${completedLevels.includes(index) ? 'bg-green-500' : 
                  index === currentLevel ? 'bg-blue-500' : 'bg-gray-300'}
              `}
            />
          ))}
        </div>
        
        <button
          onClick={nextLevel}
          disabled={currentLevel === levels.length - 1 || !completedLevels.includes(currentLevel)}
          className={`
            px-3 py-1 rounded-lg text-sm
            ${currentLevel === levels.length - 1 || !completedLevels.includes(currentLevel) 
              ? 'bg-gray-200 text-gray-500' 
              : 'bg-gray-300 text-gray-700 hover:bg-gray-400'}
          `}
        >
          Next Level →
        </button>
      </div>
      
      {showConfetti && <ConfettiEffect />}
      {isCorrect === true && <SoundPlayer soundFile="/audio/correct-6033.mp3" autoPlay />}
      {isCorrect === false && <SoundPlayer soundFile="/audio/fail.mp3" autoPlay />}
    </div>
  );
};

export default PatternBreaker; 