import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface CycleStep {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
}

const CycleBuilder: React.FC = () => {
  const [steps, setSteps] = useState<CycleStep[]>([
    { 
      id: 'evaporation', 
      name: 'Evaporation', 
      icon: '☀️', 
      description: 'The sun heats water, turning it into vapor that rises into the air.',
      image: '/images/science/s5_water_cycle_adventure/evaporation.png'
    },
    { 
      id: 'condensation', 
      name: 'Condensation', 
      icon: '☁️', 
      description: 'Water vapor cools and forms clouds.',
      image: '/images/science/s5_water_cycle_adventure/condensation.jpg'
    },
    { 
      id: 'precipitation', 
      name: 'Precipitation', 
      icon: '🌧️', 
      description: 'Water falls from clouds as rain, snow, or hail.',
      image: '/images/science/s5_water_cycle_adventure/drop.png'
    },
    { 
      id: 'collection', 
      name: 'Collection', 
      icon: '🌊', 
      description: 'Water collects in oceans, lakes, and rivers.',
      image: '/images/science/s5_water_cycle_adventure/sun-above-water.jpg'
    },
  ]);
  
  const [placedSteps, setPlacedSteps] = useState<(CycleStep | null)[]>([null, null, null, null]);
  const [shuffledSteps, setShuffledSteps] = useState<CycleStep[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [draggedItem, setDraggedItem] = useState<CycleStep | null>(null);
  
  // Correct order of steps
  const correctOrder = ['evaporation', 'condensation', 'precipitation', 'collection'];
  
  useEffect(() => {
    // Shuffle steps on component mount
    const shuffled = [...steps].sort(() => Math.random() - 0.5);
    setShuffledSteps(shuffled);
  }, []);
  
  // Check if all steps are placed and in correct order
  useEffect(() => {
    if (placedSteps.every(step => step !== null)) {
      const currentOrder = placedSteps.map(step => step!.id);
      const isCorrect = currentOrder.every((stepId, index) => stepId === correctOrder[index]);
      setIsComplete(isCorrect);
      setShowFeedback(true);
      
      if (isCorrect) {
        // Play success sound
        try {
          new Audio('/audio/correct.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
      } else {
        // Play incorrect sound
        try {
          new Audio('/audio/incorrect.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
      }
    }
  }, [placedSteps]);
  
  const handleDragStart = (step: CycleStep) => {
    setDraggedItem(step);
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };
  
  const handleDrop = (index: number) => {
    if (draggedItem) {
      const updatedPlacedSteps = [...placedSteps];
      updatedPlacedSteps[index] = draggedItem;
      setPlacedSteps(updatedPlacedSteps);
      
      // Remove from shuffled steps
      setShuffledSteps(shuffledSteps.filter(step => step.id !== draggedItem.id));
      setDraggedItem(null);
    }
  };
  
  const resetActivity = () => {
    setPlacedSteps([null, null, null, null]);
    setShuffledSteps([...steps].sort(() => Math.random() - 0.5));
    setIsComplete(false);
    setShowFeedback(false);
  };
  
  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-4">Water Cycle Builder</h2>
      <p className="text-center mb-6">Drag each step to its correct place in the water cycle!</p>
      
      {/* Cycle visualization */}
      <div className="relative w-full max-w-md h-64 bg-blue-50 rounded-xl mb-6 p-4 flex flex-col">
        <div className="absolute top-2 right-2">
          <button 
            onClick={resetActivity}
            className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-sm hover:bg-blue-200"
          >
            Reset
          </button>
        </div>
        
        {/* Cycle step slots */}
        <div className="flex flex-col h-full justify-between">
          {placedSteps.map((step, index) => (
            <div 
              key={index}
              className={`h-12 border-2 ${step ? 'border-blue-300' : 'border-dashed border-blue-200'} rounded-lg flex items-center justify-center p-2 ${!step && 'bg-blue-50'}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(index)}
            >
              {step ? (
                <div className="flex items-center w-full">
                  <span className="text-2xl mr-2">{step.icon}</span>
                  <span className="font-semibold">{step.name}</span>
                </div>
              ) : (
                <span className="text-blue-400">Drop step {index + 1} here</span>
              )}
            </div>
          ))}
        </div>
      </div>
      
      {/* Available steps to drag */}
      <div className="flex flex-wrap justify-center gap-2 mb-4">
        {shuffledSteps.map((step) => (
          <motion.div
            key={step.id}
            className="bg-white border-2 border-blue-300 rounded-lg p-2 cursor-grab shadow-sm hover:shadow-md"
            draggable
            onDragStart={() => handleDragStart(step)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center">
              <span className="text-2xl mr-2">{step.icon}</span>
              <span className="font-semibold">{step.name}</span>
            </div>
          </motion.div>
        ))}
      </div>
      
      {/* Feedback area */}
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-4 p-4 rounded-lg text-center ${isComplete ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}
        >
          {isComplete ? (
            <>
              <div className="text-xl font-bold mb-2">🎉 Great job! You completed the water cycle!</div>
              <p>Water continuously moves through this cycle in nature.</p>
            </>
          ) : (
            <>
              <div className="text-xl font-bold mb-2">Not quite right!</div>
              <p>Try again! Remember that the water cycle is a continuous process.</p>
              <button 
                onClick={resetActivity}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </>
          )}
        </motion.div>
      )}
      
      {/* Step details - shown when complete */}
      {isComplete && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold mb-2">The Water Cycle Steps:</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {steps.map((step) => (
              <div key={step.id} className="bg-white p-3 rounded-lg shadow-sm">
                <div className="flex items-center mb-1">
                  <span className="text-xl mr-2">{step.icon}</span>
                  <span className="font-bold">{step.name}</span>
                </div>
                <p className="text-sm">{step.description}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default CycleBuilder; 