import React, { useState, useEffect, useRef } from 'react';
import { Clock } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface TimerBarProps {
  duration: number; // in seconds
  onTimeEnd?: () => void;
  running?: boolean;
  showIcon?: boolean;
  showText?: boolean;
  warningThreshold?: number; // percentage (0-100) when timer should show warning color
  dangerThreshold?: number; // percentage (0-100) when timer should show danger color
  height?: string;
  showRemaining?: boolean; // show remaining time instead of elapsed
}

const TimerBar: React.FC<TimerBarProps> = ({
  duration,
  onTimeEnd,
  running = true,
  showIcon = true,
  showText = true,
  warningThreshold = 50,
  dangerThreshold = 25,
  height = 'h-2',
  showRemaining = true,
}) => {
  const [timeRemaining, setTimeRemaining] = useState(duration);
  const [percentage, setPercentage] = useState(100);
  const [isComplete, setIsComplete] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  useEffect(() => {
    // Reset timer if duration changes
    setTimeRemaining(duration);
    setPercentage(100);
    setIsComplete(false);
    
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
  }, [duration]);
  
  useEffect(() => {
    if (running && !isComplete) {
      timerRef.current = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Timer complete
            setIsComplete(true);
            if (onTimeEnd) onTimeEnd();
            clearInterval(timerRef.current as NodeJS.Timeout);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else if (!running && timerRef.current) {
      clearInterval(timerRef.current);
    }
    
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [running, isComplete, onTimeEnd]);
  
  useEffect(() => {
    // Update percentage
    const newPercentage = (timeRemaining / duration) * 100;
    setPercentage(newPercentage);
  }, [timeRemaining, duration]);
  
  // Format the time as mm:ss
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };
  
  // Determine the color based on the percentage
  const getColor = () => {
    if (percentage <= dangerThreshold) return 'bg-red-500';
    if (percentage <= warningThreshold) return 'bg-yellow-500';
    return 'bg-green-500';
  };
  
  // Determine the track color based on the current state
  const getTrackColor = () => {
    if (percentage <= dangerThreshold) return 'bg-red-100';
    if (percentage <= warningThreshold) return 'bg-yellow-100';
    return 'bg-green-100';
  };

  // Determine if we are in the last 3 seconds
  const isLastSeconds = timeRemaining <= 3 && timeRemaining > 0;

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-1">
        {showText && (
          <div className="text-sm font-medium text-gray-700 flex items-center">
            {showIcon && <Clock size={16} className="mr-1" />}
            {showRemaining ? formatTime(timeRemaining) : formatTime(duration - timeRemaining)}
          </div>
        )}
      </div>
      
      <div className={`w-full ${getTrackColor()} rounded-full ${height} overflow-hidden relative`}>
        <motion.div
          className={`absolute inset-0 pointer-events-none rounded-full ${height}`}
          initial={false}
          animate={
            percentage <= dangerThreshold
              ? { boxShadow: [
                  '0 0 0 0 #f87171',
                  '0 0 12px 6px #f87171',
                  '0 0 0 0 #f87171'
                ] }
              : { boxShadow: 'none' }
          }
          transition={{ duration: 1, repeat: Infinity, repeatType: 'loop' }}
        />
        <motion.div
          className={`${getColor()} rounded-full ${height} transition-all duration-1000 ease-linear`}
          style={{
            width: `${percentage}%`,
            background: percentage <= dangerThreshold
              ? 'linear-gradient(90deg, #f87171 0%, #fbbf24 100%)'
              : percentage <= warningThreshold
              ? 'linear-gradient(90deg, #fbbf24 0%, #34d399 100%)'
              : 'linear-gradient(90deg, #34d399 0%, #3b82f6 100%)',
            filter: percentage <= dangerThreshold ? 'drop-shadow(0 0 8px #f87171)' : 'none',
          }}
          animate={isLastSeconds ? { x: [0, -4, 4, -4, 4, 0] } : { x: 0 }}
          transition={{ duration: isLastSeconds ? 0.5 : 1, repeat: isLastSeconds ? Infinity : 0, repeatType: 'loop' }}
        />
      </div>
    </div>
  );
};

export default TimerBar; 