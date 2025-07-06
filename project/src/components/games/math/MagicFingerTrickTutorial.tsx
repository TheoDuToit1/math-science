import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface TutorialStep {
  number: number;
  equation: string;
  leftFingers: number;
  rightFingers: number;
  answer: number;
}

const MagicFingerTrickTutorial: React.FC = () => {
  const [selectedFinger, setSelectedFinger] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);

  // Helper to calculate left/right/answer for any finger
  const getFingerMath = (num: number) => {
    const leftFingers = num - 1;
    const rightFingers = 10 - num;
    return {
      leftFingers,
      rightFingers,
      answer: leftFingers * 10 + rightFingers,
    };
  };

  const handleFingerClick = (num: number) => {
    setSelectedFinger(num);
    setShowConfetti(false);
    setTimeout(() => setShowConfetti(true), 200);
    setTimeout(() => setShowConfetti(false), 2000);
  };

  const handleReset = () => {
    setSelectedFinger(null);
    setShowConfetti(false);
  };

  // Render a finger
  const renderFinger = (num: number) => {
    const isFolded = selectedFinger === num;
    return (
      <motion.div
        key={num}
        className={`w-12 h-28 rounded-t-full cursor-pointer relative select-none
          ${isFolded ? 'h-14 opacity-40 ring-4 ring-purple-400' : 'h-28'}
          ${num <= 5 ? 'bg-pink-200' : 'bg-blue-200'}`}
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => handleFingerClick(num)}
        animate={{ y: isFolded ? 14 : 0, scale: isFolded ? 1.1 : 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="absolute top-2 left-0 right-0 text-center font-medium text-lg">
          {num}
        </div>
        {isFolded && (
          <motion.div
            className="absolute -top-6 left-1/2 -translate-x-1/2 text-xs font-bold text-purple-700"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Folded!
          </motion.div>
        )}
      </motion.div>
    );
  };

  // Math explanation for the selected finger
  const math = selectedFinger ? getFingerMath(selectedFinger) : null;

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-2">Magic Finger Trick Tutorial</h2>
      <div className="mb-4 text-center text-lg font-medium text-indigo-700">
        Click any finger to fold it down and see how the 9× trick works!
      </div>
      <div className="flex justify-center gap-8 mb-8">
        {/* Left hand */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-2 font-medium">Left Hand</div>
          <div className="flex gap-2 items-end">
            {[1, 2, 3, 4, 5].map(num => renderFinger(num))}
          </div>
        </div>
        {/* Divider */}
        <div className="flex flex-col justify-center">
          <div className="w-1 h-24 bg-gray-300 rounded-full opacity-60" />
        </div>
        {/* Right hand */}
        <div className="flex flex-col items-center">
          <div className="text-center mb-2 font-medium">Right Hand</div>
          <div className="flex gap-2 items-end">
            {[6, 7, 8, 9, 10].map(num => renderFinger(num))}
          </div>
        </div>
      </div>
      {selectedFinger && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col items-center mb-6"
        >
          <div className="bg-purple-100 rounded-lg p-4 text-center mb-4">
            <div className="text-lg mb-2">Step-by-step:</div>
            <div className="flex flex-col gap-2 items-center">
              <div className="flex items-center gap-2">
                <span className="font-bold text-pink-700">{math.leftFingers}</span>
                <span>fingers left × 10 =</span>
                <span className="font-bold text-indigo-700">{math.leftFingers * 10}</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-blue-700">{math.rightFingers}</span>
                <span>fingers right =</span>
                <span className="font-bold text-indigo-700">{math.rightFingers}</span>
              </div>
              <div className="text-xl font-bold mt-2">
                {math.leftFingers * 10} + {math.rightFingers} = {math.answer}
              </div>
            </div>
            <div className="text-sm text-purple-700 mt-2">
              The finger you fold down is the number you multiply by 9
            </div>
          </div>
          <button
            onClick={handleReset}
            className="px-6 py-2 bg-blue-500 text-white rounded-lg text-base font-medium mt-2"
          >
            Try Another
          </button>
        </motion.div>
      )}
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default MagicFingerTrickTutorial; 