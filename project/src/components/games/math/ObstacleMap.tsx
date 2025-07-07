import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

// Instruction block types
type InstructionType = 'forward' | 'left' | 'right' | 'if-wall-left' | 'if-wall-right' | 'if-wall-ahead';

interface Instruction {
  id: string;
  type: InstructionType;
  label: string;
  icon: string;
  isCondition?: boolean;
  thenAction?: {
    type: 'forward' | 'left' | 'right';
    label: string;
    icon: string;
  };
}

interface Position {
  x: number;
  y: number;
  direction: 'up' | 'right' | 'down' | 'left';
}

interface Cell {
  x: number;
  y: number;
  hasWall: boolean;
  isGoal: boolean;
  isStart: boolean;
}

// Level definitions
interface Level {
  grid: Cell[][];
  startPosition: Position;
  goalPosition: { x: number; y: number };
  availableInstructions: Instruction[];
  maxInstructions: number;
}

interface ObstacleMapProps {
  onComplete?: () => void;
}

const ObstacleMap: React.FC<ObstacleMapProps> = ({ onComplete }) => {
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
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { 
          id: 'if-wall-ahead-1', 
          type: 'if-wall-ahead', 
          label: 'IF Wall Ahead', 
          icon: '⚠️', 
          isCondition: true,
          thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' }
        },
      ],
      maxInstructions: 5,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: true, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 3, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { 
          id: 'if-wall-ahead-1', 
          type: 'if-wall-ahead', 
          label: 'IF Wall Ahead', 
          icon: '⚠️', 
          isCondition: true,
          thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' }
        },
        { 
          id: 'if-wall-right-1', 
          type: 'if-wall-right', 
          label: 'IF Wall Right', 
          icon: '⚠️', 
          isCondition: true,
          thenAction: { type: 'left', label: 'THEN Turn Left', icon: '🡸' }
        },
      ],
      maxInstructions: 8,
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
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
      ],
      maxInstructions: 6,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: true, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: true, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 3, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-left-1', type: 'if-wall-left', label: 'IF Wall Left', icon: '⚠️', isCondition: true, thenAction: { type: 'forward', label: 'THEN Move Forward', icon: '🡹' } },
      ],
      maxInstructions: 9,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: true, isStart: false }, { x: 3, y: 0, hasWall: true, isGoal: false, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 3, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-right-1', type: 'if-wall-right', label: 'IF Wall Right', icon: '⚠️', isCondition: true, thenAction: { type: 'left', label: 'THEN Turn Left', icon: '🡸' } },
      ],
      maxInstructions: 10,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: true, isStart: false }, { x: 4, y: 0, hasWall: true, isGoal: false, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 3, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-left-1', type: 'if-wall-left', label: 'IF Wall Left', icon: '⚠️', isCondition: true, thenAction: { type: 'forward', label: 'THEN Move Forward', icon: '🡹' } },
      ],
      maxInstructions: 12,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 0, hasWall: false, isGoal: true, isStart: false }, { x: 5, y: 0, hasWall: true, isGoal: false, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 4, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-right-1', type: 'if-wall-right', label: 'IF Wall Right', icon: '⚠️', isCondition: true, thenAction: { type: 'left', label: 'THEN Turn Left', icon: '🡸' } },
      ],
      maxInstructions: 13,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 0, hasWall: false, isGoal: true, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 5, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-right-1', type: 'if-wall-right', label: 'IF Wall Right', icon: '⚠️', isCondition: true, thenAction: { type: 'left', label: 'THEN Turn Left', icon: '🡸' } },
      ],
      maxInstructions: 15,
    },
    {
      grid: [
        [{ x: 0, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 0, hasWall: false, isGoal: false, isStart: false }, { x: 6, y: 0, hasWall: false, isGoal: true, isStart: false }],
        [{ x: 0, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 1, hasWall: true, isGoal: false, isStart: false }, { x: 2, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 1, hasWall: false, isGoal: false, isStart: false }, { x: 6, y: 1, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 1, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 2, hasWall: false, isGoal: false, isStart: false }, { x: 6, y: 2, hasWall: false, isGoal: false, isStart: false }],
        [{ x: 0, y: 3, hasWall: false, isGoal: false, isStart: true }, { x: 1, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 2, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 3, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 4, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 5, y: 3, hasWall: false, isGoal: false, isStart: false }, { x: 6, y: 3, hasWall: false, isGoal: false, isStart: false }],
      ],
      startPosition: { x: 0, y: 3, direction: 'up' },
      goalPosition: { x: 6, y: 0 },
      availableInstructions: [
        { id: 'forward-1', type: 'forward', label: 'Move Forward', icon: '🡹' },
        { id: 'left-1', type: 'left', label: 'Turn Left', icon: '🡸' },
        { id: 'right-1', type: 'right', label: 'Turn Right', icon: '🡺' },
        { id: 'if-wall-ahead-1', type: 'if-wall-ahead', label: 'IF Wall Ahead', icon: '⚠️', isCondition: true, thenAction: { type: 'right', label: 'THEN Turn Right', icon: '🡺' } },
        { id: 'if-wall-left-1', type: 'if-wall-left', label: 'IF Wall Left', icon: '⚠️', isCondition: true, thenAction: { type: 'forward', label: 'THEN Move Forward', icon: '🡹' } },
      ],
      maxInstructions: 18,
    },
  ];

  const [currentLevel, setCurrentLevel] = useState(0);
  const [userSequence, setUserSequence] = useState<Instruction[]>([]);
  const [robotPosition, setRobotPosition] = useState<Position>(levels[currentLevel].startPosition);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showPath, setShowPath] = useState(false);
  const [path, setPath] = useState<Position[]>([]);
  const [success, setSuccess] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Reset the robot position
  const resetRobot = useCallback(() => {
    setRobotPosition({ ...levels[currentLevel].startPosition });
    setPath([]);
    setShowPath(false);
    setSuccess(false);
    setErrorMessage(null);
  }, [currentLevel, levels]);

  // Handle adding an instruction to the sequence
  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const itemId = e.dataTransfer.getData('text/plain');
    
    // Check if we've reached the max instructions
    if (userSequence.length >= levels[currentLevel].maxInstructions) {
      setErrorMessage(`You can only use up to ${levels[currentLevel].maxInstructions} instructions!`);
      return;
    }

    // Find the instruction from available instructions
    const instruction = levels[currentLevel].availableInstructions.find(item => item.id === itemId);
    
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
  }, [currentLevel, levels, userSequence.length]);

  // Remove an instruction from the sequence
  const removeInstruction = useCallback((index: number) => {
    setUserSequence(prev => {
      const newSequence = [...prev];
      newSequence.splice(index, 1);
      return newSequence;
    });
  }, []);

  // Check if there's a wall in a specific direction relative to the robot
  const checkForWall = useCallback((position: Position, direction: 'ahead' | 'left' | 'right'): boolean => {
    const grid = levels[currentLevel].grid;
    const gridSize = grid.length;
    
    // Calculate the position to check based on the robot's current direction and the relative direction
    let checkX = position.x;
    let checkY = position.y;
    let checkDirection = position.direction;
    
    // First, determine which absolute direction to check
    if (direction === 'ahead') {
      // Use the robot's current direction
      checkDirection = position.direction;
    } else if (direction === 'left') {
      // Rotate the robot's direction 90 degrees counter-clockwise
      switch (position.direction) {
        case 'up': checkDirection = 'left'; break;
        case 'right': checkDirection = 'up'; break;
        case 'down': checkDirection = 'right'; break;
        case 'left': checkDirection = 'down'; break;
      }
    } else if (direction === 'right') {
      // Rotate the robot's direction 90 degrees clockwise
      switch (position.direction) {
        case 'up': checkDirection = 'right'; break;
        case 'right': checkDirection = 'down'; break;
        case 'down': checkDirection = 'left'; break;
        case 'left': checkDirection = 'up'; break;
      }
    }
    
    // Now determine the cell to check based on the absolute direction
    switch (checkDirection) {
      case 'up':
        checkY = position.y - 1;
        break;
      case 'right':
        checkX = position.x + 1;
        break;
      case 'down':
        checkY = position.y + 1;
        break;
      case 'left':
        checkX = position.x - 1;
        break;
    }
    
    // Check if the position is out of bounds (which counts as a wall)
    if (checkX < 0 || checkX >= gridSize || checkY < 0 || checkY >= gridSize) {
      return true;
    }
    
    // Check if there's a wall in the cell
    return grid[checkY][checkX].hasWall;
  }, [currentLevel, levels]);

  // Execute a single instruction
  const executeInstruction = useCallback((instruction: Instruction, position: Position): Position => {
    let newPosition = { ...position };
    
    if (instruction.isCondition) {
      // Handle conditional instructions
      let conditionMet = false;
      
      switch (instruction.type) {
        case 'if-wall-ahead':
          conditionMet = checkForWall(position, 'ahead');
          break;
        case 'if-wall-left':
          conditionMet = checkForWall(position, 'left');
          break;
        case 'if-wall-right':
          conditionMet = checkForWall(position, 'right');
          break;
      }
      
      if (conditionMet && instruction.thenAction) {
        // Execute the 'then' action if condition is met
        switch (instruction.thenAction.type) {
          case 'forward':
            return moveForward(newPosition);
          case 'left':
            return turnLeft(newPosition);
          case 'right':
            return turnRight(newPosition);
        }
      }
      
      // If condition is not met or there's no action, return unchanged position
      return newPosition;
    } else {
      // Handle regular instructions
      switch (instruction.type) {
        case 'forward':
          return moveForward(newPosition);
        case 'left':
          return turnLeft(newPosition);
        case 'right':
          return turnRight(newPosition);
        default:
          return newPosition;
      }
    }
  }, [checkForWall]);

  // Move the robot forward
  const moveForward = useCallback((position: Position): Position => {
    const grid = levels[currentLevel].grid;
    const gridSize = grid.length;
    let newPosition = { ...position };
    
    switch (position.direction) {
      case 'up':
        if (position.y > 0 && !grid[position.y - 1][position.x].hasWall) {
          newPosition.y--;
        }
        break;
      case 'right':
        if (position.x < gridSize - 1 && !grid[position.y][position.x + 1].hasWall) {
          newPosition.x++;
        }
        break;
      case 'down':
        if (position.y < gridSize - 1 && !grid[position.y + 1][position.x].hasWall) {
          newPosition.y++;
        }
        break;
      case 'left':
        if (position.x > 0 && !grid[position.y][position.x - 1].hasWall) {
          newPosition.x--;
        }
        break;
    }
    
    return newPosition;
  }, [currentLevel, levels]);

  // Turn the robot left
  const turnLeft = useCallback((position: Position): Position => {
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
  }, []);

  // Turn the robot right
  const turnRight = useCallback((position: Position): Position => {
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
  }, []);

  // Execute the sequence of instructions
  const executeSequence = useCallback(async () => {
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
      currentPosition = executeInstruction(instruction, currentPosition);
      
      // Add position to path
      newPath.push({ ...currentPosition });
      
      // Update robot position with animation delay
      setRobotPosition({ ...currentPosition });
      setPath([...newPath]);
      
      // Wait for animation
      await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    // Check if robot reached the goal
    const goalPosition = levels[currentLevel].goalPosition;
    const reachedGoal = 
      currentPosition.x === goalPosition.x && 
      currentPosition.y === goalPosition.y;
    
    if (reachedGoal) {
      setSuccess(true);
      setShowConfetti(true);
      
      // Add to completed levels if not already completed
      if (!completedLevels.includes(currentLevel)) {
        setCompletedLevels(prev => [...prev, currentLevel]);
      }
      
      setTimeout(() => setShowConfetti(false), 3000);
      
      // If all levels are completed, call the onComplete callback
      if (completedLevels.length === levels.length - 1 && !completedLevels.includes(currentLevel) && onComplete) {
        onComplete();
      }
    } else {
      setErrorMessage("Not quite there yet. Try again!");
    }
    
    setIsAnimating(false);
  }, [userSequence, resetRobot, levels, currentLevel, completedLevels, executeInstruction, onComplete]);

  // Clear the sequence
  const clearSequence = useCallback(() => {
    setUserSequence([]);
    resetRobot();
  }, [resetRobot]);

  // Move to the next level
  const nextLevel = useCallback(() => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setUserSequence([]);
      resetRobot();
      setErrorMessage(null);
    }
  }, [currentLevel, levels.length, resetRobot]);

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
      </div>
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
      <h2 className="text-2xl font-bold text-center mb-6">Obstacle Map</h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg mb-2">
          Guide the robot around obstacles to reach the flag!
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Level {currentLevel + 1} of {levels.length}
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Grid side */}
        <div className="flex flex-col items-center">
          <div 
            className={`grid gap-1 w-full max-w-xs mb-4`}
            style={{ gridTemplateColumns: `repeat(${levels[currentLevel].grid[0].length}, 1fr)` }}
          >
            {levels[currentLevel].grid.flat().map(cell => renderCell(cell))}
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
              {currentLevel < levels.length - 1 && (
                <button
                  onClick={nextLevel}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  Next Level →
                </button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Instructions side */}
        <div className="flex flex-col">
          {/* User sequence */}
          <div className="mb-4">
            <div className="font-medium mb-2">Your Sequence: ({userSequence.length}/{levels[currentLevel].maxInstructions})</div>
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
                      px-3 py-2 rounded-lg flex flex-col items-center relative group
                      ${instruction.isCondition ? 'bg-purple-600 text-white' : 
                        instruction.type === 'forward' ? 'bg-blue-500 text-white' : 
                        instruction.type === 'left' ? 'bg-purple-500 text-white' : 
                        'bg-orange-500 text-white'}
                    `}
                  >
                    <div className="flex items-center gap-2">
                      <span className="text-xl">{instruction.icon}</span>
                      <span className="text-sm">{instruction.label}</span>
                    </div>
                    {instruction.isCondition && instruction.thenAction && (
                      <div className="flex items-center gap-1 mt-1 text-xs bg-white/20 px-2 py-1 rounded">
                        <span>{instruction.thenAction.icon}</span>
                        <span>{instruction.thenAction.label}</span>
                      </div>
                    )}
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
              {levels[currentLevel].availableInstructions.map((instruction) => (
                <div
                  key={instruction.id}
                  className={`
                    px-3 py-2 rounded-lg flex flex-col items-center cursor-grab
                    ${instruction.isCondition ? 'bg-purple-600 text-white' : 
                      instruction.type === 'forward' ? 'bg-blue-500 text-white' : 
                      instruction.type === 'left' ? 'bg-purple-500 text-white' : 
                      'bg-orange-500 text-white'}
                  `}
                  draggable="true"
                  onDragStart={(e) => {
                    e.dataTransfer.setData('text/plain', instruction.id);
                  }}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{instruction.icon}</span>
                    <span className="text-sm">{instruction.label}</span>
                  </div>
                  {instruction.isCondition && instruction.thenAction && (
                    <div className="flex items-center gap-1 mt-1 text-xs bg-white/20 px-2 py-1 rounded">
                      <span>{instruction.thenAction.icon}</span>
                      <span>{instruction.thenAction.label}</span>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          
          {/* Instructions */}
          <div className="mt-6 bg-yellow-50 p-3 rounded-lg">
            <h3 className="font-bold mb-2">How to Play:</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Drag commands to build your sequence</li>
              <li>Use conditional blocks (IF) to handle obstacles</li>
              <li>Press Play to see the robot follow your instructions</li>
              <li>Guide the robot to the flag while avoiding walls</li>
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

export default ObstacleMap; 