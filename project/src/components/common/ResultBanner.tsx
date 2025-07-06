import React, { useEffect, useState } from 'react';
import { CheckCircle, AlertTriangle, Zap, Star, Award, Trophy, Medal, Crown, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface ResultBannerProps {
  type: 'success' | 'failure' | 'partial';
  title: string;
  message: string;
  score?: number;
  maxScore?: number;
  metrics?: {
    label: string;
    value: string | number;
    icon?: React.ReactNode;
  }[];
  onButtonClick?: () => void;
  buttonText?: string;
  onRetry?: () => void;
  animate?: boolean;
}

// Achievement badge component
const AchievementBadge: React.FC<{ icon: React.ReactNode; label: string; delay: number }> = ({ 
  icon, 
  label,
  delay 
}) => {
  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay 
      }}
      className="flex flex-col items-center"
    >
      <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center shadow-lg mb-2">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center">
          {icon}
        </div>
      </div>
      <span className="text-white text-xs font-medium text-center">{label}</span>
    </motion.div>
  );
};

// Animated star component
const AnimatedStar: React.FC<{ delay: number; size: number; top: string; left: string }> = ({ 
  delay, 
  size, 
  top, 
  left 
}) => {
  return (
    <motion.div
      className="absolute"
      style={{ top, left }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: [0, 1.2, 1], 
        opacity: [0, 1, 0.8],
        rotate: [0, 45, 0]
      }}
      transition={{ 
        duration: 1.5, 
        delay, 
        repeat: Infinity, 
        repeatType: "reverse" 
      }}
    >
      <Star size={size} className="text-yellow-300 fill-yellow-300" />
    </motion.div>
  );
};

const ResultBanner: React.FC<ResultBannerProps> = ({
  type,
  title: providedTitle,
  message: providedMessage,
  score,
  maxScore = 100,
  metrics = [],
  onButtonClick,
  buttonText = 'Continue',
  onRetry,
  animate = true
}) => {
  const [showStars, setShowStars] = useState(false);
  const [title, setTitle] = useState(providedTitle);
  const [message, setMessage] = useState(providedMessage);
  
  // Determine title and message based on score
  useEffect(() => {
    if (score !== undefined) {
      if (score === 100) {
        setTitle("Perfect Score!");
        setMessage("Wow! You got everything right. Amazing job!");
      } else if (score >= 80) {
        setTitle("Awesome Work!");
        setMessage("Great job! You've completed this activity with a high score!");
      } else if (score >= 60) {
        setTitle("Good Job!");
        setMessage("You've completed this activity successfully!");
      } else if (score >= 40) {
        setTitle("Nice Try!");
        setMessage("You've completed this activity. Keep practicing to improve your score!");
      } else {
        setTitle("Activity Completed");
        setMessage("You've finished the activity. Let's practice more to improve your understanding!");
      }
    } else {
      setTitle(providedTitle);
      setMessage(providedMessage);
    }
  }, [score, providedTitle, providedMessage]);
  
  useEffect(() => {
    // Only show animated elements after a short delay
    if (type === 'success') {
      const timer = setTimeout(() => {
        setShowStars(true);
      }, 300);
      
      return () => clearTimeout(timer);
    }
  }, [type]);

  // Configure styles based on type
  const bannerStyles = {
    success: 'bg-gradient-to-r from-green-500 to-emerald-600 border-green-600',
    failure: 'bg-gradient-to-r from-red-500 to-rose-600 border-red-600',
    partial: 'bg-gradient-to-r from-yellow-500 to-amber-600 border-yellow-600'
  };

  const iconMap = {
    success: <Trophy size={64} className="text-white" />,
    failure: <AlertTriangle size={64} className="text-white opacity-90" />,
    partial: <Star size={64} className="text-white opacity-90" />
  };
  
  // Achievement badges for success state
  const getAchievementBadges = () => {
    if (score === undefined) {
      return [
        { icon: <Trophy size={24} className="text-white" />, label: "Completed!", delay: 0.2 },
        { icon: <Star size={24} className="text-white" />, label: "Star Student", delay: 0.4 },
        { icon: <Medal size={24} className="text-white" />, label: "Great Effort", delay: 0.6 },
        { icon: <Sparkles size={24} className="text-white" />, label: "Super Smart", delay: 0.8 }
      ];
    }
    
    if (score >= 90) {
      return [
        { icon: <Trophy size={24} className="text-white" />, label: "Champion!", delay: 0.2 },
        { icon: <Crown size={24} className="text-white" />, label: "Perfect Score", delay: 0.4 },
        { icon: <Medal size={24} className="text-white" />, label: "Top Student", delay: 0.6 },
        { icon: <Sparkles size={24} className="text-white" />, label: "Brilliant Mind", delay: 0.8 }
      ];
    } else if (score >= 70) {
      return [
        { icon: <Trophy size={24} className="text-white" />, label: "Great Work!", delay: 0.2 },
        { icon: <Star size={24} className="text-white" />, label: "Star Student", delay: 0.4 },
        { icon: <Medal size={24} className="text-white" />, label: "High Score", delay: 0.6 },
        { icon: <Sparkles size={24} className="text-white" />, label: "Smart Thinker", delay: 0.8 }
      ];
    } else if (score >= 50) {
      return [
        { icon: <Medal size={24} className="text-white" />, label: "Good Job!", delay: 0.2 },
        { icon: <Star size={24} className="text-white" />, label: "Nice Effort", delay: 0.4 },
        { icon: <Trophy size={24} className="text-white" />, label: "Completed", delay: 0.6 },
        { icon: <Sparkles size={24} className="text-white" />, label: "Keep Going", delay: 0.8 }
      ];
    } else {
      return [
        { icon: <Star size={24} className="text-white" />, label: "Completed!", delay: 0.2 },
        { icon: <Medal size={24} className="text-white" />, label: "Nice Try", delay: 0.4 },
        { icon: <Trophy size={24} className="text-white" />, label: "Keep Learning", delay: 0.6 },
        { icon: <Sparkles size={24} className="text-white" />, label: "Practice More", delay: 0.8 }
      ];
    }
  };
  
  const achievementBadges = getAchievementBadges();

  return (
    <div 
      className={`
        ${bannerStyles[type]} 
        rounded-2xl 
        shadow-lg 
        border-b-4 
        overflow-hidden
        ${animate ? 'animate-banner-appear' : ''}
        relative
      `}
    >
      {/* Decorative elements for success state */}
      {type === 'success' && showStars && (
        <>
          <AnimatedStar delay={0.1} size={24} top="10%" left="5%" />
          <AnimatedStar delay={0.3} size={20} top="15%" left="90%" />
          <AnimatedStar delay={0.5} size={16} top="80%" left="8%" />
          <AnimatedStar delay={0.7} size={22} top="75%" left="92%" />
          <AnimatedStar delay={0.9} size={18} top="40%" left="95%" />
        </>
      )}
      
      <div className="p-6 md:p-8">
        {/* Main content */}
        <div className="flex flex-col items-center gap-4 md:gap-6">
          {/* Animated icon */}
          <motion.div 
            className="flex-shrink-0"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", stiffness: 260, damping: 20 }}
          >
            <div className="relative">
            {iconMap[type]}
              {type === 'success' && (
                <motion.div 
                  className="absolute inset-0"
                  animate={{ 
                    scale: [1, 1.2, 1],
                    opacity: [0.5, 0.8, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  <div className="w-full h-full rounded-full bg-white opacity-50 blur-md" />
                </motion.div>
              )}
          </div>
          </motion.div>
          
          <div className="flex-1 text-center">
            <motion.h2 
              className="text-white text-3xl md:text-4xl font-bold"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.1 }}
            >
              {title}
            </motion.h2>
            
            <motion.p 
              className="text-white text-opacity-90 mt-2 mb-4 text-lg"
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              {message}
            </motion.p>
            
            {/* Score display */}
            {score !== undefined && (
              <motion.div 
                className="bg-white bg-opacity-20 rounded-xl p-4 backdrop-blur-sm w-full max-w-md mx-auto mt-4"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <div className="flex justify-between items-center">
                  <span className="text-white font-medium text-lg">Score:</span>
                  <motion.span 
                    className="text-white font-bold text-3xl"
                    initial={{ scale: 0.5 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4, type: "spring" }}
                  >
                    {score} <span className="text-lg opacity-75">/ {maxScore}</span>
                  </motion.span>
                </div>
                
                <div className="mt-3 bg-white bg-opacity-20 h-3 rounded-full overflow-hidden">
                  <motion.div 
                    className="h-full bg-white rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: `${(score / maxScore) * 100}%` }}
                    transition={{ delay: 0.5, duration: 1 }}
                  ></motion.div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
        
        {/* Achievement badges for success state */}
        {type === 'success' && (
          <div className="flex justify-center gap-6 mt-8">
            {achievementBadges.map((badge, index) => (
              <AchievementBadge 
                key={index}
                icon={badge.icon}
                label={badge.label}
                delay={badge.delay}
              />
            ))}
          </div>
        )}
        
        {/* Additional metrics */}
        {metrics.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
            {metrics.map((metric, index) => (
              <motion.div 
                key={index}
                className="bg-white bg-opacity-20 rounded-lg p-3 backdrop-blur-sm flex items-center gap-3"
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.3 + (index * 0.1) }}
              >
                {metric.icon || <Zap size={18} className="text-white" />}
                <div>
                  <div className="text-white text-opacity-75 text-sm">{metric.label}</div>
                  <div className="text-white font-bold">{metric.value}</div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
        
        {/* Action button */}
        {(onButtonClick || onRetry) && (
          <div className="mt-8 flex justify-center gap-4">
            {onRetry && (
              <motion.button
                onClick={onRetry}
                className="bg-white bg-opacity-20 backdrop-blur-sm px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 text-white border border-white border-opacity-30"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
              >
                Try Again
              </motion.button>
            )}
        {onButtonClick && (
              <motion.button
              onClick={onButtonClick}
                className="bg-white px-8 py-4 rounded-xl text-xl font-bold shadow-lg hover:shadow-xl transform transition-all duration-200 hover:scale-105 text-emerald-600"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, type: "spring" }}
            >
              {buttonText}
              </motion.button>
            )}
          </div>
        )}
      </div>
      
      <style jsx>{`
        @keyframes banner-appear {
          0% { opacity: 0; transform: translateY(20px); }
          100% { opacity: 1; transform: translateY(0); }
        }
        .animate-banner-appear {
          animation: banner-appear 0.5s forwards;
        }
      `}</style>
    </div>
  );
};

export default ResultBanner; 