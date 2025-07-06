import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

// Instruction block types
type InstructionType = 'forward' | 'left' | 'right';

// Instruction interface
interface Instruction {
  id: string;
  type: InstructionType;
  label: string;
  icon: string;
}

// Position interface for the robot
interface Position {
  x: number;
  y: number;
  direction: 'up' | 'right' | 'down' | 'left';
}

// Cell interface for the maze grid
interface Cell {
  x: number;
  y: number;
  hasWall: boolean;
  isGoal: boolean;
  isStart: boolean;
}

// Level interface
interface Level {
  grid: Cell[][];
  startPosition: Position;
  goalPosition: { x: number; y: number };
  availableInstructions: Instruction[];
  maxInstructions: number;
}

interface DragToCodeMazeProps {
  onComplete?: () => void;
}

const DragToCodeMaze: React.FC<DragToCodeMazeProps> = ({ onComplete }) => {
  // Level definitions
  const levels: Level[] = [
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: true, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 2, direction: 'up' },
      goalPosition: { x: 1, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Step Forward', icon: '⬆️' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '⬅️' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '➡️' },
      ],
      maxInstructions: 5,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: true, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: true, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 2, direction: 'up' },
      goalPosition: { x: 2, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Step Forward', icon: '⬆️' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '⬅️' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '➡️' },
        { id: 'forward-2', type: 'forward', label: 'Step Forward', icon: '⬆️' },
      ],
      maxInstructions: 6,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: true, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: true }],
      ],
      startPosition: { x: 3, y: 3, direction: 'up' },
      goalPosition: { x: 0, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Step Forward', icon: '⬆️' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '⬅️' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '➡️' },
        { id: 'forward-2', type: 'forward', label: 'Step Forward', icon: '⬆️' },
        { id: 'forward-3', type: 'forward', label: 'Step Forward', icon: '⬆️' },
      ],
      maxInstructions: 8,
    }
  ];

  // Game state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [userSequence, setUserSequence] = useState<Instruction[]>([]);
  const [robotPosition, setRobotPosition] = useState<Position>(levels[0].startPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [path, setPath] = useState<Position[]>([]);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [levelComplete, setLevelComplete] = useState(false);
  const [allLevelsComplete, setAllLevelsComplete] = useState(false);
  const [draggedItem, setDraggedItem] = useState<Instruction | null>(null);

  // Reset the robot position
  const resetRobot = () => {
    setRobotPosition(levels[currentLevel].startPosition);
    setPath([]);
    setShowPath(false);
    setSuccess(false);
    setErrorMessage(null);
  };

  // Handle drag start event
  const handleDragStart = useCallback((e: React.DragEvent, instruction: Instruction) => {
    e.dataTransfer.setData('instruction', JSON.stringify({
      ...instruction,
      id: `${instruction.type}-${Date.now()}` // Create a unique ID
    }));
    setDraggedItem(instruction);
    
    // Set visual feedback for the dragged item
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
    
    // Play sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }, []);

  // Handle drag over event (needed to allow dropping)
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle drop event
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    
    // Check if we have reached the max instructions
    if (userSequence.length >= levels[currentLevel].maxInstructions) {
      setErrorMessage(`You can only use up to ${levels[currentLevel].maxInstructions} instructions!`);
      return;
    }
    
    const data = e.dataTransfer.getData('instruction');
    if (data) {
      const instruction = JSON.stringify(data) === '{}' 
        ? null 
        : JSON.parse(data) as Instruction;
      
      if (instruction) {
        setUserSequence(prev => [...prev, instruction]);
        
        // Play sound
        try {
          new Audio('/audio/pop.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
      }
    }
    
    // Reset dragged item state
    setDraggedItem(null);
  }, [userSequence, levels, currentLevel]);

  // Handle drag end (cleanup)
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedItem(null);
  }, []);

  // Handle removing an instruction from the sequence
  const handleRemoveInstruction = useCallback((index: number) => {
    setUserSequence(prev => {
      const newSequence = [...prev];
      newSequence.splice(index, 1);
      return newSequence;
    });
    
    // Play sound
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }, []);

  // Move the robot forward
  const moveForward = (position: Position): Position => {
    const grid = levels[currentLevel].grid;
    const gridSize = grid.length;
    let newPosition = { ...position };
    
    switch (position.direction) {
      case 'up':
        if (position.y > 0 && !grid[position.y - 1][position.x].hasWall) {
          newPosition.y--;
        } else {
          // Play bump sound
          try {
            new Audio('/audio/incorrect.mp3').play();
          } catch (e) {
            console.error('Failed to play sound:', e);
          }
        }
        break;
      case 'right':
        if (position.x < gridSize - 1 && !grid[position.y][position.x + 1].hasWall) {
          newPosition.x++;
        } else {
          // Play bump sound
          try {
            new Audio('/audio/incorrect.mp3').play();
          } catch (e) {
            console.error('Failed to play sound:', e);
          }
        }
        break;
      case 'down':
        if (position.y < gridSize - 1 && !grid[position.y + 1][position.x].hasWall) {
          newPosition.y++;
        } else {
          // Play bump sound
          try {
            new Audio('/audio/incorrect.mp3').play();
          } catch (e) {
            console.error('Failed to play sound:', e);
          }
        }
        break;
      case 'left':
        if (position.x > 0 && !grid[position.y][position.x - 1].hasWall) {
          newPosition.x--;
        } else {
          // Play bump sound
          try {
            new Audio('/audio/incorrect.mp3').play();
          } catch (e) {
            console.error('Failed to play sound:', e);
          }
        }
        break;
    }
    
    return newPosition;
  };

  // Turn the robot left
  const turnLeft = (position: Position): Position => {
    const newPosition = { ...position };
    
    switch (position.direction) {
      case 'up':
        newPosition.direction = 'left';
        break;
      case 'right':
        newPosition.direction = 'up';
        break;
      case 'down':
        newPosition.direction = 'right';
        break;
      case 'left':
        newPosition.direction = 'down';
        break;
    }
    
    return newPosition;
  };

  // Turn the robot right
  const turnRight = (position: Position): Position => {
    const newPosition = { ...position };
    
    switch (position.direction) {
      case 'up':
        newPosition.direction = 'right';
        break;
      case 'right':
        newPosition.direction = 'down';
        break;
      case 'down':
        newPosition.direction = 'left';
        break;
      case 'left':
        newPosition.direction = 'up';
        break;
    }
    
    return newPosition;
  };

  // Execute the sequence of instructions
  const executeSequence = async () => {
    if (userSequence.length === 0) {
      setErrorMessage("Add some instructions first!");
      return;
    }
    
    setIsAnimating(true);
    resetRobot();
    setShowPath(true);
    
    let currentPosition = { ...levels[currentLevel].startPosition };
    const newPath = [{ ...currentPosition }];
    
    // Execute each instruction with animation delay
    for (let i = 0; i < userSequence.length; i++) {
      const instruction = userSequence[i];
      
      // Update position based on instruction
      if (instruction.type === 'forward') {
        currentPosition = moveForward(currentPosition);
      } else if (instruction.type === 'left') {
        currentPosition = turnLeft(currentPosition);
        // Play turn sound
        try {
          new Audio('/audio/click.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
      } else if (instruction.type === 'right') {
        currentPosition = turnRight(currentPosition);
        // Play turn sound
        try {
          new Audio('/audio/click.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
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
      currentPosition.x === levels[currentLevel].goalPosition.x && 
      currentPosition.y === levels[currentLevel].goalPosition.y;
    
    if (reachedGoal) {
      setSuccess(true);
      setShowConfetti(true);
      setLevelComplete(true);
      
      // Play success sound
      try {
        new Audio('/audio/correct.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      setTimeout(() => {
        setShowConfetti(false);
        
        // Check if this was the last level
        if (currentLevel === levels.length - 1) {
          setAllLevelsComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      }, 3000);
    } else {
      setErrorMessage("Not quite there yet. Try again!");
      
      // Play fail sound
      try {
        new Audio('/audio/fail.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
    
    setIsAnimating(false);
  };

  // Clear the sequence
  const clearSequence = () => {
    setUserSequence([]);
    resetRobot();
    
    // Play clear sound
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  // Move to the next level
  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserSequence([]);
      resetRobot();
      setErrorMessage(null);
      setLevelComplete(false);
      
      // Play level up sound
      try {
        new Audio('/audio/cheer.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
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

  // Render the grid cell
  const renderCell = (cell: Cell) => {
    const isRobot = robotPosition.x === cell.x && robotPosition.y === cell.y;
    const hasPath = path.some(pos => pos.x === cell.x && pos.y === cell.y);
    
    return (
      <div 
        key={`${cell.x}-${cell.y}`}
        className={`
          aspect-square border border-gray-300 rounded-md flex items-center justify-center relative
          ${cell.isGoal ? 'bg-green-200' : cell.hasWall ? 'bg-gray-700' : 'bg-white'}
          ${hasPath && showPath && !cell.hasWall ? 'bg-blue-100' : ''}
        `}
      >
        {isRobot && !cell.hasWall && (
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1, rotate: getRobotRotation() }}
            transition={{ duration: 0.3 }}
            className="text-3xl"
          >
            🤖
          </motion.div>
        )}
        {cell.isGoal && !isRobot && <div className="text-3xl">🚩</div>}
        {cell.isStart && !isRobot && <div className="absolute top-0 left-0 w-3 h-3 bg-blue-500 rounded-full m-1"></div>}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-4">
        <h2 className="text-xl font-bold mb-2">Drag-to-Code Maze</h2>
        <p className="text-gray-600">
          Help the robot reach the flag by creating a sequence of instructions!
        </p>
      </div>
      
      <div className="mb-4">
        <div className="flex justify-between items-center mb-2">
          <div className="font-bold">Level {currentLevel + 1} of {levels.length}</div>
          {levelComplete && currentLevel < levels.length - 1 && (
            <button 
              onClick={nextLevel}
              className="bg-green-500 text-white px-4 py-1 rounded-full text-sm font-medium hover:bg-green-600 flex items-center"
            >
              Next Level
              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          )}
        </div>
        
        <div className="w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${((currentLevel + (levelComplete ? 1 : 0)) / levels.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Maze grid */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="mb-4 font-bold">Maze</div>
          <div 
            className="grid gap-1" 
            style={{ 
              gridTemplateColumns: `repeat(${levels[currentLevel].grid[0].length}, 1fr)`,
              gridTemplateRows: `repeat(${levels[currentLevel].grid.length}, 1fr)`
            }}
          >
            {levels[currentLevel].grid.flat().map(cell => renderCell(cell))}
          </div>
        </div>
        
        {/* Code blocks */}
        <div>
          {/* Available instructions */}
          <div className="mb-4">
            <div className="font-bold mb-2">Available Instructions</div>
            <div className="flex flex-wrap gap-2 min-h-16 bg-gray-100 p-2 rounded-lg">
              {levels[currentLevel].availableInstructions.map((instruction, index) => (
                <div
                  key={instruction.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, instruction)}
                  onDragEnd={handleDragEnd}
                  className={`
                    px-3 py-2 rounded-md flex items-center gap-2 cursor-grab active:cursor-grabbing
                    ${instruction.type === 'forward' ? 'bg-blue-100 text-blue-800' : 
                      instruction.type === 'left' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}
                  `}
                >
                  <span className="text-xl">{instruction.icon}</span>
                  <span>{instruction.label}</span>
                </div>
              ))}
            </div>
          </div>
          
          {/* User sequence */}
          <div className="mb-4">
            <div className="font-bold mb-2">Your Code</div>
            <div 
              onDragOver={handleDragOver}
              onDrop={handleDrop}
              className="flex flex-wrap gap-2 min-h-16 bg-gray-100 p-2 rounded-lg border-2 border-dashed border-gray-300"
            >
              {userSequence.map((instruction, index) => (
                <div
                  key={instruction.id}
                  className={`
                    px-3 py-2 rounded-md flex items-center gap-2 cursor-grab relative
                    ${instruction.type === 'forward' ? 'bg-blue-100 text-blue-800' : 
                      instruction.type === 'left' ? 'bg-yellow-100 text-yellow-800' : 
                      'bg-green-100 text-green-800'}
                  `}
                >
                  <span className="text-xl">{instruction.icon}</span>
                  <span>{instruction.label}</span>
                  <button 
                    onClick={() => handleRemoveInstruction(index)}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600"
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
            <div className="text-xs text-gray-500 mt-1">
              {userSequence.length}/{levels[currentLevel].maxInstructions} instructions used
            </div>
          </div>
          
          {/* Control buttons */}
          <div className="flex gap-2">
            <button
              onClick={executeSequence}
              disabled={isAnimating || userSequence.length === 0}
              className={`
                flex-1 px-4 py-2 rounded-md font-medium flex items-center justify-center gap-1
                ${isAnimating 
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-blue-600 text-white hover:bg-blue-700'}
              `}
            >
              {isAnimating ? (
                <>
                  <svg className="animate-spin h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Running...
                </>
              ) : (
                <>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  Run
                </>
              )}
            </button>
            
            <button
              onClick={clearSequence}
              disabled={isAnimating || userSequence.length === 0}
              className={`
                px-4 py-2 rounded-md font-medium
                ${isAnimating || userSequence.length === 0
                  ? 'bg-gray-300 text-gray-500 cursor-not-allowed' 
                  : 'bg-red-100 text-red-700 hover:bg-red-200'}
              `}
            >
              Clear
            </button>
          </div>
        </div>
      </div>
      
      {/* Error message */}
      {errorMessage && (
        <div className="mt-4 p-3 bg-red-100 text-red-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMessage}
        </div>
      )}
      
      {/* Success message */}
      {success && (
        <div className="mt-4 p-3 bg-green-100 text-green-700 rounded-md flex items-center">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {allLevelsComplete 
            ? "Amazing! You've completed all levels!" 
            : "Great job! You've reached the goal!"}
        </div>
      )}
      
      {/* Confetti effect */}
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default DragToCodeMaze; 