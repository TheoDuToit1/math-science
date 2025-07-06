import React, { useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';

interface ProgressBarProps {
  stage: 'intro' | 'warmup' | 'activity' | 'exit';
  customPercentage?: number;
  showLabels?: boolean;
  currentQuestion?: number;
  totalQuestions?: number;
  sectionProgress?: Record<string, number>;
  totalQuestionsPerSection?: Record<string, number>;
  currentSection?: string;
}

const ProgressBar: React.FC<ProgressBarProps> = ({
  stage,
  customPercentage,
  showLabels = false,
  currentQuestion,
  totalQuestions,
  sectionProgress = { intro: 0, myth: 0, activity: 0, wrap: 0 },
  totalQuestionsPerSection = { intro: 4, myth: 2, activity: 1, wrap: 2 },
  currentSection = "intro"
}) => {
  const fillControls = useAnimation();
  
  // Calculate percentage based on stage or questions
  let percentage = customPercentage !== undefined ? customPercentage : 0;
  
  if (currentQuestion !== undefined && totalQuestions && totalQuestions > 0) {
    percentage = Math.round(((currentQuestion + 1) / totalQuestions) * 100);
  } else if (!customPercentage) {
    switch (stage) {
      case 'intro':
        percentage = 25;
        break;
      case 'warmup':
        percentage = 50;
        break;
      case 'activity':
        percentage = 75;
        break;
      case 'exit':
        percentage = 100;
        break;
    }
  }

  // Define section info for visualization
  const sections = [
    { id: 'intro', name: 'Intro', color: '#60a5fa' },
    { id: 'myth', name: 'Myth', color: '#a78bfa' },
    { id: 'activity', name: 'Activity', color: '#4ade80' },
    { id: 'wrap', name: 'Wrap', color: '#facc15' }
  ];

  // Calculate total questions across all sections
  const totalQuestionsCount = Object.values(totalQuestionsPerSection).reduce((a, b) => a + b, 0);
  
  // Calculate section widths based on question distribution
  const getSectionWidth = (sectionId: string) => {
    return `${(totalQuestionsPerSection[sectionId] / totalQuestionsCount) * 100}%`;
  };

  // Calculate section fill percentage
  const getSectionFillPercentage = (sectionId: string) => {
    const total = totalQuestionsPerSection[sectionId];
    const progress = sectionProgress[sectionId] || 0;
    return total > 0 ? (progress / total) * 100 : 0;
  };

  // Animate progress fill when percentage changes
  useEffect(() => {
    fillControls.start({
      width: `${percentage}%`,
      transition: { duration: 0.5, ease: "easeOut" }
    });
  }, [percentage, fillControls]);

  return (
    <div className="mb-6 overflow-hidden max-w-4xl mx-auto">
      {/* Question Counter */}
      {currentQuestion !== undefined && totalQuestions && (
        <motion.div 
          className="mb-2 text-center text-gray-700 font-medium"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          key={`question-${currentQuestion}`}
          transition={{ duration: 0.3 }}
        >
          Question {currentQuestion + 1} of {totalQuestions}
        </motion.div>
      )}
      
      {/* Main Progress Bar - Simple Clean Design */}
      <div className="relative h-6 bg-gray-200 rounded-lg overflow-hidden shadow-inner mx-3">
        <motion.div
          className="h-full rounded-lg flex items-center justify-end pr-2"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5 }}
          style={{
            background: 'linear-gradient(90deg, #60a5fa, #818cf8, #a78bfa)'
          }}
        >
          {percentage > 15 && (
            <span className="text-xs font-semibold text-white">{percentage}%</span>
          )}
        </motion.div>
        
        {/* Progress dots */}
        <div className="absolute top-0 left-0 w-full h-full flex items-center px-2">
          {[0, 25, 50, 75, 100].map((step, index) => {
            // Adjust the position calculation to account for edge cases
            let position = step;
            if (step === 0) position = 2; // Move first dot slightly in from the edge
            if (step === 100) position = 98; // Move last dot slightly in from the edge
            
            return (
            <div 
              key={index}
                className="absolute"
              style={{ 
                  left: `${position}%`, 
                  transform: 'translateX(-50%)'
                }}
              >
                <div 
                  className={`w-3 h-3 rounded-full ${
                    percentage >= step 
                      ? 'bg-white' 
                      : 'bg-gray-400'
                  }`}
                  style={{
                    boxShadow: percentage >= step 
                      ? '0 0 0 2px rgba(255,255,255,0.4)' 
                      : 'none'
              }}
                />
            </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default ProgressBar; 