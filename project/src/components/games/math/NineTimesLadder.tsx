import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface LadderRung {
  id: number;
  equation: string;
  answer: number;
  isCorrect: boolean | null;
}

interface DragItem {
  type: string;
  id: number;
  value: number;
}

// DragAnswer component
const DragAnswer: React.FC<{
  id: number;
  value: number;
  isUsed: boolean;
}> = ({ id, value, isUsed }) => {
  const [{ isDragging }, drag] = useDrag({
    type: 'answer',
    item: { type: 'answer', id, value },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !isUsed,
  });
  
  return (
    <motion.div
      ref={drag}
      className={`px-4 py-2 rounded-lg text-center font-bold text-lg ${!isUsed ? 'cursor-grab' : 'cursor-not-allowed'}
        ${isUsed ? 'bg-gray-200 text-gray-400' : 'bg-blue-100 text-blue-700 hover:bg-blue-200'} 
        ${isDragging ? 'opacity-50' : 'opacity-100'}`}
      whileHover={!isUsed ? { scale: 1.05 } : {}}
      whileTap={!isUsed ? { scale: 0.95 } : {}}
    >
      {value}
    </motion.div>
  );
};

// DropTarget component
const DropTarget: React.FC<{
  rung: LadderRung;
  onDrop: (rungId: number, answerId: number, value: number) => void;
}> = ({ rung, onDrop }) => {
  const [{ isOver, canDrop }, drop] = useDrop({
    accept: 'answer',
    drop: (item: DragItem) => {
      onDrop(rung.id, item.id, item.value);
      return undefined;
    },
    canDrop: () => rung.isCorrect === null,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop(),
    }),
  });
  
  // Determine the background color based on drop state and correctness
  let bgColor = 'bg-gray-100';
  if (isOver && canDrop) {
    bgColor = 'bg-yellow-100';
  } else if (rung.isCorrect === true) {
    bgColor = 'bg-green-100';
  } else if (rung.isCorrect === false) {
    bgColor = 'bg-red-100';
  }
  
  return (
    <div className="flex items-center gap-4 mb-2">
      <div className="w-24 text-right font-medium">{rung.equation}</div>
      <div 
        ref={drop}
        className={`w-16 h-12 flex items-center justify-center rounded-lg border-2 ${bgColor} ${
          isOver && canDrop ? 'border-yellow-400' : 
          rung.isCorrect === true ? 'border-green-500' : 
          rung.isCorrect === false ? 'border-red-500' : 
          'border-gray-300'
        }`}
      >
        {rung.isCorrect !== null && (
          <div className="font-bold text-lg">
            {rung.answer}
          </div>
        )}
      </div>
      <div className="text-sm text-gray-600">
        {rung.isCorrect === true && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-green-600 flex items-center"
          >
            <span className="mr-1">✓</span> Correct!
          </motion.div>
        )}
        {rung.isCorrect === false && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-red-600 flex items-center"
          >
            <span className="mr-1">✗</span> Try again
          </motion.div>
        )}
      </div>
    </div>
  );
};

// Main component
const NineTimesLadder: React.FC = () => {
  const [rungs, setRungs] = useState<LadderRung[]>([]);
  const [answers, setAnswers] = useState<number[]>([]);
  const [usedAnswers, setUsedAnswers] = useState<number[]>([]);
  const [isComplete, setIsComplete] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [showPattern, setShowPattern] = useState<boolean>(false);
  const [isRocketLaunched, setIsRocketLaunched] = useState<boolean>(false);
  const [rocketPosition, setRocketPosition] = useState<number>(0);
  
  // Initialize the ladder rungs and answers
  useEffect(() => {
    const initialRungs: LadderRung[] = Array.from({ length: 10 }, (_, i) => ({
      id: i + 1,
      equation: `9 × ${i + 1}`,
      answer: 9 * (i + 1),
      isCorrect: null,
    }));
    
    const initialAnswers = initialRungs.map(rung => rung.answer);
    // Shuffle the answers
    const shuffledAnswers = [...initialAnswers].sort(() => Math.random() - 0.5);
    
    setRungs(initialRungs);
    setAnswers(shuffledAnswers);
    setUsedAnswers([]);
  }, []);
  
  // Check if all rungs are correctly filled
  useEffect(() => {
    if (rungs.length > 0) {
      // Count correct answers and update rocket position
      const correctCount = rungs.filter(rung => rung.isCorrect === true).length;
      setRocketPosition(correctCount * 10); // Move rocket up based on correct answers
      
      // Check if all are correct
      if (correctCount === rungs.length) {
        setIsComplete(true);
        setShowConfetti(true);
        setTimeout(() => {
          setShowConfetti(false);
          setShowPattern(true);
        }, 3000);
      }
    }
  }, [rungs]);
  
  const handleDrop = (rungId: number, answerId: number, value: number) => {
    // Find the rung
    const targetRung = rungs.find(r => r.id === rungId);
    
    if (!targetRung || targetRung.isCorrect !== null) return; // Skip if rung already has an answer
    
    // Check if the answer is correct
    const isCorrect = targetRung.answer === value;
    
    if (isCorrect) {
      // Update only the specific rung to show it's correct
      const updatedRungs = [...rungs];
      const rungIndex = updatedRungs.findIndex(r => r.id === rungId);
      if (rungIndex !== -1) {
        updatedRungs[rungIndex] = { ...updatedRungs[rungIndex], isCorrect: true };
      }
      
      setRungs(updatedRungs);
      
      // Add to used answers
      setUsedAnswers([...usedAnswers, value]);
      
      // Play success sound
      new Audio('/audio/correct.mp3').play().catch(e => console.log('Audio play error:', e));
    } else {
      // Only update the current rung to show it's incorrect
      const updatedRungs = [...rungs];
      const rungIndex = updatedRungs.findIndex(r => r.id === rungId);
      if (rungIndex !== -1) {
        updatedRungs[rungIndex] = { ...updatedRungs[rungIndex], isCorrect: false };
      }
      
      setRungs(updatedRungs);
      
      // Play error sound
      new Audio('/audio/incorrect.mp3').play().catch(e => console.log('Audio play error:', e));
      
      // Reset only the current rung after a moment, preserving other correct answers
      setTimeout(() => {
        const resetRungs = [...rungs];
        const rungIndex = resetRungs.findIndex(r => r.id === rungId);
        if (rungIndex !== -1) {
          resetRungs[rungIndex] = { ...resetRungs[rungIndex], isCorrect: null };
        }
        setRungs(resetRungs);
      }, 1000);
    }
  };
  
  const launchRocket = () => {
    setIsRocketLaunched(true);
    new Audio('/audio/win.mp3').play().catch(e => console.log('Audio play error:', e));
  };
  
  // Calculate the sum of digits for a number
  const sumOfDigits = (num: number): number => {
    return num.toString().split('').reduce((sum, digit) => sum + parseInt(digit), 0);
  };
  
  // Backend for drag and drop based on device
  const backendForDND = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <div className="bg-white rounded-lg p-6 shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Build the 9× Table Ladder</h2>
        
        <div className="mb-6 text-center">
          <div className="text-lg font-medium mb-2">
            Drag the correct answers to complete the 9× multiplication table
          </div>
          <div className="text-sm text-gray-600">
            Build the ladder from bottom to top to launch the rocket!
          </div>
        </div>
        
        <div className="flex flex-col md:flex-row gap-8">
          {/* Ladder visualization */}
          <div className="flex-1">
            <div className="relative">
              {/* Ladder */}
              <div className="bg-amber-50 rounded-lg p-4 border-2 border-amber-200">
                {rungs.map((rung) => (
                  <DropTarget 
                    key={rung.id} 
                    rung={rung} 
                    onDrop={handleDrop} 
                  />
                ))}
              </div>
              
              {/* Rocket */}
              <motion.div
                className="absolute left-1/2 -bottom-16 transform -translate-x-1/2"
                initial={{ y: 0 }}
                animate={{ y: isRocketLaunched ? -500 : -rocketPosition }}
                transition={{ duration: isRocketLaunched ? 3 : 0.5, ease: "easeInOut" }}
              >
                <div className="text-4xl">🚀</div>
              </motion.div>
            </div>
          </div>
          
          {/* Answer tiles */}
          <div className="flex-1">
            <div className="bg-blue-50 rounded-lg p-4 border-2 border-blue-100">
              <div className="text-lg font-medium mb-4 text-center">Answer Tiles</div>
              <div className="grid grid-cols-2 gap-2">
                {answers.map((answer, index) => (
                  <DragAnswer 
                    key={`answer-${index}-${answer}`}
                    id={index} 
                    value={answer} 
                    isUsed={usedAnswers.includes(answer)} 
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
        
        {/* Completion section */}
        {isComplete && !isRocketLaunched && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-8 text-center"
          >
            <div className="text-xl font-bold mb-4">
              Great job! You've completed the 9× table ladder!
            </div>
            <button
              onClick={launchRocket}
              className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-medium"
            >
              Launch the Rocket! 🚀
            </button>
          </motion.div>
        )}
        
        {/* Pattern discovery section */}
        {showPattern && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-8 bg-purple-50 p-6 rounded-lg"
          >
            <div className="text-xl font-bold text-center mb-4">
              Amazing Pattern Discovery!
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {rungs.map(rung => (
                <div key={rung.id} className="bg-white p-3 rounded-lg shadow-sm">
                  <div className="flex justify-between items-center">
                    <div className="font-bold">{rung.equation} = {rung.answer}</div>
                    <div className="text-sm">
                      {rung.answer.toString().split('').join(' + ')} = {sumOfDigits(rung.answer)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="text-center mt-4 text-lg font-medium">
              Did you notice? In the 9× table, the digits always add up to 9!
            </div>
          </motion.div>
        )}
        
        {showConfetti && <ConfettiEffect />}
      </div>
    </DndProvider>
  );
};

export default NineTimesLadder; 