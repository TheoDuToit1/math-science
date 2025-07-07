import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface TreasureClueHuntProps {
  onComplete?: () => void;
}

interface Clue {
  id: string;
  text: string;
  fraction: string;
  solved: boolean;
}

interface TreasureOption {
  id: string;
  image: string;
  fraction: string;
  description: string;
}

const TreasureClueHunt: React.FC<TreasureClueHuntProps> = ({ onComplete }) => {
  // Game clues
  const clues: Clue[] = [
    { id: 'clue-1', text: "Find the chest that's 3/4 full of gold coins", fraction: '3/4', solved: false },
    { id: 'clue-2', text: 'The pirate ate 1/2 of the pizza. Which one is it?', fraction: '1/2', solved: false },
    { id: 'clue-3', text: 'The map shows 1/3 of the island is covered in jungle', fraction: '1/3', solved: false },
    { id: 'clue-4', text: 'The bottle is 1/4 filled with magic potion', fraction: '1/4', solved: false },
    { id: 'clue-5', text: 'The pirate ship has 2/3 of its sails up', fraction: '2/3', solved: false },
    // ... 19 more clues with different objects and fractions ...
  ];

  // Treasure options for each clue
  const treasureOptions: Record<string, TreasureOption[]> = {
    // ... 24 sets of options for each clue ...
  };

  // Game state
  const [activeClue, setActiveClue] = useState<string | null>(null);
  const [gameClues, setGameClues] = useState<Clue[]>(clues);
  const [showConfetti, setShowConfetti] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [incorrectAttempts, setIncorrectAttempts] = useState(0);

  // Handle clue selection
  const handleClueSelect = (clueId: string) => {
    setActiveClue(clueId);
  };

  // Handle option selection
  const handleOptionSelect = (option: TreasureOption) => {
    if (!activeClue) return;
    
    const clue = gameClues.find(c => c.id === activeClue);
    if (!clue) return;
    
    if (option.fraction === clue.fraction) {
      // Correct option
      const updatedClues = gameClues.map(c => 
        c.id === activeClue ? { ...c, solved: true } : c
      );
      
      setGameClues(updatedClues);
      setActiveClue(null);
      
      // Play success sound
      new Audio('/audio/correct-6033.mp3').play().catch(e => console.error("Audio play failed:", e));
      
      // Check if game is complete (3 or more clues solved)
      const solvedCount = updatedClues.filter(c => c.solved).length;
      if (solvedCount >= 3) {
        setGameComplete(true);
        setShowConfetti(true);
        
        setTimeout(() => {
          setShowConfetti(false);
        }, 3000);
        
        // Call onComplete callback
        if (onComplete) {
          onComplete();
        }
      }
    } else {
      // Incorrect option
      setIncorrectAttempts(incorrectAttempts + 1);
      
      // Play error sound
      new Audio('/audio/fail.mp3').play().catch(e => console.error("Audio play failed:", e));
    }
  };

  // Render fraction visualization
  const renderFractionVisual = (fraction: string, emoji: string) => {
    const [numerator, denominator] = fraction.split('/').map(Number);
    const items = [];
    
    for (let i = 0; i < denominator; i++) {
      items.push(
        <div 
          key={i} 
          className={`w-6 h-6 flex items-center justify-center rounded-full
                    ${i < numerator ? 'bg-yellow-400' : 'bg-gray-200'}`}
        >
          <span className="text-xs">{emoji}</span>
        </div>
      );
    }
    
    return (
      <div className="flex gap-1">
        {items}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Treasure Clue Hunt</h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg mb-2">
          Solve the fraction clues to find the treasure!
        </p>
        <p className="text-sm text-gray-600 mb-4">
          You need to solve at least 3 clues to unlock the treasure
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Treasure map and clues */}
        <div className="flex flex-col">
          {/* Treasure map */}
          <div className="bg-yellow-100 rounded-lg p-4 mb-6 relative">
            <div className="text-center font-bold mb-2">Pirate Treasure Map</div>
            <div className="flex justify-center">
              <div className="w-64 h-64 bg-yellow-200 rounded-lg relative">
                {/* Map elements */}
                <div className="absolute top-2 left-2 text-2xl">🏝️</div>
                <div className="absolute top-2 right-2 text-2xl">🌊</div>
                <div className="absolute bottom-2 left-2 text-2xl">⚓</div>
                <div className="absolute bottom-2 right-2 text-2xl">🏴‍☠️</div>
                <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-4xl">
                  {gameComplete ? '💎' : '❓'}
                </div>
                
                {/* Paths connecting clues */}
                <div className="absolute top-0 left-0 w-full h-full">
                  <svg width="100%" height="100%" className="absolute inset-0">
                    <path d="M32 32 L128 128" stroke="brown" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M128 128 L224 32" stroke="brown" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M128 128 L32 224" stroke="brown" strokeWidth="2" strokeDasharray="5,5" />
                    <path d="M128 128 L224 224" stroke="brown" strokeWidth="2" strokeDasharray="5,5" />
                  </svg>
                </div>
                
                {/* Clue markers */}
                {gameClues.map((clue, index) => {
                  const positions = [
                    { top: '32px', left: '32px' },
                    { top: '32px', right: '32px' },
                    { bottom: '32px', left: '32px' },
                    { bottom: '32px', right: '32px' },
                    { top: '50%', left: '50%', transform: 'translate(-50%, -50%)' }
                  ];
                  
                  return (
                    <div
                      key={clue.id}
                      className={`absolute w-10 h-10 rounded-full flex items-center justify-center
                                ${clue.solved ? 'bg-green-500' : 'bg-orange-500'}`}
                      style={positions[index]}
                    >
                      <span className="text-white font-bold">{index + 1}</span>
                    </div>
                  );
                })}
              </div>
            </div>
            
            {/* Treasure status */}
            <div className="mt-4 text-center">
              <div className="font-medium">
                Clues solved: {gameClues.filter(c => c.solved).length} / 5
              </div>
              <div className="h-2 bg-gray-200 rounded-full mt-1">
                <div 
                  className="h-full bg-green-500 rounded-full"
                  style={{ width: `${(gameClues.filter(c => c.solved).length / 3) * 100}%` }}
                />
              </div>
            </div>
          </div>
          
          {/* Clue list */}
          <div className="bg-orange-50 rounded-lg p-4">
            <div className="text-center font-bold mb-2">Clues</div>
            <div className="space-y-2">
              {gameClues.map((clue, index) => (
                <button
                  key={clue.id}
                  onClick={() => !clue.solved && handleClueSelect(clue.id)}
                  className={`w-full px-4 py-2 rounded-lg flex items-center justify-between
                            ${clue.solved ? 'bg-green-100 text-green-800' : 
                              activeClue === clue.id ? 'bg-orange-500 text-white' : 
                              'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
                  disabled={clue.solved}
                >
                  <span className="flex items-center">
                    <span className="w-6 h-6 rounded-full bg-orange-500 text-white flex items-center justify-center mr-2">
                      {index + 1}
                    </span>
                    <span>{clue.text}</span>
                  </span>
                  {clue.solved && <span className="text-green-600">✓</span>}
                </button>
              ))}
            </div>
          </div>
        </div>
        
        {/* Right side - Options */}
        <div className="flex flex-col">
          {activeClue ? (
            <div className="bg-blue-50 rounded-lg p-4">
              <div className="text-center font-bold mb-4">
                {gameClues.find(c => c.id === activeClue)?.text}
              </div>
              
              <div className="space-y-4">
                {treasureOptions[activeClue]?.map(option => (
                  <button
                    key={option.id}
                    onClick={() => handleOptionSelect(option)}
                    className="w-full px-4 py-3 rounded-lg bg-white hover:bg-blue-100 flex items-center gap-4"
                  >
                    <div className="text-4xl">{option.image}</div>
                    <div className="flex-1">
                      <div className="font-medium">{option.description}</div>
                      <div className="mt-1">
                        {renderFractionVisual(option.fraction, option.image)}
                      </div>
                    </div>
                    <div className="text-xl font-bold">{option.fraction}</div>
                  </button>
                ))}
              </div>
              
              <button
                onClick={() => setActiveClue(null)}
                className="mt-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 mx-auto block"
              >
                ← Back to clues
              </button>
            </div>
          ) : (
            <div className="bg-blue-50 rounded-lg p-4 flex flex-col items-center justify-center h-full">
              <div className="text-4xl mb-4">🗝️</div>
              <div className="text-center font-medium mb-2">
                Select a clue from the list to solve it
              </div>
              <div className="text-sm text-gray-600 text-center">
                Solve at least 3 clues to unlock the treasure!
              </div>
              
              {gameComplete && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="mt-6 p-4 bg-yellow-100 rounded-lg text-center"
                >
                  <div className="text-4xl mb-2">💎</div>
                  <div className="font-bold text-xl text-yellow-800 mb-2">
                    Treasure Unlocked!
                  </div>
                  <div className="text-yellow-700">
                    You've successfully solved enough fraction clues and found the pirate treasure!
                  </div>
                </motion.div>
              )}
            </div>
          )}
          
          {/* Hint button */}
          <button
            onClick={() => setShowHint(!showHint)}
            className="mt-4 px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200 self-start"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
          
          {/* Hint display */}
          {showHint && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mt-2 bg-yellow-50 p-4 rounded-lg"
            >
              <div className="text-lg font-medium mb-2">Hint:</div>
              <div className="text-sm">
                Look at the fraction in each clue (like ¾) and find the matching image.
                The first number (numerator) tells you how many parts are filled or used.
                The second number (denominator) tells you the total number of parts.
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default TreasureClueHunt; 