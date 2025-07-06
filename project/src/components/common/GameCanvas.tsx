import React from 'react';

interface GameCanvasProps {
  children: React.ReactNode;
  backgroundColor?: string;
  borderColor?: string;
  rounded?: boolean;
  shadow?: boolean;
  padding?: 'none' | 'small' | 'medium' | 'large';
  height?: string;
  width?: string;
}

const GameCanvas: React.FC<GameCanvasProps> = ({
  children,
  backgroundColor = 'bg-white',
  borderColor = 'border-gray-200',
  rounded = true,
  shadow = true,
  padding = 'medium',
  height = 'min-h-[400px]',
  width = 'w-full max-w-4xl mx-auto'
}) => {
  const paddingClasses = {
    none: 'p-0',
    small: 'p-2 sm:p-3',
    medium: 'p-4 sm:p-6',
    large: 'p-6 sm:p-8'
  };
  
  return (
    <div 
      className={`
        ${backgroundColor} 
        ${borderColor} 
        ${rounded ? 'rounded-2xl' : ''} 
        ${shadow ? 'shadow-lg' : ''} 
        ${paddingClasses[padding]} 
        ${height} 
        ${width} 
        border-2
        transition-all
        duration-300
        relative
        overflow-hidden
      `}
    >
      <div className="w-full h-full">
        {children}
      </div>
    </div>
  );
};

export default GameCanvas; 