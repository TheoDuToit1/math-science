import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

interface ScenarioItem {
  id: string;
  text: string;
  image?: string;
  correctAnswer: string;
}

const WeatherWatch: React.FC = () => {
  const [scenarios, setScenarios] = useState<ScenarioItem[]>([
    {
      id: 'rain',
      text: 'Rain falling from sky',
      image: '/images/science/s5_water_cycle_adventure/drop.png',
      correctAnswer: 'precipitation'
    },
    {
      id: 'sun_ocean',
      text: 'Sun heats ocean',
      image: '/images/science/s5_water_cycle_adventure/sun-above-water.jpg',
      correctAnswer: 'evaporation'
    },
    {
      id: 'clouds',
      text: 'Clouds forming',
      image: '/images/science/s5_water_cycle_adventure/rainy-cloud-form.png',
      correctAnswer: 'condensation'
    },
    {
      id: 'river_flow',
      text: 'Water flows back to sea',
      image: '/images/science/s5_water_cycle_adventure/thunderstorm-village.jpg',
      correctAnswer: 'collection'
    }
  ]);

  const [currentScenarioIndex, setCurrentScenarioIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [score, setScore] = useState(0);
  const [showFeedback, setShowFeedback] = useState(false);
  const [completed, setCompleted] = useState(false);

  const waterCycleStages = [
    { id: 'evaporation', name: 'Evaporation', icon: '☀️' },
    { id: 'condensation', name: 'Condensation', icon: '☁️' },
    { id: 'precipitation', name: 'Precipitation', icon: '🌧️' },
    { id: 'collection', name: 'Collection', icon: '🌊' }
  ];

  const currentScenario = scenarios[currentScenarioIndex];

  useEffect(() => {
    // Shuffle scenarios on component mount
    const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
    setScenarios(shuffled);
  }, []);

  const handleAnswerSelect = (answerId: string) => {
    if (selectedAnswer !== null || showFeedback) return;

    setSelectedAnswer(answerId);
    const correct = answerId === currentScenario.correctAnswer;
    setIsCorrect(correct);
    setShowFeedback(true);

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

    // Move to next scenario after delay
    setTimeout(() => {
      if (currentScenarioIndex < scenarios.length - 1) {
        setCurrentScenarioIndex(currentScenarioIndex + 1);
        setSelectedAnswer(null);
        setIsCorrect(null);
        setShowFeedback(false);
      } else {
        setCompleted(true);
      }
    }, 1500);
  };

  const resetActivity = () => {
    const shuffled = [...scenarios].sort(() => Math.random() - 0.5);
    setScenarios(shuffled);
    setCurrentScenarioIndex(0);
    setSelectedAnswer(null);
    setIsCorrect(null);
    setShowFeedback(false);
    setScore(0);
    setCompleted(false);
  };

  return (
    <div className="flex flex-col items-center">
      <h2 className="text-xl font-bold mb-2">Weather Watch</h2>
      <p className="text-center mb-4">Match each weather scenario to the correct water cycle stage!</p>

      {!completed ? (
        <>
          {/* Progress indicator */}
          <div className="w-full max-w-md mb-4 flex items-center">
            <div className="flex-1 h-2 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-2 bg-blue-500 rounded-full transition-all duration-500"
                style={{ width: `${((currentScenarioIndex) / scenarios.length) * 100}%` }}
              />
            </div>
            <span className="ml-2 text-sm font-medium text-gray-600">
              {currentScenarioIndex + 1}/{scenarios.length}
            </span>
          </div>

          {/* Current scenario */}
          <div className="bg-white rounded-lg shadow-md p-4 mb-6 w-full max-w-md">
            <div className="flex items-center justify-center mb-4">
              {currentScenario.image && (
                <img 
                  src={currentScenario.image} 
                  alt={currentScenario.text} 
                  className="h-32 object-contain rounded"
                />
              )}
            </div>
            <p className="text-lg font-semibold text-center">{currentScenario.text}</p>
          </div>

          {/* Answer options */}
          <div className="grid grid-cols-2 gap-3 w-full max-w-md">
            {waterCycleStages.map((stage) => (
              <motion.button
                key={stage.id}
                className={`p-3 rounded-lg border-2 ${
                  selectedAnswer === stage.id
                    ? isCorrect
                      ? 'border-green-500 bg-green-100'
                      : 'border-red-500 bg-red-100'
                    : 'border-blue-300 bg-white hover:bg-blue-50'
                } flex flex-col items-center justify-center transition-colors`}
                onClick={() => handleAnswerSelect(stage.id)}
                disabled={selectedAnswer !== null}
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
              className={`mt-4 p-3 rounded-lg text-center w-full max-w-md ${
                isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
              }`}
            >
              {isCorrect ? (
                <p className="font-semibold">✅ Correct! That's the right stage!</p>
              ) : (
                <p className="font-semibold">❌ Not quite! This is part of the {
                  waterCycleStages.find(stage => stage.id === currentScenario.correctAnswer)?.name
                } stage.</p>
              )}
            </motion.div>
          )}
        </>
      ) : (
        // Completion screen
        <div className="bg-blue-50 rounded-lg p-6 w-full max-w-md text-center">
          <h3 className="text-2xl font-bold mb-2">Activity Complete!</h3>
          <p className="text-lg mb-4">You scored {score} out of {scenarios.length}!</p>
          
          {score === scenarios.length ? (
            <div className="text-green-600 text-xl mb-4">🎉 Perfect score! You're a water cycle expert!</div>
          ) : score >= scenarios.length / 2 ? (
            <div className="text-blue-600 text-xl mb-4">👍 Good job! You understand the water cycle well.</div>
          ) : (
            <div className="text-orange-600 text-xl mb-4">🤔 Let's practice more to understand the water cycle better.</div>
          )}
          
          <button
            onClick={resetActivity}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
          >
            Play Again
          </button>
        </div>
      )}
    </div>
  );
};

export default WeatherWatch; 