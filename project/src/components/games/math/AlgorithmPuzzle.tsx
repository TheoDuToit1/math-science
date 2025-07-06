import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';

interface Step {
  id: string;
  text: string;
  image: string;
  isCorrect: boolean;
}

interface AlgorithmStage {
  id: string;
  title: string;
  description: string;
  image: string;
  options: Step[];
  correctFeedback: string;
}

interface AlgorithmPuzzleProps {
  onComplete?: () => void;
}

const AlgorithmPuzzle: React.FC<AlgorithmPuzzleProps> = ({ onComplete }) => {
  // Define the algorithm stages
  const stages: AlgorithmStage[] = [
    {
      id: "sandwich-1",
      title: "Make a PB&J Sandwich",
      description: "What's the first step?",
      image: "🥪",
      options: [
        { id: "option-1", text: "Spread peanut butter", image: "🥜", isCorrect: false },
        { id: "option-2", text: "Get two slices of bread", image: "🍞", isCorrect: true },
        { id: "option-3", text: "Spread jelly", image: "🍓", isCorrect: false },
      ],
      correctFeedback: "Right! First, we need bread slices."
    },
    {
      id: "sandwich-2",
      title: "Make a PB&J Sandwich",
      description: "What's the next step?",
      image: "🥪",
      options: [
        { id: "option-1", text: "Spread peanut butter", image: "🥜", isCorrect: true },
        { id: "option-2", text: "Cut the sandwich", image: "🔪", isCorrect: false },
        { id: "option-3", text: "Spread jelly", image: "🍓", isCorrect: false },
      ],
      correctFeedback: "Correct! Now we add peanut butter to one slice."
    },
    {
      id: "sandwich-3",
      title: "Make a PB&J Sandwich",
      description: "What's the next step?",
      image: "🥪",
      options: [
        { id: "option-1", text: "Put slices together", image: "🤲", isCorrect: false },
        { id: "option-2", text: "Cut the sandwich", image: "🔪", isCorrect: false },
        { id: "option-3", text: "Spread jelly", image: "🍓", isCorrect: true },
      ],
      correctFeedback: "Perfect! Now we add jelly to the other slice."
    },
    {
      id: "sandwich-4",
      title: "Make a PB&J Sandwich",
      description: "What's the next step?",
      image: "🥪",
      options: [
        { id: "option-1", text: "Put slices together", image: "🤲", isCorrect: true },
        { id: "option-2", text: "Cut the sandwich", image: "🔪", isCorrect: false },
        { id: "option-3", text: "Eat the sandwich", image: "😋", isCorrect: false },
      ],
      correctFeedback: "Great job! Now we put the slices together."
    },
    {
      id: "sandwich-5",
      title: "Make a PB&J Sandwich",
      description: "What's the final step?",
      image: "🥪",
      options: [
        { id: "option-1", text: "Wash your hands", image: "🧼", isCorrect: false },
        { id: "option-2", text: "Cut the sandwich", image: "🔪", isCorrect: true },
        { id: "option-3", text: "Make another sandwich", image: "🥪", isCorrect: false },
      ],
      correctFeedback: "Perfect! Finally, we cut the sandwich and it's ready to eat!"
    }
  ];

  // State
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completedStages, setCompletedStages] = useState<number[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [sandwichSteps, setSandwichSteps] = useState<string[]>([]);

  // Handle option selection
  const handleOptionSelect = (optionId: string) => {
    if (showFeedback) return;
    
    setSelectedOption(optionId);
    
    const currentStage = stages[currentStageIndex];
    const selectedOption = currentStage.options.find(opt => opt.id === optionId);
    
    if (selectedOption) {
      setIsCorrect(selectedOption.isCorrect);
      setShowFeedback(true);
      
      if (selectedOption.isCorrect) {
        // Add to completed stages
        setCompletedStages([...completedStages, currentStageIndex]);
        
        // Add step to sandwich steps
        setSandwichSteps([...sandwichSteps, selectedOption.text]);
        
        // Play success sound
        try {
          new Audio('/audio/correct.mp3').play();
        } catch (e) {
          console.error('Failed to play sound:', e);
        }
        
        // Show confetti on final stage completion
        if (currentStageIndex === stages.length - 1) {
          setShowConfetti(true);
          setTimeout(() => {
            setShowConfetti(false);
            if (onComplete) {
              onComplete();
            }
          }, 3000);
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
  };

  // Move to the next stage
  const handleNextStage = () => {
    if (currentStageIndex < stages.length - 1) {
      setCurrentStageIndex(currentStageIndex + 1);
      setSelectedOption(null);
      setShowFeedback(false);
      setIsCorrect(false);
      
      // Play next stage sound
      try {
        new Audio('/audio/pop.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
  };

  // Try again on incorrect answer
  const handleTryAgain = () => {
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    
    // Play try again sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  // Render the current stage
  const currentStage = stages[currentStageIndex];

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Real-Life Algorithm Puzzle</h2>
          <div className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            Step {currentStageIndex + 1} of {stages.length}
          </div>
        </div>
        <p className="text-gray-600 mt-1">
          Choose the correct next step in the algorithm.
        </p>
      </div>
      
      {/* Progress bar */}
      <div className="mb-6">
        <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
          <div 
            className="h-full bg-blue-500 transition-all duration-500"
            style={{ width: `${(completedStages.length / stages.length) * 100}%` }}
          ></div>
        </div>
      </div>
      
      {/* Current stage */}
      <div className="mb-8">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200 mb-6">
          <div className="flex items-center gap-3">
            <div className="text-4xl">{currentStage.image}</div>
            <div>
              <h3 className="font-bold text-lg">{currentStage.title}</h3>
              <p>{currentStage.description}</p>
            </div>
          </div>
        </div>
        
        {/* Sandwich visualization */}
        {sandwichSteps.length > 0 && (
          <motion.div 
            className="mb-6 p-4 bg-blue-50 rounded-lg"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="font-bold mb-2">Your sandwich so far:</div>
            <div className="flex flex-wrap gap-2">
              {sandwichSteps.map((step, index) => (
                <div 
                  key={index} 
                  className="bg-white px-3 py-1 rounded-full text-sm font-medium border border-blue-200"
                >
                  {index + 1}. {step}
                </div>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {currentStage.options.map((option) => (
            <motion.button
              key={option.id}
              onClick={() => handleOptionSelect(option.id)}
              disabled={showFeedback}
              className={`
                p-4 rounded-lg border-2 flex flex-col items-center text-center
                ${selectedOption === option.id && showFeedback && isCorrect
                  ? 'border-green-500 bg-green-50'
                  : selectedOption === option.id && showFeedback
                  ? 'border-red-500 bg-red-50'
                  : 'border-gray-200 hover:border-blue-300 bg-white'}
              `}
              whileHover={!showFeedback ? { scale: 1.05 } : {}}
              whileTap={!showFeedback ? { scale: 0.95 } : {}}
            >
              <div className="text-4xl mb-2">{option.image}</div>
              <div className="font-medium">{option.text}</div>
            </motion.button>
          ))}
        </div>
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className={`p-4 rounded-lg mb-6 ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}
        >
          <div className="flex items-start gap-3">
            <div className="text-2xl">
              {isCorrect ? '✅' : '❌'}
            </div>
            <div>
              <div className="font-bold">
                {isCorrect ? currentStage.correctFeedback : 'Oops! That\'s not the right step.'}
              </div>
              {!isCorrect && (
                <div className="mt-1">
                  Think about what needs to happen first in this algorithm.
                </div>
              )}
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Action buttons */}
      <div className="flex justify-end">
        {showFeedback && isCorrect && currentStageIndex < stages.length - 1 && (
          <button
            onClick={handleNextStage}
            className="px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700 flex items-center"
          >
            Next Step
            <svg className="w-5 h-5 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}
        
        {showFeedback && !isCorrect && (
          <button
            onClick={handleTryAgain}
            className="px-4 py-2 bg-red-600 text-white rounded-md font-medium hover:bg-red-700"
          >
            Try Again
          </button>
        )}
        
        {showFeedback && isCorrect && currentStageIndex === stages.length - 1 && (
          <div className="text-green-700 font-bold">
            Congratulations! You've completed the algorithm!
          </div>
        )}
      </div>
      
      {/* Confetti effect */}
      {showConfetti && <ConfettiEffect />}
      
      {/* Final completed message */}
      {completedStages.length === stages.length && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mt-6 p-4 bg-green-100 rounded-lg border border-green-300 text-center"
        >
          <div className="text-2xl mb-2">🎉</div>
          <div className="font-bold text-lg text-green-800 mb-1">
            Algorithm Complete!
          </div>
          <p className="text-green-700">
            You've successfully created a PB&J sandwich algorithm!
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default AlgorithmPuzzle; 