import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ComparisonPair {
  number1: number;
  number2: number;
  explanation: string;
}

const ZeroPowerGame: React.FC = () => {
  const [currentPairIndex, setCurrentPairIndex] = useState(0);
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [score, setScore] = useState(0);
  const [showAnimation, setShowAnimation] = useState(false);
  
  // Comparison pairs with explanations
  const comparisonPairs: ComparisonPair[] = [
    { 
      number1: 42, 
      number2: 402, 
      explanation: "402 has a zero in the tens place, making it 4 hundreds, 0 tens, and 2 ones = 402. That's bigger than 42 (4 tens and 2 ones)."
    },
    { 
      number1: 530, 
      number2: 503, 
      explanation: "530 has a zero in the ones place, making it 5 hundreds, 3 tens, and 0 ones = 530. That's bigger than 503 (5 hundreds, 0 tens, and 3 ones)."
    },
    { 
      number1: 70, 
      number2: 700, 
      explanation: "700 has two zeros, making it 7 hundreds, 0 tens, and 0 ones = 700. That's bigger than 70 (7 tens and 0 ones)."
    },
    { 
      number1: 105, 
      number2: 150, 
      explanation: "150 has a zero in the ones place, making it 1 hundred, 5 tens, and 0 ones = 150. That's bigger than 105 (1 hundred, 0 tens, and 5 ones)."
    },
    { 
      number1: 60, 
      number2: 600, 
      explanation: "600 has two zeros, making it 6 hundreds, 0 tens, and 0 ones = 600. That's bigger than 60 (6 tens and 0 ones)."
    },
    { 
      number1: 209, 
      number2: 290, 
      explanation: "290 has a zero in the ones place, making it 2 hundreds, 9 tens, and 0 ones = 290. That's bigger than 209 (2 hundreds, 0 tens, and 9 ones)."
    },
    { 
      number1: 350, 
      number2: 305, 
      explanation: "350 has a zero in the ones place, making it 3 hundreds, 5 tens, and 0 ones = 350. That's bigger than 305 (3 hundreds, 0 tens, and 5 ones)."
    },
    { 
      number1: 802, 
      number2: 820, 
      explanation: "820 has a zero in the ones place, making it 8 hundreds, 2 tens, and 0 ones = 820. That's bigger than 802 (8 hundreds, 0 tens, and 2 ones)."
    },
    { 
      number1: 90, 
      number2: 900, 
      explanation: "900 has two zeros, making it 9 hundreds, 0 tens, and 0 ones = 900. That's bigger than 90 (9 tens and 0 ones)."
    },
    { 
      number1: 640, 
      number2: 604, 
      explanation: "640 has a zero in the ones place, making it 6 hundreds, 4 tens, and 0 ones = 640. That's bigger than 604 (6 hundreds, 0 tens, and 4 ones)."
    },
  ];
  
  const currentPair = comparisonPairs[currentPairIndex];
  
  // Handle number selection
  const handleNumberSelect = (number: number) => {
    setSelectedNumber(number);
    
    // Play sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
    
    // Check if the answer is correct
    const largerNumber = Math.max(currentPair.number1, currentPair.number2);
    const correct = number === largerNumber;
    
    setIsCorrect(correct);
    setShowFeedback(true);
    
    if (correct) {
      setScore(score + 1);
      
      // Play success sound
      try {
        new Audio('/audio/correct.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      // Show animation
      setShowAnimation(true);
      
      // Move to next pair after delay
      setTimeout(() => {
        setShowFeedback(false);
        setSelectedNumber(null);
        setShowAnimation(false);
        setCurrentPairIndex((currentPairIndex + 1) % comparisonPairs.length);
      }, 3000);
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
        setSelectedNumber(null);
      }, 2000);
    }
  };
  
  // Convert number to place value representation
  const getPlaceValues = (num: number) => {
    const numStr = num.toString();
    const digits = numStr.split('').map(Number);
    
    // Pad with leading zeros to ensure 3 digits
    while (digits.length < 3) {
      digits.unshift(0);
    }
    
    return {
      hundreds: digits[digits.length - 3],
      tens: digits[digits.length - 2],
      ones: digits[digits.length - 1]
    };
  };
  
  // Get place value blocks for a number
  const renderPlaceValueBlocks = (num: number, highlight: boolean = false) => {
    const { hundreds, tens, ones } = getPlaceValues(num);
    
    return (
      <div className="flex justify-center gap-2">
        <div className="flex flex-col items-center">
          <motion.div 
            className={`w-14 h-14 ${highlight && hundreds === 0 ? 'bg-yellow-300 animate-pulse' : 'bg-blue-500'} text-white rounded-lg flex items-center justify-center font-bold text-xl`}
            animate={showAnimation && selectedNumber === num ? { y: [0, -15, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {hundreds}
          </motion.div>
          <div className="text-xs mt-1">hundreds</div>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            className={`w-14 h-14 ${highlight && tens === 0 ? 'bg-yellow-300 animate-pulse' : 'bg-red-500'} text-white rounded-lg flex items-center justify-center font-bold text-xl`}
            animate={showAnimation && selectedNumber === num ? { y: [0, -15, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {tens}
          </motion.div>
          <div className="text-xs mt-1">tens</div>
        </div>
        
        <div className="flex flex-col items-center">
          <motion.div 
            className={`w-14 h-14 ${highlight && ones === 0 ? 'bg-yellow-300 animate-pulse' : 'bg-green-500'} text-white rounded-lg flex items-center justify-center font-bold text-xl`}
            animate={showAnimation && selectedNumber === num ? { y: [0, -15, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {ones}
          </motion.div>
          <div className="text-xs mt-1">ones</div>
        </div>
      </div>
    );
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-2xl font-bold mb-2">Zero Power Mystery</h2>
      
      <div className="text-center mb-6">
        <p className="text-lg font-medium">Which number is bigger?</p>
        <p className="text-sm text-gray-600 mb-4">Click on the larger number</p>
        
        {/* Rocket icon */}
        <div className="text-4xl mb-4">🚀</div>
      </div>
      
      {/* Number comparison */}
      <div className="flex justify-center items-center gap-8 mb-8">
        {/* First number */}
        <motion.div 
          className={`p-6 rounded-xl border-4 ${
            selectedNumber === currentPair.number1 
              ? isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50' 
              : 'border-blue-300 bg-blue-50 hover:border-blue-500'
          } cursor-pointer`}
          onClick={() => !showFeedback && handleNumberSelect(currentPair.number1)}
          whileHover={!showFeedback ? { scale: 1.05 } : {}}
          animate={
            showAnimation && selectedNumber === currentPair.number1 
              ? { y: [0, -20, 0] } 
              : selectedNumber === currentPair.number1 && !isCorrect 
                ? { x: [0, -10, 10, -10, 0] } 
                : {}
          }
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl font-bold mb-4">{currentPair.number1}</div>
          {renderPlaceValueBlocks(currentPair.number1, showFeedback)}
        </motion.div>
        
        <div className="text-2xl font-bold">VS</div>
        
        {/* Second number */}
        <motion.div 
          className={`p-6 rounded-xl border-4 ${
            selectedNumber === currentPair.number2 
              ? isCorrect 
                ? 'border-green-500 bg-green-50' 
                : 'border-red-500 bg-red-50' 
              : 'border-blue-300 bg-blue-50 hover:border-blue-500'
          } cursor-pointer`}
          onClick={() => !showFeedback && handleNumberSelect(currentPair.number2)}
          whileHover={!showFeedback ? { scale: 1.05 } : {}}
          animate={
            showAnimation && selectedNumber === currentPair.number2 
              ? { y: [0, -20, 0] } 
              : selectedNumber === currentPair.number2 && !isCorrect 
                ? { x: [0, -10, 10, -10, 0] } 
                : {}
          }
          transition={{ duration: 0.5 }}
        >
          <div className="text-4xl font-bold mb-4">{currentPair.number2}</div>
          {renderPlaceValueBlocks(currentPair.number2, showFeedback)}
        </motion.div>
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg ${isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'} max-w-md text-center`}
        >
          <div className="text-xl font-bold mb-2">
            {isCorrect ? '✓ Correct!' : '✗ Try Again'}
          </div>
          {isCorrect && (
            <div>{currentPair.explanation}</div>
          )}
          {!isCorrect && (
            <div>Look carefully at the place values!</div>
          )}
        </motion.div>
      )}
      
      {/* Rocket animation for correct answer */}
      {showAnimation && isCorrect && (
        <motion.div
          className="absolute bottom-0 left-1/2 transform -translate-x-1/2"
          initial={{ y: 100 }}
          animate={{ y: -300 }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="text-6xl">🚀</div>
          <motion.div
            className="absolute bottom-0 w-full"
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: [0, 1, 0], scale: [0, 1, 2] }}
            transition={{ duration: 1 }}
          >
            <div className="text-center text-orange-500">🔥</div>
          </motion.div>
        </motion.div>
      )}
      
      {/* Score display */}
      <div className="mt-6 text-sm text-gray-600">
        Score: {score} | Question {currentPairIndex + 1}/{comparisonPairs.length}
      </div>
    </div>
  );
};

export default ZeroPowerGame; 