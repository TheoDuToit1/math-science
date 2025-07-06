import React, { useState, useRef } from 'react';
import { motion } from 'framer-motion';

interface CycleStage {
  id: string;
  name: string;
  icon: string;
  description: string;
  image?: string;
  color: string;
}

const CycleSpinner: React.FC = () => {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [currentStage, setCurrentStage] = useState<CycleStage | null>(null);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const spinButtonRef = useRef<HTMLButtonElement>(null);
  
  const stages: CycleStage[] = [
    {
      id: 'evaporation',
      name: 'Evaporation',
      icon: '☀️',
      description: 'The sun heats water, turning it into vapor that rises into the air.',
      image: '/images/science/s5_water_cycle_adventure/evaporation.png',
      color: 'bg-yellow-200'
    },
    {
      id: 'condensation',
      name: 'Condensation',
      icon: '☁️',
      description: 'Water vapor cools and forms clouds.',
      image: '/images/science/s5_water_cycle_adventure/condensation.jpg',
      color: 'bg-blue-200'
    },
    {
      id: 'precipitation',
      name: 'Precipitation',
      icon: '🌧️',
      description: 'Water falls from clouds as rain, snow, or hail.',
      image: '/images/science/s5_water_cycle_adventure/drop.png',
      color: 'bg-indigo-200'
    },
    {
      id: 'collection',
      name: 'Collection',
      icon: '🌊',
      description: 'Water collects in oceans, lakes, and rivers.',
      image: '/images/science/s5_water_cycle_adventure/thunderstorm-village.jpg',
      color: 'bg-green-200'
    }
  ];

  const spinWheel = () => {
    if (isSpinning) return;
    
    setIsSpinning(true);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
    
    const spinRotations = 2 + Math.floor(Math.random() * 3);
    const segmentAngle = 360 / stages.length;
    const randomSegment = Math.floor(Math.random() * stages.length);
    const segmentRotation = randomSegment * segmentAngle;
    
    const targetRotation = (spinRotations * 360) + segmentRotation + (segmentAngle / 2);
    
    setRotation(targetRotation);
    
    setTimeout(() => {
      const normalizedRotation = targetRotation % 360;
      const landedSegmentIndex = Math.floor(normalizedRotation / segmentAngle) % stages.length;
      const actualSegmentIndex = (stages.length - landedSegmentIndex) % stages.length;
      
      setCurrentStage(stages[actualSegmentIndex]);
      setIsSpinning(false);
      setAttempts(attempts + 1);
    }, 3000);
  };

  const handleAnswerSelect = (stageId: string) => {
    if (!currentStage || selectedAnswer !== null) return;
    
    setSelectedAnswer(stageId);
    const correct = stageId === currentStage.id;
    setIsCorrect(correct);
    setShowFeedback(true);
    
    try {
      const audio = new Audio(correct ? '/audio/correct.mp3' : '/audio/incorrect.mp3');
      audio.play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
    
    if (correct) {
      setScore(score + 1);
    }
    
    setTimeout(() => {
      if (spinButtonRef.current) {
        spinButtonRef.current.focus();
      }
    }, 1500);
  };

  const resetGame = () => {
    setScore(0);
    setAttempts(0);
    setCurrentStage(null);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Cycle Spinner Game</h2>
      <p className="text-center mb-4">Spin the wheel and identify the water cycle process shown!</p>
      
      <div className="flex flex-col md:flex-row gap-6 items-center">
        <div className="relative w-64 h-64">
          <motion.div
            className="w-full h-full rounded-full overflow-hidden border-4 border-gray-300 shadow-lg"
            style={{
              backgroundImage: `conic-gradient(${stages.map((stage, i) => 
                `${stage.color} ${(i * 100) / stages.length}%, ${stage.color} ${((i + 1) * 100) / stages.length}%`
              ).join(', ')})`,
              transform: `rotate(${rotation}deg)`
            }}
            animate={isSpinning ? { rotate: rotation } : {}}
            transition={{ duration: 3, ease: "easeOut" }}
          >
            {stages.map((stage, i) => {
              const angle = (i * 360) / stages.length;
              return (
                <div
                  key={stage.id}
                  className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center"
                  style={{
                    transform: `rotate(${angle}deg) translateY(-24px)`,
                    transformOrigin: 'center 24px',
                  }}
                >
                  <span className="text-2xl">{stage.icon}</span>
                </div>
              );
            })}
          </motion.div>
          
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="w-0 h-0 border-l-8 border-r-8 border-b-12 border-l-transparent border-r-transparent border-b-red-500"></div>
          </div>
        </div>
        
        <div className="w-full max-w-xs flex flex-col items-center">
          <button
            ref={spinButtonRef}
            onClick={spinWheel}
            disabled={isSpinning}
            className={`px-6 py-3 mb-4 rounded-full font-bold text-white ${
              isSpinning ? 'bg-gray-400' : 'bg-blue-500 hover:bg-blue-600'
            } transition-colors shadow-md`}
          >
            {isSpinning ? 'Spinning...' : 'Spin the Wheel!'}
          </button>
          
          {currentStage && !isSpinning && (
            <div className="mb-4 w-full">
              <img
                src={currentStage.image}
                alt={currentStage.name}
                className="w-full h-32 object-cover rounded-lg shadow"
              />
            </div>
          )}
          
          {currentStage && !isSpinning && (
            <div className="grid grid-cols-2 gap-2 w-full">
              {stages.map((stage) => (
                <button
                  key={stage.id}
                  onClick={() => handleAnswerSelect(stage.id)}
                  disabled={selectedAnswer !== null}
                  className={`p-2 rounded border-2 ${
                    selectedAnswer === stage.id
                      ? isCorrect
                        ? 'border-green-500 bg-green-100'
                        : 'border-red-500 bg-red-100'
                      : 'border-gray-300 hover:bg-gray-100'
                  }`}
                >
                  <div className="flex flex-col items-center">
                    <span className="text-xl">{stage.icon}</span>
                    <span className="text-sm font-medium">{stage.name}</span>
                  </div>
                </button>
              ))}
            </div>
          )}
          
          {showFeedback && (
            <div className={`mt-4 p-3 rounded-lg text-center w-full ${
              isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
            }`}>
              {isCorrect ? (
                <p className="font-semibold">Correct! That's {currentStage?.name}!</p>
              ) : (
                <p className="font-semibold">Not quite! This is {currentStage?.name}.</p>
              )}
            </div>
          )}
          
          <div className="mt-4 text-center">
            <p className="font-semibold">Score: {score}/{attempts}</p>
            {attempts >= 5 && (
              <button
                onClick={resetGame}
                className="mt-2 px-4 py-1 bg-indigo-100 text-indigo-800 rounded hover:bg-indigo-200"
              >
                Reset Game
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CycleSpinner; 