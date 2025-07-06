import React, { useState, useRef, useEffect } from 'react';
import { Calculator, Brain, CheckCircle, XCircle, Sparkles, Zap } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

// Import all our common components
import GameIntroModal, { GameActivityModal } from './GameIntroModal';
import GameHeader from './GameHeader';
import GameInstructions from './GameInstructions';
import ProgressBar from './ProgressBar';
import GameCanvas from './GameCanvas';
import GameButtonBar from './GameButtonBar';
import ResultBanner from './ResultBanner';
import ConfettiEffect from './ConfettiEffect';
import SoundPlayer, { useSound } from './SoundPlayer';

// Game stage types
export type GameStage = 'intro' | 'warmup' | 'activity' | 'exit';

// Question for warmup or exit ticket
export interface GameQuestion {
  question: string;
  options?: string[];
  optionImages?: string[];
  answer: string;
  type: 'mcq' | 'input';
  sounds?: {
    select?: string;
    correct?: string;
    incorrect?: string;
  };
}

// Interface for the BaseGameTemplate props
interface BaseGameTemplateProps {
  // Game info
  gameTitle: string;
  gameSubtitle?: string;
  gameDescription: string;
  subject: 'math' | 'science';
  icon?: React.ReactNode;
  
  // Game content
  warmupQuestions: GameQuestion[];
  exitQuestion?: GameQuestion;
  exitQuestions?: GameQuestion[];
  exitCompletionSound?: string;
  
  // Custom components
  activityComponent: React.ReactNode;
  
  // Optional callbacks
  onComplete?: () => void;
  onExit?: () => void;
}

// Particle animation component
const ParticleExplosion = ({ isCorrect }) => {
  const particleCount = 20;
  const colors = isCorrect 
    ? ['#4ade80', '#22c55e', '#16a34a', '#facc15'] // Green and yellow for correct
    : ['#f87171', '#ef4444', '#dc2626', '#fbbf24']; // Red and orange for incorrect
  
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {Array.from({ length: particleCount }).map((_, i) => {
        const size = Math.random() * 10 + 5;
        const duration = Math.random() * 0.8 + 0.6;
        const angle = Math.random() * 360;
        const distance = Math.random() * 100 + 50;
        const delay = Math.random() * 0.2;
        const color = colors[Math.floor(Math.random() * colors.length)];
        
        return (
          <motion.div
            key={i}
            className="absolute rounded-full"
            style={{
              top: '50%',
              left: '50%',
              width: size,
              height: size,
              backgroundColor: color,
              zIndex: 50,
            }}
            initial={{ scale: 0, x: 0, y: 0, opacity: 1 }}
            animate={{
              scale: [0, 1, 0.8],
              x: Math.cos(angle) * distance,
              y: Math.sin(angle) * distance,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: duration,
              delay: delay,
              ease: "easeOut"
            }}
          />
        );
      })}
    </div>
  );
};

// Animated feedback icon
const FeedbackIcon = ({ isCorrect }) => {
  return (
    <span
      className={`ml-auto rounded-full p-2 ${
        isCorrect ? 'bg-green-500' : 'bg-red-500'
      } flex items-center justify-center`}
      style={{ minWidth: 32, minHeight: 32 }}
    >
      {isCorrect ? (
        <Sparkles className="text-white h-6 w-6" />
      ) : (
        <Zap className="text-white h-6 w-6" />
      )}
    </span>
  );
};

const BaseGameTemplate: React.FC<BaseGameTemplateProps> = ({
  gameTitle,
  gameSubtitle,
  gameDescription,
  subject,
  icon,
  warmupQuestions,
  exitQuestion,
  exitQuestions,
  exitCompletionSound,
  activityComponent,
  onComplete,
  onExit
}) => {
  // Use either exitQuestions array or single exitQuestion
  const exitQuestionsArray = exitQuestions || (exitQuestion ? [exitQuestion] : []);
  
  // State
  const [stage, setStage] = useState<GameStage>('intro');
  const [showIntro, setShowIntro] = useState(true);
  const [currentWarmupIndex, setCurrentWarmupIndex] = useState(0);
  const [currentExitIndex, setCurrentExitIndex] = useState(0);
  const [warmupComplete, setWarmupComplete] = useState(false);
  const [activityComplete, setActivityComplete] = useState(false);
  const [exitComplete, setExitComplete] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [exitSelectedOption, setExitSelectedOption] = useState<number | null>(null);
  const [exitShowFeedback, setExitShowFeedback] = useState(false);
  const [exitIsCorrect, setExitIsCorrect] = useState(false);
  const [showParticles, setShowParticles] = useState(false);
  const [exitShowParticles, setExitShowParticles] = useState(false);
  const [exitCorrectAnswers, setExitCorrectAnswers] = useState(0);
  
  // Scoring system
  const [correctWarmupAnswers, setCorrectWarmupAnswers] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  
  // Use our sound hook
  const { playSound } = useSound();
  const navigate = useNavigate();
  
  // Default icon based on subject
  const defaultIcon = subject === 'math' 
    ? <Calculator size={24} className="text-white" />
    : <Brain size={24} className="text-white" />;
  
  // Background colors based on subject
  const headerBackground = subject === 'math'
    ? 'from-blue-600 via-indigo-600 to-purple-600'
    : 'from-green-600 via-teal-600 to-cyan-600';
  
  // Calculate final score when all parts are complete
  useEffect(() => {
    if (exitComplete) {
      // Calculate score based on warmup questions and exit question
      // Warmup questions are worth 60% of the total score
      // Exit question is worth 40% of the total score
      const warmupScore = (correctWarmupAnswers / warmupQuestions.length) * 60;
      const exitScore = exitIsCorrect ? 40 : 0;
      const finalScore = Math.round(warmupScore + exitScore);
      
      setTotalScore(finalScore);
    }
  }, [exitComplete, correctWarmupAnswers, warmupQuestions.length, exitIsCorrect]);
  
  // Handle start button click in intro modal
  const handleStart = () => {
    setShowIntro(false);
    setStage('warmup');
    playSound('pop');
  };
  
  // Handle advancing to next question in warmup
  const handleNextWarmup = () => {
    if (currentWarmupIndex < warmupQuestions.length - 1) {
      setCurrentWarmupIndex(prev => prev + 1);
      playSound('click');
    } else {
      setWarmupComplete(true);
      setStage('activity');
      playSound('complete');
    }
  };
  
  // Handle completion of the main activity
  const handleActivityComplete = () => {
    setActivityComplete(true);
    setStage('exit');
    playSound('cheer');
    // Remove confetti here - it should only show after all parts are complete
  };
  
  // Handle exit ticket completion
  const handleExitComplete = () => {
    setExitComplete(true);
    
    // Play custom completion sound if provided, otherwise use default
    if (exitCompletionSound) {
      playSound(exitCompletionSound);
    } else {
      playSound('complete');
    }
    
    // Show confetti only after all three parts are complete
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 6000);
    if (onComplete) onComplete();
  };
  
  // Toggle sound on/off
  const handleToggleSound = (enabled: boolean) => {
    setSoundEnabled(enabled);
  };
  
  // Handle exit to home
  const handleExitToHome = () => {
    // Always navigate to the root path where the game cards are displayed
    navigate('/');
  };
  
  // Handle option selection in warmup
  const handleOptionSelect = (option: string, idx: number) => {
    setSelectedOption(idx);
    
    // Play select sound if available
    const currentQuestion = warmupQuestions[currentWarmupIndex];
    if (currentQuestion.sounds?.select) {
      playSound(currentQuestion.sounds.select);
    } else {
      playSound('click');
    }
    
    // Check if answer is correct
    const isAnswerCorrect = option === currentQuestion.answer;
    setIsCorrect(isAnswerCorrect);
    setShowFeedback(true);
    
    // Update score if answer is correct
    if (isAnswerCorrect) {
      setCorrectWarmupAnswers(prev => prev + 1);
    }
    
    // Play sound based on correctness
    if (currentQuestion.sounds) {
      playSound(isAnswerCorrect ? currentQuestion.sounds.correct || 'correct-6033' : currentQuestion.sounds.incorrect || 'fail');
    } else {
      playSound(isAnswerCorrect ? 'correct-6033' : 'fail');
    }
    
    // Show particle effect
    setShowParticles(true);
    setTimeout(() => setShowParticles(false), 1000);
    
    // Proceed to next question after delay
    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      handleNextWarmup();
    }, 1800);
  };
  
  // Handle option selection in exit ticket
  const handleExitOptionSelect = (option: string, idx: number) => {
    setExitSelectedOption(idx);
    
    // Play select sound if available
    const currentExitQuestion = exitQuestionsArray[currentExitIndex];
    if (currentExitQuestion.sounds?.select) {
      playSound(currentExitQuestion.sounds.select);
    } else {
      playSound('click');
    }
    
    // Check if answer is correct
    const isAnswerCorrect = option === currentExitQuestion.answer;
    setExitIsCorrect(isAnswerCorrect);
    setExitShowFeedback(true);
    
    // Update correct answers count
    if (isAnswerCorrect) {
      setExitCorrectAnswers(prev => prev + 1);
    }
    
    // Play sound based on correctness
    if (currentExitQuestion.sounds) {
      playSound(isAnswerCorrect ? currentExitQuestion.sounds.correct || 'correct-6033' : currentExitQuestion.sounds.incorrect || 'fail');
    } else {
      playSound(isAnswerCorrect ? 'correct-6033' : 'fail');
    }
    
    // Show particle effect
    setExitShowParticles(true);
    setTimeout(() => setExitShowParticles(false), 1000);
    
    // Proceed to next question or completion after delay
    setTimeout(() => {
      setExitShowFeedback(false);
      setExitSelectedOption(null);
      
      if (currentExitIndex < exitQuestionsArray.length - 1) {
        setCurrentExitIndex(prev => prev + 1);
      } else {
        handleExitComplete();
      }
    }, 1800);
  };
  
  // Handle retry of the game
  const handleRetry = () => {
    // Reset all game state
    setStage('warmup');
    setCurrentWarmupIndex(0);
    setWarmupComplete(false);
    setActivityComplete(false);
    setExitComplete(false);
    setShowConfetti(false);
    setSelectedOption(null);
    setShowFeedback(false);
    setIsCorrect(false);
    setExitSelectedOption(null);
    setExitShowFeedback(false);
    setExitIsCorrect(false);
    setShowParticles(false);
    setExitShowParticles(false);
    setCorrectWarmupAnswers(0);
    setTotalScore(0);
    
    // Play sound effect
    playSound('pop');
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 pb-12 flex flex-col">
      {/* Sound player (invisible) */}
      <SoundPlayer soundEnabled={soundEnabled} onToggleSound={handleToggleSound} />
      
      {/* Game header */}
      <GameHeader
        title={gameTitle}
        subtitle={gameSubtitle}
        icon={icon || defaultIcon}
        backgroundColor={headerBackground}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isSoundOn={soundEnabled}
        subject={subject}
      />
      
      {/* Main content area */}
      <div className="w-full mx-auto px-4 sm:px-6 py-6">
        {/* Progress bar - always visible */}
        <ProgressBar 
          stage={stage} 
          showLabels={true} 
        />
        
        {/* Game content based on current stage */}
        {stage === 'warmup' && !warmupComplete && (
          <>
            <GameInstructions
              instructions="Let's warm up with a quick question!"
              variant="info"
            />
            
            <div className="my-6">
              {warmupQuestions[currentWarmupIndex] && (
                <GameCanvas>
                  <div>
                    <h2 className="text-xl font-bold text-gray-800 mb-3">Warm-Up Question {currentWarmupIndex + 1}</h2>
                    <div className="bg-white p-4 rounded-xl border border-gray-200">
                      <p className="font-bold mb-6 text-xl">{warmupQuestions[currentWarmupIndex].question}</p>
                      {warmupQuestions[currentWarmupIndex].type === 'mcq' && warmupQuestions[currentWarmupIndex].options && (
                        <div className="space-y-6 max-w-3xl mx-auto">
                          {warmupQuestions[currentWarmupIndex].options.map((option, idx) => (
                            <div key={idx} className="relative">
                              <motion.button
                                className={`w-full text-left p-4 rounded-lg relative overflow-hidden flex items-center text-base font-medium
                                  ${selectedOption === idx 
                                    ? 'border-2 shadow-lg' 
                                    : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                                  }
                                  ${selectedOption === idx && showFeedback && isCorrect
                                    ? 'border-green-500'
                                    : selectedOption === idx && showFeedback && !isCorrect
                                    ? 'border-red-500'
                                    : selectedOption === idx
                                    ? 'border-blue-500'
                                    : ''
                                  }
                                  ${warmupQuestions[currentWarmupIndex].optionImages ? 'py-6' : 'p-4'}
                                `}
                                onClick={() => !showFeedback && handleOptionSelect(option, idx)}
                                disabled={showFeedback}
                                whileTap={{ scale: 0.98 }}
                              >
                                {warmupQuestions[currentWarmupIndex].optionImages && warmupQuestions[currentWarmupIndex].optionImages[idx] && (
                                  <div className="flex-shrink-0 mr-4">
                                    <img 
                                      src={warmupQuestions[currentWarmupIndex].optionImages[idx]} 
                                      alt={option}
                                      className="w-20 h-20 object-cover rounded-md shadow-md"
                                    />
                                  </div>
                                )}
                                <span className="relative z-10 text-lg font-medium">{option}</span>
                                {/* Feedback icon inline */}
                                {selectedOption === idx && showFeedback && (
                                  <FeedbackIcon isCorrect={isCorrect} />
                                )}
                              </motion.button>
                              
                              {/* Particle explosion effect */}
                              {selectedOption === idx && showParticles && (
                                <ParticleExplosion isCorrect={isCorrect} />
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </GameCanvas>
              )}
            </div>
            
            <GameButtonBar
              onNext={handleNextWarmup}
              nextText={currentWarmupIndex < warmupQuestions.length - 1 ? "Next Question" : "Start Activity"}
              nextDisabled={showFeedback}
            />
          </>
        )}
        
        {stage === 'activity' && !activityComplete && (
          <>
            <GameInstructions
              instructions="Complete the activity below"
              variant="default"
            />
            
            <div className="my-6">
              <GameCanvas padding="small">
                {/* The main activity goes here */}
                {activityComponent}
              </GameCanvas>
            </div>
            
            <GameButtonBar
              onNext={handleActivityComplete}
              nextText="Complete Activity"
            />
          </>
        )}
        
        {stage === 'exit' && !exitComplete && (
          <>
            <GameInstructions
              instructions="Great job! One last question to check your understanding."
              variant="success"
            />
            
            <div className="my-6">
              <GameCanvas>
                <div>
                  <h2 className="text-xl font-bold text-gray-800 mb-3">Exit Ticket {exitQuestionsArray.length > 1 ? `(${currentExitIndex + 1}/${exitQuestionsArray.length})` : ''}</h2>
                  <div className="bg-white p-4 rounded-xl border border-gray-200">
                    <p className="font-bold mb-6 text-xl">{exitQuestionsArray[currentExitIndex]?.question}</p>
                                         {exitQuestionsArray[currentExitIndex]?.type === 'mcq' && exitQuestionsArray[currentExitIndex]?.options && (
                      <div className="space-y-6 max-w-3xl mx-auto">
                        {exitQuestionsArray[currentExitIndex]?.options?.map((option, idx) => (
                          <div key={idx} className="relative">
                                                          <motion.button
                              className={`w-full text-left rounded-lg relative overflow-hidden flex items-center text-base font-medium
                                ${exitSelectedOption === idx 
                                  ? 'border-2 shadow-lg' 
                                  : 'bg-gray-100 hover:bg-gray-200 border border-gray-200'
                                }
                                ${exitSelectedOption === idx && exitShowFeedback && exitIsCorrect
                                  ? 'border-green-500'
                                  : exitSelectedOption === idx && exitShowFeedback && !exitIsCorrect
                                  ? 'border-red-500'
                                  : exitSelectedOption === idx
                                  ? 'border-blue-500'
                                  : ''
                                }
                                ${exitQuestionsArray[currentExitIndex].optionImages ? 'py-6 px-4' : 'p-4'}
                              `}
                              onClick={() => !exitShowFeedback && handleExitOptionSelect(option, idx)}
                              disabled={exitShowFeedback}
                              whileTap={{ scale: 0.98 }}
                            >
                              {exitQuestionsArray[currentExitIndex].optionImages && exitQuestionsArray[currentExitIndex].optionImages[idx] && (
                                <div className="flex-shrink-0 mr-4">
                                  <img 
                                    src={exitQuestionsArray[currentExitIndex].optionImages[idx]} 
                                    alt={option}
                                    className="w-20 h-20 object-cover rounded-md shadow-md"
                                  />
                                </div>
                              )}
                              <span className="relative z-10 text-lg font-medium">{option}</span>
                              {/* Feedback icon inline */}
                              {exitSelectedOption === idx && exitShowFeedback && (
                                <FeedbackIcon isCorrect={exitIsCorrect} />
                              )}
                            </motion.button>
                            
                            {/* Particle explosion effect */}
                            {exitSelectedOption === idx && exitShowParticles && (
                              <ParticleExplosion isCorrect={exitIsCorrect} />
                            )}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </GameCanvas>
            </div>
            
            <GameButtonBar
              onNext={handleExitComplete}
              nextText="Submit"
              nextDisabled={exitShowFeedback}
            />
          </>
        )}
        
        {exitComplete && (
          <div className="my-6">
            <ResultBanner
              type="success"
              title="Awesome Work!"
              message="You've completed this activity successfully!"
              score={totalScore}
              onButtonClick={onExit || handleExitToHome}
              buttonText="Return to Games"
              onRetry={totalScore < 60 ? handleRetry : undefined}
            />
          </div>
        )}
      </div>
      
      {/* Intro modal */}
      <GameActivityModal
        title={gameTitle}
        description={gameDescription}
        onStart={handleStart}
        isOpen={showIntro}
      />
      
      {/* Confetti effect */}
      <ConfettiEffect active={showConfetti} />
    </div>
  );
};

export default BaseGameTemplate; 