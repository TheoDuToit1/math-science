import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface Question {
  equation: string;
  answer: number;
}

const SpeedRoundRelay: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [userAnswer, setUserAnswer] = useState<string>('');
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [showFeedback, setShowFeedback] = useState<boolean>(false);
  const [timeLeft, setTimeLeft] = useState<number>(60);
  const [isGameActive, setIsGameActive] = useState<boolean>(false);
  const [isGameComplete, setIsGameComplete] = useState<boolean>(false);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const [characterType, setCharacterType] = useState<string>('wizard'); // wizard, racer, astronaut
  const inputRef = useRef<HTMLInputElement>(null);

  // Questions for the speed round
  const questions: Question[] = [
    { equation: '9 × 1', answer: 9 },
    { equation: '9 × 2', answer: 18 },
    { equation: '9 × 3', answer: 27 },
    { equation: '9 × 4', answer: 36 },
    { equation: '9 × 5', answer: 45 },
    { equation: '9 × 6', answer: 54 },
    { equation: '9 × 7', answer: 63 },
    { equation: '9 × 8', answer: 72 },
    { equation: '9 × 9', answer: 81 },
    { equation: '9 × 10', answer: 90 },
  ];

  // Timer effect
  useEffect(() => {
    let timer: NodeJS.Timeout;
    
    if (isGameActive && timeLeft > 0 && !isGameComplete) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0 && !isGameComplete) {
      // Time's up!
      setIsGameActive(false);
    }
    
    return () => {
      if (timer) clearTimeout(timer);
    };
  }, [timeLeft, isGameActive, isGameComplete]);

  // Focus input when game starts
  useEffect(() => {
    if (isGameActive && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isGameActive, currentStep]);

  // Random character selection
  useEffect(() => {
    const characters = ['wizard', 'racer', 'astronaut'];
    const randomIndex = Math.floor(Math.random() * characters.length);
    setCharacterType(characters[randomIndex]);
  }, []);

  const startGame = () => {
    setIsGameActive(true);
    setTimeLeft(60);
    setCurrentStep(0);
    setUserAnswer('');
    setIsGameComplete(false);
    setShowFeedback(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isGameActive) return;
    
    const currentQuestion = questions[currentStep];
    const isAnswerCorrect = parseInt(userAnswer) === currentQuestion.answer;
    
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    if (isAnswerCorrect) {
      // Correct answer
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer('');
        
        if (currentStep < questions.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Game completed successfully!
          setIsGameComplete(true);
          setShowConfetti(true);
          setTimeout(() => setShowConfetti(false), 5000);
        }
      }, 1000);
    } else {
      // Incorrect answer - clear after a moment
      setTimeout(() => {
        setShowFeedback(false);
        setUserAnswer('');
      }, 1000);
    }
  };

  const renderCharacter = () => {
    let emoji = '🧙‍♂️';
    
    switch (characterType) {
      case 'racer':
        emoji = '🏃‍♂️';
        break;
      case 'astronaut':
        emoji = '👨‍🚀';
        break;
      default:
        emoji = '🧙‍♂️';
    }
    
    return emoji;
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Speed Round Relay</h2>
      
      {!isGameActive && !isGameComplete ? (
        <div className="flex flex-col items-center">
          <div className="text-lg mb-6 text-center">
            Race against the clock to solve all 10 multiplication problems!
            <div className="text-sm text-gray-600 mt-2">
              You have 60 seconds to answer all questions correctly
            </div>
          </div>
          
          <button
            onClick={startGame}
            className="px-6 py-3 bg-green-500 text-white rounded-lg text-lg font-medium"
          >
            Start Race!
          </button>
        </div>
      ) : (
        <>
          {/* Timer */}
          <div className="flex justify-between items-center mb-6">
            <div className="text-lg font-medium">
              Question {currentStep + 1} of {questions.length}
            </div>
            <div className={`text-xl font-bold ${timeLeft <= 10 ? 'text-red-500' : ''}`}>
              {timeLeft} seconds left
            </div>
          </div>
          
          {/* Race track visualization */}
          <div className="bg-gray-100 rounded-lg p-4 mb-6">
            <div className="flex justify-between mb-2">
              <div>Start</div>
              <div>Finish</div>
            </div>
            
            <div className="h-8 bg-gray-200 rounded-full relative mb-2">
              {/* Progress bar */}
              <motion.div
                className="h-full bg-blue-500 rounded-full"
                initial={{ width: '0%' }}
                animate={{ width: `${(currentStep / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
              />
              
              {/* Character */}
              <motion.div
                className="absolute top-0 text-2xl"
                initial={{ left: '0%' }}
                animate={{ left: `${(currentStep / questions.length) * 100}%` }}
                transition={{ duration: 0.5 }}
                style={{ transform: 'translateY(-50%)' }}
              >
                {renderCharacter()}
              </motion.div>
            </div>
            
            {/* Step markers */}
            <div className="flex justify-between">
              {questions.map((_, index) => (
                <div 
                  key={index}
                  className={`w-2 h-2 rounded-full ${
                    index <= currentStep ? 'bg-blue-500' : 'bg-gray-300'
                  }`}
                />
              ))}
            </div>
          </div>
          
          {/* Current question */}
          {!isGameComplete && (
            <div className="bg-blue-50 rounded-lg p-6 mb-6">
              <div className="text-2xl font-bold text-center mb-4">
                {questions[currentStep].equation} = ?
              </div>
              
              <form onSubmit={handleSubmit} className="flex justify-center">
                <input
                  ref={inputRef}
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  className={`px-4 py-2 text-2xl text-center w-24 border-2 rounded-lg ${
                    showFeedback 
                      ? isCorrect 
                        ? 'border-green-500 bg-green-50' 
                        : 'border-red-500 bg-red-50'
                      : 'border-gray-300'
                  }`}
                  placeholder="?"
                  disabled={!isGameActive || showFeedback}
                />
                <button
                  type="submit"
                  className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
                  disabled={!userAnswer || !isGameActive || showFeedback}
                >
                  Submit
                </button>
              </form>
              
              <AnimatePresence>
                {showFeedback && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={`mt-4 p-2 rounded-lg text-center ${
                      isCorrect ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                    }`}
                  >
                    {isCorrect 
                      ? 'Correct! Moving forward...' 
                      : `Try again! ${questions[currentStep].equation} = ${questions[currentStep].answer}`}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          )}
          
          {/* Game complete message */}
          {isGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-purple-500 to-blue-500 p-6 rounded-lg text-white text-center"
            >
              <div className="text-2xl font-bold mb-2">🎉 Race Complete! 🎉</div>
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-xl font-medium">
                You finished with {timeLeft} seconds remaining!
              </div>
              <div className="text-sm mt-4">
                You've mastered the 9× multiplication table!
              </div>
              <button
                onClick={startGame}
                className="mt-6 px-6 py-2 bg-white text-purple-700 rounded-lg font-medium"
              >
                Play Again
              </button>
            </motion.div>
          )}
          
          {/* Time's up message */}
          {timeLeft === 0 && !isGameComplete && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-red-100 p-6 rounded-lg text-center"
            >
              <div className="text-2xl font-bold mb-2 text-red-700">Time's Up!</div>
              <div className="text-lg mb-4">
                You completed {currentStep} out of {questions.length} questions.
              </div>
              <button
                onClick={startGame}
                className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium"
              >
                Try Again
              </button>
            </motion.div>
          )}
        </>
      )}
      
      {showConfetti && <ConfettiEffect />}
      {isCorrect && showFeedback && <SoundPlayer soundFile="/audio/correct.mp3" autoPlay />}
      {!isCorrect && showFeedback && <SoundPlayer soundFile="/audio/incorrect.mp3" autoPlay />}
      {isGameComplete && <SoundPlayer soundFile="/audio/win.mp3" autoPlay />}
    </div>
  );
};

export default SpeedRoundRelay; 