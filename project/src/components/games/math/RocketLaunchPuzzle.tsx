import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface Rocket {
  id: number;
  number: number;
  launched: boolean;
}

interface PlaceValueOption {
  id: number;
  hundreds: number;
  tens: number;
  ones: number;
  selected: boolean;
}

const RocketLaunchPuzzle: React.FC = () => {
  const [rockets, setRockets] = useState<Rocket[]>([]);
  const [placeValueOptions, setPlaceValueOptions] = useState<PlaceValueOption[]>([]);
  const [selectedRocket, setSelectedRocket] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showSuccess, setShowSuccess] = useState(false);
  const [level, setLevel] = useState(1);
  const [gameCompleted, setGameCompleted] = useState(false);
  
  // Generate rockets and place value options for each level
  useEffect(() => {
    generateLevel(level);
  }, [level]);
  
  const generateLevel = (currentLevel: number) => {
    const newRockets: Rocket[] = [];
    const newOptions: PlaceValueOption[] = [];
    
    // Number of rockets increases with level
    const rocketCount = Math.min(3 + currentLevel, 6);
    
    for (let i = 0; i < rocketCount; i++) {
      // Generate a random 3-digit number
      let hundreds = Math.floor(Math.random() * 9) + 1; // 1-9
      let tens = Math.floor(Math.random() * 10); // 0-9
      let ones = Math.floor(Math.random() * 10); // 0-9
      
      // Ensure we have some zeros in higher levels
      if (currentLevel >= 2 && i % 2 === 0) {
        tens = 0;
      }
      
      if (currentLevel >= 3 && i % 3 === 0) {
        ones = 0;
      }
      
      const number = hundreds * 100 + tens * 10 + ones;
      
      newRockets.push({
        id: i,
        number,
        launched: false
      });
      
      newOptions.push({
        id: i,
        hundreds,
        tens,
        ones,
        selected: false
      });
    }
    
    // Shuffle the options
    const shuffledOptions = [...newOptions].sort(() => Math.random() - 0.5);
    
    setRockets(newRockets);
    setPlaceValueOptions(shuffledOptions);
    setSelectedRocket(null);
    setSelectedOption(null);
    setShowSuccess(false);
  };
  
  const handleRocketClick = (rocketId: number) => {
    if (rockets.find(r => r.id === rocketId)?.launched) return;
    
    setSelectedRocket(rocketId);
    setSelectedOption(null);
  };
  
  const handleOptionClick = (optionId: number) => {
    if (selectedRocket === null) return;
    
    setSelectedOption(optionId);
    
    // Check if match is correct
    const rocket = rockets.find(r => r.id === selectedRocket);
    const option = placeValueOptions.find(o => o.id === optionId);
    
    if (rocket && option) {
      const rocketNumber = rocket.number;
      const optionNumber = option.hundreds * 100 + option.tens * 10 + option.ones;
      
      if (rocketNumber === optionNumber) {
        // Correct match!
        // Play success sound
        try {
          new Audio('/audio/correct.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
        
        // Update rocket to launched state
        setRockets(prev => 
          prev.map(r => 
            r.id === selectedRocket ? { ...r, launched: true } : r
          )
        );
        
        // Update option to selected state
        setPlaceValueOptions(prev => 
          prev.map(o => 
            o.id === optionId ? { ...o, selected: true } : o
          )
        );
        
        // Increase score
        setScore(prev => prev + 1);
        
        // Reset selections
        setTimeout(() => {
          setSelectedRocket(null);
          setSelectedOption(null);
          
          // Check if all rockets are launched
          const allLaunched = rockets.every(r => r.id === selectedRocket || r.launched);
          
          if (allLaunched) {
            setShowSuccess(true);
            
            // Move to next level after delay
            setTimeout(() => {
              if (level < 4) {
                setLevel(prev => prev + 1);
              } else {
                setGameCompleted(true);
              }
            }, 2000);
          }
        }, 1000);
      } else {
        // Incorrect match
        try {
          new Audio('/audio/incorrect.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
        
        // Reset selections after a short delay
        setTimeout(() => {
          setSelectedRocket(null);
          setSelectedOption(null);
        }, 1000);
      }
    }
  };
  
  const resetGame = () => {
    setLevel(1);
    setScore(0);
    setGameCompleted(false);
    generateLevel(1);
  };
  
  return (
    <div className="flex flex-col items-center p-4">
      <h2 className="text-xl font-bold mb-2">Rocket Launch Puzzle</h2>
      <div className="text-center mb-4">
        <p className="text-lg font-medium">Match each rocket number with its place value blocks</p>
        <p className="text-sm text-gray-600">Level {level}/4 • Score: {score}</p>
      </div>
      
      {/* Game board */}
      <div className="flex flex-col md:flex-row gap-8 items-center justify-center">
        {/* Rockets */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-center">Rockets</div>
          <div className="grid grid-cols-2 gap-3">
            {rockets.map(rocket => (
              <motion.div
                key={rocket.id}
                className={`relative w-24 h-32 rounded-lg border-2 flex flex-col items-center justify-center cursor-pointer
                  ${rocket.launched ? 'opacity-50 pointer-events-none' : ''}
                  ${selectedRocket === rocket.id ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                onClick={() => handleRocketClick(rocket.id)}
                animate={rocket.launched ? { y: [-10, -100, -200], opacity: [1, 0.7, 0] } : {}}
                transition={rocket.launched ? { duration: 2 } : {}}
              >
                <div className="text-2xl mb-1">🚀</div>
                <div className="text-xl font-bold">{rocket.number}</div>
                {rocket.launched && (
                  <motion.div
                    className="absolute bottom-0 w-full"
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: [0, 1, 0], scale: [0, 1, 2] }}
                    transition={{ duration: 1 }}
                  >
                    <div className="text-center text-orange-500">🔥</div>
                  </motion.div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
        
        {/* Place value options */}
        <div className="flex flex-col gap-4">
          <div className="text-sm font-medium text-center">Place Value Blocks</div>
          <div className="grid grid-cols-1 gap-3">
            {placeValueOptions.map(option => (
              <motion.div
                key={option.id}
                className={`w-64 p-3 rounded-lg border-2 flex items-center justify-between cursor-pointer
                  ${option.selected ? 'opacity-50 pointer-events-none' : ''}
                  ${selectedOption === option.id ? 'border-green-500 bg-green-50' : 'border-gray-300 bg-white hover:bg-gray-50'}`}
                onClick={() => handleOptionClick(option.id)}
              >
                <div className="flex gap-2">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-red-200 rounded flex items-center justify-center font-bold">{option.hundreds}</div>
                    <div className="text-xs">hundreds</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-green-200 rounded flex items-center justify-center font-bold">{option.tens}</div>
                    <div className="text-xs">tens</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 bg-blue-200 rounded flex items-center justify-center font-bold">{option.ones}</div>
                    <div className="text-xs">ones</div>
                  </div>
                </div>
                <div className="text-lg font-bold">=</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
      
      {/* Success message */}
      {showSuccess && !gameCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-100 text-green-800 rounded-lg text-center"
        >
          <div className="text-xl font-bold">Great job! 🎉</div>
          <div>All rockets launched successfully!</div>
          <div className="text-sm mt-2">Preparing level {level + 1}...</div>
        </motion.div>
      )}
      
      {/* Game completed message */}
      {gameCompleted && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-indigo-100 text-indigo-800 rounded-lg text-center"
        >
          <div className="text-xl font-bold">Mission Complete! 🏆</div>
          <div>You've mastered place value and launched all rockets!</div>
          <button
            onClick={resetGame}
            className="mt-3 px-4 py-2 bg-indigo-500 text-white rounded-lg font-medium hover:bg-indigo-600"
          >
            Play Again
          </button>
        </motion.div>
      )}
    </div>
  );
};

export default RocketLaunchPuzzle; 