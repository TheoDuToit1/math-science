import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';

interface Block {
  id: string;
  type: 'hundreds' | 'tens' | 'ones';
  value: number;
  color: string;
}

const PlaceValueBuilder: React.FC = () => {
  const [targetNumber, setTargetNumber] = useState<number>(248);
  const [selectedBlocks, setSelectedBlocks] = useState<{
    hundreds: Block[];
    tens: Block[];
    ones: Block[];
  }>({
    hundreds: [],
    tens: [],
    ones: []
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [level, setLevel] = useState(0);
  const [score, setScore] = useState(0);
  const [showConfetti, setShowConfetti] = useState(false);
  
  // Levels with target numbers
  const levels = [
    { number: 248, hint: "2 hundreds, 4 tens, 8 ones" },
    { number: 305, hint: "3 hundreds, 0 tens, 5 ones" },
    { number: 170, hint: "1 hundred, 7 tens, 0 ones" },
    { number: 629, hint: "6 hundreds, 2 tens, 9 ones" },
    { number: 504, hint: "5 hundreds, 0 tens, 4 ones" },
  ];

  // Initialize with first level
  useEffect(() => {
    setTargetNumber(levels[level].number);
    resetBlocks();
  }, [level]);

  // Extract digits from target number
  const hundredsDigit = Math.floor(targetNumber / 100);
  const tensDigit = Math.floor((targetNumber % 100) / 10);
  const onesDigit = targetNumber % 10;

  // Reset blocks when changing levels
  const resetBlocks = () => {
    setSelectedBlocks({
      hundreds: [],
      tens: [],
      ones: []
    });
    setShowSuccess(false);
    setShowError(false);
  };

  // Handle drag start
  const handleDragStart = (e: React.DragEvent, block: Block) => {
    e.dataTransfer.setData('block', JSON.stringify(block));
      // Play sound
      try {
        new Audio('/audio/click.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
  };

  // Handle drag over
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  // Handle drop
  const handleDrop = (e: React.DragEvent, targetType: 'hundreds' | 'tens' | 'ones') => {
    e.preventDefault();
    const blockData = e.dataTransfer.getData('block');
    if (!blockData) return;
    
    const block = JSON.parse(blockData) as Block;
    
    // Check if block type matches drop zone type
    if (block.type === targetType) {
      // Add block to the appropriate section
      setSelectedBlocks(prev => ({
        ...prev,
        [targetType]: [...prev[targetType], block]
      }));
      
      // Play sound
      try {
        new Audio('/audio/pop.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    } else {
      // Wrong type - play error sound
      try {
        new Audio('/audio/incorrect.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
  };

  // Remove block from a section
  const removeBlock = (type: 'hundreds' | 'tens' | 'ones', blockId: string) => {
    setSelectedBlocks(prev => ({
      ...prev,
      [type]: prev[type].filter(block => block.id !== blockId)
    }));
    
    // Play sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  // Check if the answer is correct
  const checkAnswer = () => {
    // Calculate the value represented by the blocks
    const hundredsValue = selectedBlocks.hundreds.reduce((sum, block) => sum + block.value, 0) * 100;
    const tensValue = selectedBlocks.tens.reduce((sum, block) => sum + block.value, 0) * 10;
    const onesValue = selectedBlocks.ones.reduce((sum, block) => sum + block.value, 0);
    
    const totalValue = hundredsValue + tensValue + onesValue;
    
    if (totalValue === targetNumber) {
      // Correct answer
      setShowSuccess(true);
      setShowConfetti(true);
      setScore(score + 1);
      
      // Play success sound
      try {
        new Audio('/audio/correct.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      // Move to next level after delay
      setTimeout(() => {
        setShowSuccess(false);
        setShowConfetti(false);
        if (level < levels.length - 1) {
          setLevel(level + 1);
        } else {
          // Game completed - restart from beginning
          setLevel(0);
        }
      }, 3000);
    } else {
      // Incorrect answer
      setShowError(true);
      
      // Play error sound
      try {
        new Audio('/audio/incorrect.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      // Shake animation and hide error message after delay
      setTimeout(() => {
        setShowError(false);
      }, 1500);
    }
  };

  // Available blocks for each place value
  const availableBlocks = {
    hundreds: Array.from({ length: 10 }, (_, i) => ({
      id: `h${i}`,
      type: 'hundreds' as const,
      value: i,
      color: 'bg-blue-500 text-white'
    })),
    tens: Array.from({ length: 10 }, (_, i) => ({
      id: `t${i}`,
      type: 'tens' as const,
      value: i,
      color: 'bg-red-500 text-white'
    })),
    ones: Array.from({ length: 10 }, (_, i) => ({
      id: `o${i}`,
      type: 'ones' as const,
      value: i,
      color: 'bg-yellow-500 text-white'
    }))
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      {showConfetti && <ConfettiEffect />}
      
      <h2 className="text-2xl font-bold mb-2">Place Value Builder</h2>
      
      {/* Target number display */}
      <div className="text-center mb-6">
        <p className="text-lg mb-2">Build the number:</p>
        <div className="text-4xl font-bold text-blue-600">{targetNumber}</div>
        <p className="text-sm text-gray-600 mt-1">{levels[level].hint}</p>
      </div>
      
      {/* Drop zones */}
      <div className="flex justify-center gap-6 mb-8">
        {/* Hundreds */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold mb-2">Hundreds</div>
          <motion.div 
            className={`w-32 h-40 border-2 ${showError ? 'border-red-500 animate-shake' : 'border-blue-400'} rounded-lg bg-blue-50 flex flex-wrap content-start p-2 overflow-y-auto`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'hundreds')}
            animate={showSuccess ? { y: [0, -20, 0] } : {}}
            transition={{ duration: 0.5 }}
          >
            {selectedBlocks.hundreds.map((block, index) => (
              <div 
                key={`${block.id}-${index}`} 
                className={`${block.color} w-12 h-12 m-1 rounded flex items-center justify-center font-bold cursor-pointer`}
                onClick={() => removeBlock('hundreds', block.id)}
              >
                {block.value}
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Tens */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold mb-2">Tens</div>
          <motion.div 
            className={`w-32 h-40 border-2 ${showError ? 'border-red-500 animate-shake' : 'border-red-400'} rounded-lg bg-red-50 flex flex-wrap content-start p-2 overflow-y-auto`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'tens')}
            animate={showSuccess ? { y: [0, -20, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            {selectedBlocks.tens.map((block, index) => (
              <div 
                key={`${block.id}-${index}`} 
                className={`${block.color} w-12 h-12 m-1 rounded flex items-center justify-center font-bold cursor-pointer`}
                onClick={() => removeBlock('tens', block.id)}
              >
                {block.value}
              </div>
            ))}
          </motion.div>
        </div>
        
        {/* Ones */}
        <div className="flex flex-col items-center">
          <div className="text-sm font-semibold mb-2">Ones</div>
          <motion.div 
            className={`w-32 h-40 border-2 ${showError ? 'border-red-500 animate-shake' : 'border-yellow-400'} rounded-lg bg-yellow-50 flex flex-wrap content-start p-2 overflow-y-auto`}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, 'ones')}
            animate={showSuccess ? { y: [0, -20, 0] } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            {selectedBlocks.ones.map((block, index) => (
              <div 
                key={`${block.id}-${index}`} 
                className={`${block.color} w-12 h-12 m-1 rounded flex items-center justify-center font-bold cursor-pointer`}
                onClick={() => removeBlock('ones', block.id)}
              >
                {block.value}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
      
      {/* Available blocks */}
      <div className="mb-6">
        <div className="text-sm font-semibold mb-2 text-center">Drag blocks to build your number</div>
        
        {/* Hundreds blocks */}
        <div className="mb-2">
          <div className="text-xs font-medium mb-1 text-center">Hundreds</div>
          <div className="flex flex-wrap justify-center gap-2">
            {availableBlocks.hundreds.map(block => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                className={`${block.color} w-10 h-10 rounded flex items-center justify-center font-bold cursor-grab`}
              >
                {block.value}
              </div>
            ))}
          </div>
        </div>
        
        {/* Tens blocks */}
        <div className="mb-2">
          <div className="text-xs font-medium mb-1 text-center">Tens</div>
          <div className="flex flex-wrap justify-center gap-2">
            {availableBlocks.tens.map(block => (
              <div
                key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                className={`${block.color} w-10 h-10 rounded flex items-center justify-center font-bold cursor-grab`}
              >
                {block.value}
              </div>
            ))}
          </div>
        </div>
        
        {/* Ones blocks */}
        <div>
          <div className="text-xs font-medium mb-1 text-center">Ones</div>
          <div className="flex flex-wrap justify-center gap-2">
            {availableBlocks.ones.map(block => (
              <div
              key={block.id}
                draggable
                onDragStart={(e) => handleDragStart(e, block)}
                className={`${block.color} w-10 h-10 rounded flex items-center justify-center font-bold cursor-grab`}
              >
                {block.value}
              </div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Check answer button */}
      <button
        onClick={checkAnswer}
        className="px-6 py-3 bg-green-500 text-white rounded-lg font-bold hover:bg-green-600 transition-colors"
      >
        Check Answer
      </button>
      
      {/* Success message */}
      {showSuccess && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-green-100 text-green-800 rounded-lg text-center"
        >
          <div className="text-xl font-bold">Correct! 🎉</div>
          <div>You built {targetNumber} perfectly!</div>
        </motion.div>
      )}
      
      {/* Error message */}
      {showError && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-red-100 text-red-800 rounded-lg text-center"
        >
          <div className="text-xl font-bold">Not quite right</div>
          <div>Try again! Check your place values.</div>
        </motion.div>
      )}
      
      {/* Score display */}
      <div className="mt-4 text-sm text-gray-600">
        Score: {score} | Level: {level + 1}/{levels.length}
      </div>
    </div>
  );
};

export default PlaceValueBuilder; 