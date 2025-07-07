import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface PizzaSlicerProps {
  onComplete?: () => void;
}

interface SlicerOption {
  id: string;
  label: string;
  value: number;
  fraction: string;
}

const PizzaSlicer: React.FC<PizzaSlicerProps> = ({ onComplete }) => {
  // Slicer options
  const slicerOptions: SlicerOption[] = [
    { id: 'half', label: 'Cut in Half', value: 2, fraction: '1/2' },
    { id: 'quarter', label: 'Cut in Quarters', value: 4, fraction: '1/4' },
    { id: 'third', label: 'Cut in Thirds', value: 3, fraction: '1/3' }
  ];

  // Game state
  const [selectedSlicer, setSelectedSlicer] = useState<SlicerOption | null>(null);
  const [isPizzaSliced, setIsPizzaSliced] = useState(false);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);
  const [showConfetti, setShowConfetti] = useState(false);
  const [level, setLevel] = useState(1);
  const [friendCount, setFriendCount] = useState(1);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);

  // Replace level/friendCount logic with a levels array of 24 varied levels
  const levels = [
    { friendCount: 2, options: [2, 4, 8] },
    { friendCount: 3, options: [3, 6, 9] },
    { friendCount: 4, options: [4, 8, 12] },
    { friendCount: 5, options: [5, 10, 15] },
    { friendCount: 6, options: [6, 12, 3] },
    { friendCount: 7, options: [7, 14, 2] },
    { friendCount: 8, options: [8, 4, 16] },
    { friendCount: 9, options: [9, 3, 18] },
    { friendCount: 10, options: [10, 5, 20] },
    { friendCount: 11, options: [11, 22, 2] },
    { friendCount: 12, options: [12, 6, 24] },
    { friendCount: 5, options: [5, 4, 8] }, // challenge: not all options are multiples
    { friendCount: 7, options: [7, 8, 14] },
    { friendCount: 3, options: [3, 5, 6] },
    { friendCount: 4, options: [4, 5, 10] },
    { friendCount: 6, options: [6, 8, 12] },
    { friendCount: 8, options: [8, 7, 16] },
    { friendCount: 9, options: [9, 12, 18] },
    { friendCount: 10, options: [10, 8, 20] },
    { friendCount: 11, options: [11, 10, 22] },
    { friendCount: 12, options: [12, 9, 24] },
    { friendCount: 2, options: [2, 3, 4] },
    { friendCount: 3, options: [3, 4, 6] },
    { friendCount: 4, options: [4, 6, 8] },
  ];

  // Reset game state for a new level
  const resetLevel = () => {
    setSelectedSlicer(null);
    setIsPizzaSliced(false);
    setSelectedSlice(null);
    setLevelComplete(false);
    setShowHint(false);
  };

  // Handle slicer selection
  const handleSlicerSelect = (slicer: SlicerOption) => {
    setSelectedSlicer(slicer);
    setIsPizzaSliced(false);
    setSelectedSlice(null);
  };

  // Handle pizza slicing
  const handleSlicePizza = () => {
    if (!selectedSlicer) return;
    
    setIsPizzaSliced(true);
    // Play slicing sound
    new Audio('/audio/click.mp3').play().catch(e => console.error("Audio play failed:", e));
  };

  // Handle slice selection
  const handleSliceSelect = (sliceIndex: number) => {
    if (!isPizzaSliced) return;
    
    setSelectedSlice(sliceIndex);
    
    // Check if correct number of slices for friends
    if (selectedSlicer && friendCount === selectedSlicer.value) {
      setLevelComplete(true);
      setShowConfetti(true);
      
      // Add to completed levels
      if (!completedLevels.includes(level)) {
        setCompletedLevels([...completedLevels, level]);
      }
      
      // Play success sound
      new Audio('/audio/correct-6033.mp3').play().catch(e => console.error("Audio play failed:", e));
      
      setTimeout(() => {
        setShowConfetti(false);
      }, 3000);
      
      // Call onComplete if all levels are done
      if (level === 3 && onComplete) {
        onComplete();
      }
    } else {
      // Play error sound
      new Audio('/audio/fail.mp3').play().catch(e => console.error("Audio play failed:", e));
    }
  };

  // Move to next level
  const nextLevel = () => {
    if (level < 3) {
      setLevel(level + 1);
      setFriendCount(level + 1); // Increase friend count for each level
      resetLevel();
    }
  };

  // Render pizza with slices
  const renderPizza = () => {
    if (!selectedSlicer) {
      return (
        <div className="w-64 h-64 bg-yellow-200 rounded-full flex items-center justify-center shadow-lg">
          <div className="text-8xl">🍕</div>
        </div>
      );
    }

    const slices = [];
    const sliceCount = selectedSlicer.value;
    const sliceAngle = 360 / sliceCount;
    
    for (let i = 0; i < sliceCount; i++) {
      const isSelected = selectedSlice === i;
      slices.push(
        <motion.div
          key={i}
          className={`absolute w-full h-full origin-bottom-center cursor-pointer
                    ${isSelected ? 'bg-yellow-400' : 'bg-yellow-200'}`}
          style={{
            clipPath: `polygon(50% 50%, ${50 - 50 * Math.sin((i * sliceAngle) * Math.PI / 180)}% ${50 - 50 * Math.cos((i * sliceAngle) * Math.PI / 180)}%, ${50 - 50 * Math.sin(((i + 1) * sliceAngle) * Math.PI / 180)}% ${50 - 50 * Math.cos(((i + 1) * sliceAngle) * Math.PI / 180)}%)`,
            zIndex: isSelected ? 10 : 1
          }}
          onClick={() => handleSliceSelect(i)}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          animate={isSelected ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.3 }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-4xl transform -translate-y-8">🍕</div>
          </div>
        </motion.div>
      );
    }

    // Add slice dividers
    const dividers = [];
    for (let i = 0; i < sliceCount; i++) {
      dividers.push(
        <motion.div
          key={`divider-${i}`}
          className="absolute top-1/2 left-1/2 w-0.5 h-1/2 bg-red-500 origin-top"
          style={{
            transform: `rotate(${i * sliceAngle}deg)`
          }}
          initial={{ scaleY: 0 }}
          animate={{ scaleY: isPizzaSliced ? 1 : 0 }}
          transition={{ duration: 0.5, delay: i * 0.1 }}
        />
      );
    }

    return (
      <div className="w-64 h-64 bg-yellow-100 rounded-full relative shadow-lg overflow-hidden">
        {slices}
        {dividers}
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <h2 className="text-2xl font-bold text-center mb-6">Pizza Slicer</h2>
      
      <div className="mb-6 text-center">
        <p className="text-lg mb-2">
          Level {level}: Serve {friendCount} friend{friendCount > 1 ? 's' : ''}
        </p>
        <p className="text-sm text-gray-600 mb-4">
          Cut the pizza into equal slices so each friend gets a fair share
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left side - Pizza and friends */}
        <div className="flex flex-col items-center">
          {/* Pizza display */}
          <div className="mb-6">
            {renderPizza()}
          </div>
          
          {/* Friends display */}
          <div className="flex justify-center gap-4 mb-4">
            {Array.from({ length: friendCount }).map((_, i) => (
              <div key={i} className="flex flex-col items-center">
                <div className="text-4xl mb-2">
                  {i % 2 === 0 ? '👧' : '👦'}
                </div>
                {selectedSlicer && (
                  <div className="text-orange-500 font-bold">
                    {selectedSlicer.fraction}
                  </div>
                )}
              </div>
            ))}
          </div>
          
          {/* Level completion message */}
          {levelComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-bold"
            >
              Great job! Each friend got a fair {selectedSlicer?.fraction} slice!
              {level < 3 && (
                <button
                  onClick={nextLevel}
                  className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 block mx-auto"
                >
                  Next Level →
                </button>
              )}
            </motion.div>
          )}
        </div>
        
        {/* Right side - Controls */}
        <div className="flex flex-col">
          {/* Slicer options */}
          <div className="mb-6">
            <h3 className="font-medium mb-2">Choose how to slice the pizza:</h3>
            <div className="space-y-2">
              {slicerOptions.map(option => (
                <button
                  key={option.id}
                  onClick={() => handleSlicerSelect(option)}
                  className={`w-full px-4 py-3 rounded-lg flex items-center justify-between ${
                    selectedSlicer?.id === option.id
                      ? 'bg-orange-500 text-white'
                      : 'bg-orange-100 text-orange-800 hover:bg-orange-200'
                  }`}
                  disabled={levelComplete}
                >
                  <span>{option.label}</span>
                  <span className="font-bold">{option.fraction}</span>
                </button>
              ))}
            </div>
          </div>
          
          {/* Action buttons */}
          <div className="mb-6">
            <button
              onClick={handleSlicePizza}
              disabled={!selectedSlicer || isPizzaSliced || levelComplete}
              className={`w-full px-4 py-3 rounded-lg font-medium ${
                !selectedSlicer || isPizzaSliced || levelComplete
                  ? 'bg-gray-200 text-gray-500'
                  : 'bg-red-500 text-white hover:bg-red-600'
              }`}
            >
              🔪 Slice Pizza
            </button>
          </div>
          
          {/* Instructions */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="font-bold mb-2">How to play:</h3>
            <ol className="list-decimal list-inside text-sm space-y-1">
              <li>Choose how to slice the pizza</li>
              <li>Click "Slice Pizza" to cut it</li>
              <li>Click on slices to highlight them</li>
              <li>Make sure each friend gets a fair share</li>
            </ol>
          </div>
          
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
                For {friendCount} friend{friendCount > 1 ? 's' : ''}, you need to cut the pizza into {friendCount} equal parts.
                Each friend should get 1/{friendCount} of the pizza.
              </div>
            </motion.div>
          )}
        </div>
      </div>
      
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default PizzaSlicer; 