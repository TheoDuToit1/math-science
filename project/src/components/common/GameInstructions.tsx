import React from 'react';
import { Info } from 'lucide-react';

interface GameInstructionsProps {
  instructions: string;
  variant?: 'default' | 'success' | 'warning' | 'info';
  icon?: React.ReactNode;
  compact?: boolean;
}

const GameInstructions: React.FC<GameInstructionsProps> = ({
  instructions,
  variant = 'default',
  icon = <Info size={18} />,
  compact = false
}) => {
  const variantClasses = {
    default: 'bg-blue-50 border-blue-200 text-blue-800',
    success: 'bg-green-50 border-green-200 text-green-800',
    warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
    info: 'bg-indigo-50 border-indigo-200 text-indigo-800',
  };

  return (
    <div className={`${variantClasses[variant]} ${compact ? 'p-2' : 'p-3'} rounded-xl border-2 shadow-sm max-w-4xl mx-auto`}>
      <div className="flex items-center">
        <div className="flex-shrink-0 mr-2">
          {icon}
        </div>
        <p className={`${compact ? 'text-sm' : 'text-md'} font-medium`}>
          {instructions}
        </p>
      </div>
    </div>
  );
};

export default GameInstructions; 