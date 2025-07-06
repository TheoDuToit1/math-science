import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

// Instruction block types
type InstructionType = 'forward' | 'left' | 'right';
type Direction = 'up' | 'right' | 'down' | 'left';

interface Instruction {
  id: string;
  type: InstructionType;
  label: string;
  icon: string;
}

interface Position {
  x: number;
  y: number;
  direction: Direction;
}

interface CodeTheGridProps {
  onComplete?: () => void;
}

const CodeTheGrid: React.FC<CodeTheGridProps> = ({ onComplete }) => {
  // Available instruction blocks
  const availableInstructions: Instruction[] = [
    { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
    { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
    { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
    { id: 'forward-2', type: 'forward', label: 'Move Forward', icon: '🡹' },
    { id: 'left-2', type: 'left', label: 'Turn Left', icon: '🡸' },
    { id: 'right-2', type: 'right', label: 'Turn Right', icon: '🡺' },
    { id: 'forward-3', type: 'forward', label: 'Move Forward', icon: '🡹' },
    { id: 'forward-4', type: 'forward', label: 'Move Forward', icon: '🡹' },
  ];

  // User's sequence of instructions
  const [userSequence, setUserSequence] = useState<Instruction[]>([]);
  
  // Grid state
  const [gridSize] = useState(5);
  const [robotPosition, setRobotPosition] = useState<Position>({ x: 0, y: 4, direction: 'up' });
  const [goalPosition] = useState({ x: 4, y: 0 });
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [path, setPath] = useState<Position[]>([]);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Reset the robot position
  const resetRobot = useCallback(() => {
    setRobotPosition({ x: 0, y: 4, direction: 'up' });
    setPath([]);
    setShowPath(false);
    setSuccess(false);
    setErrorMessage(null);
  }, []);

  // Handle drag and drop of instruction blocks
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    
    // Find the instruction from available instructions
    const instruction = availableInstructions.find(item => item.id === itemId);
    
    if (instruction) {
      // Create a new instance with unique ID
      const newItem = {
        ...instruction,
        id: `${instruction.type}-${Date.now()}-${Math.random().toString(36).substr(2, 5)}`
      };
      
      // Add to user sequence
      setUserSequence(prev => [...prev, newItem]);
      
      // Play sound effect
      new Audio('/audio/pop.mp3').play().catch(e => console.log('Audio play error:', e));
    }
  }, [availableInstructions]);

  // Execute the sequence of instructions
  const executeSequence = useCallback(async () => {
    if (userSequence.length === 0) {
      setErrorMessage("Add some instructions first!");
      return;
    }
    
    setIsAnimating(true);
    resetRobot();
    setShowPath(true);
    
    let currentPosition = { x: 0, y: 4, direction: 'up' as Direction };
    const newPath = [{ ...currentPosition }];
    
    // Execute each instruction with animation delay
    for (let i = 0; i < userSequence.length; i++) {
      const instruction = userSequence[i];
      
      // Update position based on instruction
      if (instruction.type === 'forward') {
        switch (currentPosition.direction) {
          case 'up':
            currentPosition.y = Math.max(0, currentPosition.y - 1);
            break;
          case 'right':
            currentPosition.x = Math.min(gridSize - 1, currentPosition.x + 1);
            break;
          case 'down':
            currentPosition.y = Math.min(gridSize - 1, currentPosition.y + 1);
            break;
          case 'left':
            currentPosition.x = Math.max(0, currentPosition.x - 1);
            break;
        }
      } else if (instruction.type === 'left') {
        switch (currentPosition.direction) {
          case 'up':
            currentPosition.direction = 'left';
            break;
          case 'right':
            currentPosition.direction = 'up';
            break;
          case 'down':
            currentPosition.direction = 'right';
            break;
          case 'left':
            currentPosition.direction = 'down';
            break;
        }
      } else if (instruction.type === 'right') {
        switch (currentPosition.direction) {
          case 'up':
            currentPosition.direction = 'right';
            break;
          case 'right':
            currentPosition.direction = 'down';
            break;
          case 'down':
            currentPosition.direction = 'left';
            break;
          case 'left':
            currentPosition.direction = 'up';
            break;
        }
      }
      
      // Add position to path
      newPath.push({ ...currentPosition });
      
      // Update robot position with animation delay
      setRobotPosition({ ...currentPosition });
      setPath([...newPath]);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Check if robot reached the goal
    const reachedGoal = 
      currentPosition.x === goalPosition.x && 
      currentPosition.y === goalPosition.y;
    
    if (reachedGoal) {
      setSuccess(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
      // Call onComplete callback if provided
      if (onComplete) {
        onComplete();
      }
    } else {
      setErrorMessage("Not quite there yet. Try again!");
    }
    
    setIsAnimating(false);
  }, [userSequence, resetRobot, gridSize, goalPosition, onComplete]);

  // Clear the sequence
  const clearSequence = useCallback(() => {
    setUserSequence([]);
    resetRobot();
  }, [resetRobot]);

  // Remove an instruction from the sequence
  const removeInstruction = useCallback((index: number) => {
    setUserSequence(prev => {
      const newSequence = [...prev];
      newSequence.splice(index, 1);
      return newSequence;
    });
  }, []);

  // Render the grid cell
  const renderCell = (x: number, y: number) => {
    const isRobot = robotPosition.x === x && robotPosition.y === y;
    const isGoal = goalPosition.x === x && goalPosition.y === y;
    const hasPath = path.some(pos => pos.x === x && pos.y === y);
    const isLastPath = path.length > 0 && path[path.length - 1].x === x && path[path.length - 1].y === y;
    return (
      <motion.div
        key={`${x}-${y}`}
        className={
          `aspect-square border border-gray-300 rounded-md flex items-center justify-center relative
          ${isGoal ? 'bg-green-200' : 'bg-white'}
          ${hasPath && showPath ? 'bg-blue-50' : ''}`
        }
        layout
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
      >
        {/* Glowing path effect */}
        {hasPath && showPath && !isRobot && (
          <motion.div
            className={`absolute inset-1 rounded-md pointer-events-none z-0`}
            style={{ boxShadow: isLastPath ? '0 0 16px 6px #60a5fa' : '0 0 8px 2px #bae6fd' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
        {isRobot && (
          <motion.div
            layout
            initial={false}
            animate={{
              scale: success ? [1, 1.2, 1] : errorMessage ? [1, 1.1, 0.9, 1.1, 1] : 1,
              rotate: getRobotRotation(),
              y: 0,
              x: 0,
              boxShadow: success ? '0 0 24px 8px #34d399' : errorMessage ? '0 0 12px 4px #f87171' : 'none',
            }}
            transition={{
              type: 'spring',
              stiffness: 300,
              damping: 20,
              duration: 0.5,
              repeat: (success || errorMessage) ? 2 : 0,
              repeatType: 'loop',
            }}
            className="text-3xl z-10"
          >
            🤖
          </motion.div>
        )}
        {isGoal && !isRobot && <div className="text-3xl">🚩</div>}
      </motion.div>
    );
  };

  // Get rotation angle based on robot direction
  const getRobotRotation = () => {
    switch (robotPosition.direction) {
      case 'up': return 0;
      case 'right': return 90;
      case 'down': return 180;
      case 'left': return 270;
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Code the Grid</h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg mb-2">
          Guide the robot to the flag by creating a sequence of instructions!
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Drag and drop commands to build your sequence, then press Play to test it.
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grid side */}
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-5 gap-1 w-full max-w-xs mb-4">
            {Array.from({ length: gridSize * gridSize }).map((_, index) => {
              const x = index % gridSize;
              const y = Math.floor(index / gridSize);
              return renderCell(x, y);
            })}
          </div>
          
          <div className="flex gap-2 mt-4">
            <button
              onClick={executeSequence}
              disabled={isAnimating || userSequence.length === 0}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                isAnimating || userSequence.length === 0
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-green-500 text-white hover:bg-green-600'
              }`}
            >
              <span className="mr-1">▶️</span> Play
            </button>
            <button
              onClick={resetRobot}
              disabled={isAnimating}
              className={`px-4 py-2 rounded-lg font-medium flex items-center ${
                isAnimating
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-yellow-500 text-white hover:bg-yellow-600'
              }`}
            >
              <span className="mr-1">🔄</span> Reset
            </button>
          </div>
          
          {errorMessage && (
            <div className="mt-4 p-2 bg-red-100 text-red-700 rounded-lg text-center">
              {errorMessage}
            </div>
          )}
          
          {success && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-bold"
            >
              🎉 Great job! You guided the robot to the flag!
            </motion.div>
          )}
        </div>
        
        {/* Instructions side */}
        <div className="flex flex-col">
          {/* User sequence */}
          <div className="mb-4">
            <div className="font-medium mb-2">Your Sequence:</div>
            <div 
              className="min-h-16 bg-gray-100 p-2 rounded-lg flex flex-wrap gap-2" 
              style={{ minHeight: '80px' }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
            >
              {userSequence.length > 0 ? (
                userSequence.map((instruction, index) => (
                  <div 
                    key={instruction.id}
                    className={`
                      px-3 py-2 rounded-lg flex items-center gap-2 relative group
                      ${instruction.type === 'forward' ? 'bg-blue-500 text-white' : 
                        instruction.type === 'left' ? 'bg-purple-500 text-white' : 
                        'bg-orange-500 text-white'}
                    `}
                  >
                    <span className="text-xl">{instruction.icon}</span>
                    <span className="text-sm">{instruction.label}</span>
                    <button 
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => removeInstruction(index)}
                    >
                      ×
                    </button>
                  </div>
                ))
              ) : (
                <div className="text-gray-500 text-sm p-2">
                  Drag instructions here
                </div>
              )}
            </div>
            
            <div className="mt-2 flex justify-end">
              <button
                onClick={clearSequence}
                disabled={isAnimating || userSequence.length === 0}
                className={`px-3 py-1 text-sm rounded-lg ${
                  isAnimating || userSequence.length === 0
                    ? 'bg-gray-200 text-gray-500'
                    : 'bg-red-100 text-red-700 hover:bg-red-200'
                }`}
              >
                Clear All
              </button>
            </div>
          </div>
          
          {/* Available instructions */}
          <div>
            <div className="font-medium mb-2">Available Instructions:</div>
            <div className="bg-gray-100 p-2 rounded-lg flex flex-wrap gap-2">
              {availableInstructions.map((instruction) => (
                <div
                  key={instruction.id}
                  className={`
                    px-3 py-2 rounded-lg flex items-center gap-2 cursor-grab
                    ${instruction.type === 'forward' ? 'bg-blue-500 text-white' : 
                      instruction.type === 'left' ? 'bg-purple-500 text-white' : 
                      'bg-orange-500 text-white'}
                  `}
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', instruction.id);
                  }}
                >
                  <span className="text-xl">{instruction.icon}</span>
                  <span className="text-sm">{instruction.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 p-3 rounded-lg">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Drag commands from Available Instructions to Your Sequence</li>
              <li>Press Play to see the robot follow your instructions</li>
              <li>Guide the robot to the flag to win!</li>
              <li>You can remove commands from your sequence by clicking the × button</li>
            </ol>
          </div>
        </div>
      </div>
      
      {showConfetti && <ConfettiEffect active={true} />}
      {success && <SoundPlayer sound="/audio/correct-6033.mp3" autoPlay />}
      {errorMessage && <SoundPlayer sound="/audio/fail.mp3" autoPlay />}
    </div>
  );
};

export default CodeTheGrid; 