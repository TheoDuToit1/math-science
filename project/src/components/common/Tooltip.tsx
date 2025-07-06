import React, { useState, useRef } from 'react';

interface TooltipProps {
  children: React.ReactNode;
  text: string;
  position?: 'top' | 'bottom' | 'left' | 'right';
  width?: 'auto' | 'sm' | 'md' | 'lg';
  theme?: 'dark' | 'light' | 'space';
  showOnClick?: boolean;
}

/**
 * Reusable Tooltip component that can be positioned in different directions
 * 
 * @param children - The element that triggers the tooltip
 * @param text - The content of the tooltip
 * @param position - Where the tooltip should appear relative to the children (default: 'top')
 * @param width - Width of the tooltip (default: 'md')
 * @param theme - Visual style of the tooltip (default: 'dark')
 * @param showOnClick - Whether the tooltip should also show on click (default: true)
 */
const Tooltip: React.FC<TooltipProps> = ({ 
  children, 
  text, 
  position = 'top', 
  width = 'md',
  theme = 'dark',
  showOnClick = true
}) => {
  const [isVisible, setIsVisible] = useState(false);
  const tooltipRef = useRef<HTMLDivElement>(null);
  
  // Width classes based on size prop
  const widthClasses = {
    auto: 'w-auto',
    sm: 'w-32',
    md: 'w-48',
    lg: 'w-64'
  };
  
  // Theme styles
  const themes = {
    dark: {
      bg: 'bg-black/80',
      text: 'text-white',
      arrow: 'bg-black/80'
    },
    light: {
      bg: 'bg-white/90',
      text: 'text-gray-800',
      arrow: 'bg-white/90'
    },
    space: {
      bg: 'bg-indigo-900/90 backdrop-blur-sm border border-indigo-500/30',
      text: 'text-white',
      arrow: 'bg-indigo-900/90'
    }
  };
  
  // Position styles
  const positions = {
    top: {
      tooltip: 'bottom-full left-1/2 -translate-x-1/2 mb-2',
      arrow: 'top-full left-1/2 -translate-x-1/2 -mt-1 rotate-45'
    },
    bottom: {
      tooltip: 'top-full left-1/2 -translate-x-1/2 mt-2',
      arrow: 'bottom-full left-1/2 -translate-x-1/2 mb-0 -rotate-135'
    },
    left: {
      tooltip: 'right-full top-1/2 -translate-y-1/2 mr-2',
      arrow: 'left-full top-1/2 -translate-y-1/2 -ml-1 rotate-[135deg]'
    },
    right: {
      tooltip: 'left-full top-1/2 -translate-y-1/2 ml-2',
      arrow: 'right-full top-1/2 -translate-y-1/2 mr-0 -rotate-45'
    }
  };
  
  const selectedTheme = themes[theme];
  const selectedPosition = positions[position];
  const selectedWidth = widthClasses[width];
  
  return (
    <div className="relative inline-block w-full h-full">
      <div
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onClick={() => showOnClick && setIsVisible(!isVisible)}
        className="w-full h-full cursor-help"
      >
        {children}
      </div>
      
      {isVisible && (
        <div 
          ref={tooltipRef}
          className={`absolute z-50 ${selectedTheme.bg} ${selectedTheme.text} text-xs rounded-md shadow-lg px-3 py-2 text-center ${selectedWidth} ${selectedPosition.tooltip}`}
        >
          {text}
          <div 
            className={`absolute w-3 h-3 ${selectedTheme.arrow} ${selectedPosition.arrow}`}
          />
        </div>
      )}
    </div>
  );
};

export default Tooltip; 