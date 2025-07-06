import React from 'react';
import { motion } from 'framer-motion';

interface Challenge {
  title: string;
  description: string;
}

interface WrapUpProps {
  title?: string;
  summary?: string;
  keyPoints?: string[];
  questions?: string[];
  challenge?: Challenge;
  nextLessonText?: string;
  onComplete?: () => void;
  children?: React.ReactNode;
}

const WrapUp: React.FC<WrapUpProps> = ({ 
  title = "Great Job!",
  summary = "You've completed this lesson!",
  keyPoints = [],
  questions = [],
  challenge,
  nextLessonText,
  onComplete,
  children 
}) => {
  return (
    <div className="flex flex-col gap-6 bg-white p-6 rounded-lg shadow">
      {/* Header */}
      <div className="text-center">
        <motion.h2 
          className="text-2xl font-bold mb-2"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {title}
        </motion.h2>
        <motion.p 
          className="text-lg"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {summary}
        </motion.p>
      </div>
      
      {/* Key Points */}
      {keyPoints.length > 0 && (
        <motion.div 
          className="bg-blue-50 p-6 rounded-lg shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">Key Points</h3>
          <ul className="list-disc ml-8 space-y-2">
            {keyPoints.map((point, i) => (
              <motion.li 
                key={i} 
                className="text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + (i * 0.1) }}
              >
                {point}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Reflection Questions */}
      {questions.length > 0 && (
        <motion.div 
          className="bg-purple-50 p-6 rounded-lg shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.5 }}
        >
          <h3 className="text-xl font-bold mb-4">Reflection Questions</h3>
          <ul className="list-disc ml-8 space-y-2">
            {questions.map((question, i) => (
              <motion.li 
                key={i} 
                className="text-base"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.6 + (i * 0.1) }}
              >
                {question}
              </motion.li>
            ))}
          </ul>
        </motion.div>
      )}
      
      {/* Challenge */}
      {challenge && (
        <motion.div 
          className="bg-green-50 p-6 rounded-lg shadow-inner"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4, delay: 0.7 }}
        >
          <h3 className="text-xl font-bold mb-2">{challenge.title}</h3>
          <p>{challenge.description}</p>
        </motion.div>
      )}
      
      {/* Next Lesson */}
      {nextLessonText && (
        <motion.div 
          className="bg-yellow-50 p-4 rounded-lg flex items-center justify-between shadow-inner"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <div className="font-bold text-yellow-800">Coming up next:</div>
          <div className="text-yellow-900">{nextLessonText}</div>
        </motion.div>
      )}
      
      {/* Additional content */}
      {children && (
        <motion.div 
          className="mt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.9 }}
        >
          {children}
        </motion.div>
      )}
      
      {/* Achievement badge */}
      <motion.div 
        className="flex flex-col items-center mt-4"
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ 
          type: "spring",
          stiffness: 260,
          damping: 20,
          delay: 1 
        }}
      >
        <div className="w-24 h-24 bg-gradient-to-br from-purple-400 to-indigo-600 rounded-full flex items-center justify-center shadow-lg">
          <span className="text-4xl">🏆</span>
        </div>
        <div className="mt-2 font-bold text-center text-indigo-700">Lesson Complete!</div>
      </motion.div>
    </div>
  );
};

export default WrapUp; 