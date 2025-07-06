import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

const FingerTrickSimulator: React.FC = () => {
  const [selectedNumber, setSelectedNumber] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [userAnswer, setUserAnswer] = useState<string>('');
  
  // Reset state when number changes
  useEffect(() => {
    setShowAnswer(false);
    setShowConfetti(false);
    setIsCorrect(false);
    setUserAnswer('');
  }, [selectedNumber]);

  // Calculate the correct answer for 9 × selectedNumber
  const calculateAnswer = (num: number) => {
    if (!num) return null;
    
    // For the 9× trick:
    // Left side: (num - 1) tens
    // Right side: (10 - num) ones
    const leftSide = (num - 1) * 10;
    const rightSide = 10 - num;
    
    return leftSide + rightSide;
  };

  const handleFingerClick = (num: number) => {
    setSelectedNumber(num);
  };

  const handleCheckAnswer = () => {
    const correctAnswer = calculateAnswer(selectedNumber!);
    const isUserCorrect = parseInt(userAnswer) === correctAnswer;
    
    setIsCorrect(isUserCorrect);
    setShowAnswer(true);
    
    if (isUserCorrect) {
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  };

  const renderFinger = (num: number, isLeftHand: boolean) => {
    const isFolded = selectedNumber === num;
    
    return (
      <motion.div
        key={`${isLeftHand ? 'left' : 'right'}-${num}`}
        className={`w-10 h-24 rounded-t-full cursor-pointer relative ${
          isFolded ? 'h-12 opacity-40' : 'h-24'
        } ${isLeftHand ? 'bg-pink-200' : 'bg-blue-200'}`}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleFingerClick(num)}
        initial={{ y: 0 }}
        animate={{ y: isFolded ? 12 : 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-2 left-0 right-0 text-center font-medium">
          {num}
        </div>
      </motion.div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">9× Finger Trick Simulator</h2>
      
      <div className="mb-8 text-center">
        <div className="text-lg font-medium mb-2">
          {selectedNumber 
            ? `What is 9 × ${selectedNumber}?` 
            : "Click on a finger to fold it down"}
        </div>
        <div className="text-sm text-gray-600">
          {selectedNumber 
            ? "Count the fingers to the left (× 10) and to the right of the folded finger" 
            : "The finger you click represents the number you're multiplying by 9"}
        </div>
      </div>
      
      <div className="flex justify-center gap-6 mb-8">
        {/* Left hand */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-2 font-medium">Left Hand</div>
          <div className="flex gap-1 items-end">
            {[1, 2, 3, 4, 5].map(num => renderFinger(num, true))}
          </div>
          {selectedNumber && (
            <div className="mt-4 text-center">
              <div className="font-bold">{selectedNumber - 1} fingers</div>
              <div className="text-sm">{selectedNumber - 1} × 10 = {(selectedNumber - 1) * 10}</div>
            </div>
          )}
        </div>
        
        {/* Right hand */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-2 font-medium">Right Hand</div>
          <div className="flex gap-1 items-end">
            {[6, 7, 8, 9, 10].map(num => renderFinger(num, false))}
          </div>
          {selectedNumber && (
            <div className="mt-4 text-center">
              <div className="font-bold">{10 - selectedNumber} fingers</div>
              <div className="text-sm">{10 - selectedNumber} ones = {10 - selectedNumber}</div>
            </div>
          )}
        </div>
      </div>
      
      {selectedNumber && (
        <div className="flex flex-col items-center">
          <div className="mb-4">
            <div className="text-lg font-medium mb-2">What's your answer?</div>
            <div className="flex gap-2">
              <input
                type="number"
                value={userAnswer}
                onChange={(e) => setUserAnswer(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg w-24 text-center text-xl"
                placeholder="?"
              />
              <button
                onClick={handleCheckAnswer}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg"
                disabled={!userAnswer}
              >
                Check
              </button>
            </div>
          </div>
          
          {showAnswer && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-lg ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✓</span>
                  <span>
                    Correct! {(selectedNumber - 1) * 10} + {10 - selectedNumber} = {calculateAnswer(selectedNumber)}
                  </span>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-2xl">✗</span>
                  <span>
                    Try again! Count {selectedNumber - 1} fingers to the left (× 10) 
                    and {10 - selectedNumber} fingers to the right.
                  </span>
                </div>
              )}
            </motion.div>
          )}
        </div>
      )}
      
      {showConfetti && <ConfettiEffect />}
      {isCorrect && <SoundPlayer soundFile="/audio/correct.mp3" autoPlay />}
      {showAnswer && !isCorrect && <SoundPlayer soundFile="/audio/incorrect.mp3" autoPlay />}
    </div>
  );
};

export default FingerTrickSimulator; 