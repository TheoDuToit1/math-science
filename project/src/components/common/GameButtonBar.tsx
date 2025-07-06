import React from 'react';
import { ArrowRight, RefreshCw, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameButtonBarProps {
  onNext?: () => void;
  onReset?: () => void;
  nextDisabled?: boolean;
  resetDisabled?: boolean;
  nextText?: string;
  resetText?: string;
  exitText?: string;
  exitPath?: string;
  position?: 'bottom' | 'top' | 'float';
}

const GameButtonBar: React.FC<GameButtonBarProps> = ({
  onNext,
  onReset,
  nextDisabled = false,
  resetDisabled = false,
  nextText = 'Next',
  resetText = 'Reset',
  exitText = 'Exit',
  exitPath = '/',
  position = 'bottom'
}) => {
  // Position styles
  const positionStyles = {
    bottom: 'mt-6',
    top: 'mb-6',
    float: 'fixed bottom-4 right-4 left-4 md:left-auto max-w-md shadow-xl backdrop-blur-sm bg-white bg-opacity-90 border border-gray-200 p-3 rounded-xl z-50'
  };
  
  const navigate = useNavigate();
  
  const handleExit = (e: React.MouseEvent) => {
    e.preventDefault();
    navigate(exitPath);
  };
  
  return (
    <div className={`${positionStyles[position]}`}>
      <div className="flex flex-wrap md:flex-nowrap gap-3 justify-between">
        <button 
          onClick={handleExit}
          className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center gap-2 justify-center w-full md:w-auto"
        >
          <Home size={18} />
          <span>{exitText}</span>
        </button>
        
        <div className="flex gap-3 w-full md:w-auto">
          {onReset && (
            <button
              onClick={onReset}
              disabled={resetDisabled}
              className={`
                px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg transition-colors flex items-center gap-2 justify-center flex-1
                ${resetDisabled ? 'opacity-50 cursor-not-allowed' : ''}
              `}
              aria-label="Reset game"
            >
              <RefreshCw size={18} />
              <span>{resetText}</span>
            </button>
          )}
          
          {onNext && (
            <button
              onClick={onNext}
              disabled={nextDisabled}
              className={`
                px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 text-white rounded-lg transition-colors flex items-center gap-2 justify-center flex-1
                ${nextDisabled ? 'opacity-50 cursor-not-allowed' : ''} 
              `}
              aria-label="Next step"
            >
              <span>{nextText}</span>
              <ArrowRight size={18} />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default GameButtonBar; 