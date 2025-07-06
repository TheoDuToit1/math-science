import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface CycleStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  color: string;
  position: string;
}

const WaterCycleSpinner: React.FC = () => {
  const [currentStage, setCurrentStage] = useState<CycleStage | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [gameActive, setGameActive] = useState(false);
  
  const stages: CycleStage[] = [
    {
      id: 'evaporation',
      name: 'Evaporation',
      icon: '☀️',
      description: 'The sun heats water, turning it into vapor that rises into the air.',
      image: '/images/science/s5_water_cycle_adventure/evaporation.png',
      color: 'bg-yellow-200',
      position: 'bottom-left'
    },
    {
      id: 'condensation',
      name: 'Condensation',
      icon: '☁️',
      description: 'Water vapor cools and forms clouds.',
      image: '/images/science/s5_water_cycle_adventure/condensation.jpg',
      color: 'bg-blue-200',
      position: 'top'
    },
    {
      id: 'precipitation',
      name: 'Precipitation',
      icon: '🌧️',
      description: 'Water falls from clouds as rain, snow, or hail.',
      image: '/images/science/s5_water_cycle_adventure/drop.png',
      color: 'bg-indigo-200',
      position: 'top-right'
    },
    {
      id: 'collection',
      name: 'Collection',
      icon: '🌊',
      description: 'Water collects in oceans, lakes, and rivers.',
      image: '/images/science/s5_water_cycle_adventure/sun-above-water.jpg',
      color: 'bg-green-200',
      position: 'bottom-right'
    }
  ];

  const startGame = () => {
    setGameActive(true);
    nextQuestion();
  };

  const nextQuestion = () => {
    // Reset state for new question
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    
    // Randomly select a stage
    const randomIndex = Math.floor(Math.random() * stages.length);
    setCurrentStage(stages[randomIndex]);
    
    // Play sound
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  const handleAnswerSelect = (stageId: string) => {
    if (!currentStage || selectedAnswer !== null) return;
    
    setSelectedAnswer(stageId);
    const correct = stageId === currentStage.id;
    setIsCorrect(correct);
    setShowFeedback(true);
    setAttempts(attempts + 1);
    
    // Play sound based on correctness
    try {
      const audio = new Audio(correct ? '/audio/correct.mp3' : '/audio/incorrect.mp3');
      audio.play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
    
    if (correct) {
      setScore(score + 1);
    }
    
    // Show next question after delay
    setTimeout(() => {
      if (attempts < 9) { // Limit to 10 questions
        nextQuestion();
      } else {
        setGameActive(false); // End game after 10 questions
      }
    }, 2000);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setCurrentStage(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setGameActive(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Water Cycle Challenge</h2>
      <p className="text-center mb-4">Identify each stage of the water cycle from the image shown!</p>
      
      {!gameActive ? (
        <div className="flex flex-col items-center mb-6">
          {/* Water cycle diagram */}
          <div className="relative w-full max-w-md h-64 bg-blue-50 rounded-xl mb-6 p-4">
            <img 
              src="/images/science/s5_water_cycle_adventure/sun-above-water.jpg" 
              alt="Water cycle background"
              className="absolute inset-0 w-full h-full object-cover rounded-xl opacity-30"
            />
            
            {/* Cycle icons */}
            <div className="absolute bottom-4 left-4 bg-yellow-100 rounded-full p-2 border-2 border-yellow-300">
              <span className="text-2xl">☀️</span>
              <div className="absolute -top-6 text-xs font-bold">Evaporation</div>
            </div>
            
            <div className="absolute top-4 left-1/2 transform -translate-x-1/2 bg-blue-100 rounded-full p-2 border-2 border-blue-300">
              <span className="text-2xl">☁️</span>
              <div className="absolute -top-6 text-xs font-bold">Condensation</div>
            </div>
            
            <div className="absolute top-1/3 right-4 bg-indigo-100 rounded-full p-2 border-2 border-indigo-300">
              <span className="text-2xl">🌧️</span>
              <div className="absolute -top-6 text-xs font-bold">Precipitation</div>
            </div>
            
            <div className="absolute bottom-4 right-4 bg-green-100 rounded-full p-2 border-2 border-green-300">
              <span className="text-2xl">🌊</span>
              <div className="absolute -top-6 text-xs font-bold">Collection</div>
            </div>
            
            {/* Arrows showing the cycle */}
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 400 250" fill="none">
              <path d="M80,180 C120,100 200,80 200,80" stroke="#4299e1" strokeWidth="3" strokeDasharray="5,5"/>
              <path d="M200,80 C240,100 280,120 320,140" stroke="#4299e1" strokeWidth="3" strokeDasharray="5,5"/>
              <path d="M320,140 C300,160 280,180 280,180" stroke="#4299e1" strokeWidth="3" strokeDasharray="5,5"/>
              <path d="M280,180 C240,180 120,180 80,180" stroke="#4299e1" strokeWidth="3" strokeDasharray="5,5"/>
              
              {/* Arrow heads */}
              <polygon points="200,75 195,85 205,85" fill="#4299e1"/>
              <polygon points="325,140 315,135 315,145" fill="#4299e1"/>
              <polygon points="275,185 285,175 285,195" fill="#4299e1"/>
              <polygon points="75,180 85,175 85,185" fill="#4299e1"/>
            </svg>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-blue-500 text-white rounded-full font-bold text-lg hover:bg-blue-600 transition-colors shadow-md"
          >
            Start Challenge!
          </button>
          
          {attempts > 0 && (
            <div className="mt-4 text-center">
              <p className="font-semibold text-lg">Your score: {score}/{attempts}</p>
              {score === attempts && attempts > 0 ? (
                <p className="text-green-600">Perfect! You're a water cycle expert!</p>
              ) : score >= attempts * 0.7 ? (
                <p className="text-blue-600">Great job! You know the water cycle well.</p>
              ) : (
                <p className="text-orange-600">Keep practicing to learn the water cycle better!</p>
              )}
            </div>
          )}
        </div>
      ) : (
        <div className="w-full max-w-md">
          {/* Game UI */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6">
            <div className="mb-2 text-sm font-medium text-gray-500">Question {attempts + 1}/10</div>
            
            {/* Progress bar */}
            <div className="w-full h-2 bg-gray-200 rounded-full mb-4">
              <div 
                className="h-2 bg-blue-500 rounded-full transition-all duration-300"
                style={{ width: `${(attempts / 10) * 100}%` }}
              ></div>
            </div>
            
            {/* Current image */}
            {currentStage && (
              <div className="flex justify-center mb-4">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="relative"
                >
                  <img 
                    src={currentStage.image} 
                    alt="Water cycle stage"
                    className="h-48 object-cover rounded-lg shadow"
                  />
                  <div className="absolute bottom-2 right-2 bg-white bg-opacity-75 rounded px-2 py-1 text-sm font-medium">
                    What stage is this?
                  </div>
                </motion.div>
              </div>
            )}
            
            {/* Answer options */}
            <div className="grid grid-cols-2 gap-3 mb-4">
              {stages.map((stage) => (
                <motion.button
                  key={stage.id}
                  onClick={() => handleAnswerSelect(stage.id)}
                  disabled={selectedAnswer !== null}
                  className={`p-3 rounded-lg border-2 ${
                    selectedAnswer === stage.id
                      ? isCorrect
                        ? 'border-green-500 bg-green-100'
                        : 'border-red-500 bg-red-100'
                      : 'border-blue-300 bg-white hover:bg-blue-50'
                  } flex flex-col items-center justify-center transition-colors`}
                  whileHover={{ scale: selectedAnswer === null ? 1.03 : 1 }}
                  whileTap={{ scale: selectedAnswer === null ? 0.97 : 1 }}
                >
                  <span className="text-2xl mb-1">{stage.icon}</span>
                  <span className="font-medium text-sm">{stage.name}</span>
                </motion.button>
              ))}
            </div>
            
            {/* Feedback */}
            {showFeedback && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-3 rounded-lg text-center mb-4 ${
                  isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}
              >
                {isCorrect ? (
                  <p className="font-semibold">Correct! That's {currentStage?.name}!</p>
                ) : (
                  <p className="font-semibold">Not quite! This is {currentStage?.name}.</p>
                )}
                <p className="text-sm mt-1">{currentStage?.description}</p>
              </motion.div>
            )}
          </div>
          
          {/* Score */}
          <div className="flex justify-between items-center">
            <div className="font-semibold">Score: {score}/{attempts}</div>
            <button
              onClick={resetGame}
              className="px-4 py-1 bg-gray-200 text-gray-800 rounded hover:bg-gray-300"
            >
              End Game
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default WaterCycleSpinner; 