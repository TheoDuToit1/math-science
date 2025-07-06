import React from 'react';
import { Home, HelpCircle, Volume2, VolumeX } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface GameHeaderProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
  backgroundColor?: string;
  onToggleSound?: () => void;
  isSoundOn?: boolean;
  onHelp?: () => void;
  subject?: 'math' | 'science';
}

const GameHeader: React.FC<GameHeaderProps> = ({
  title,
  subtitle,
  icon,
  backgroundColor = 'from-blue-600 via-indigo-600 to-purple-600',
  onToggleSound,
  isSoundOn = true,
  onHelp,
  subject
}) => {
  const navigate = useNavigate();
  
  const handleHomeClick = (e: React.MouseEvent) => {
    e.preventDefault();
    // Always navigate to the root path where the game cards are displayed
    navigate('/');
  };
  
  return (
    <div className={`bg-gradient-to-r ${backgroundColor} shadow-lg`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-3">
            {icon && (
              <div className="w-12 h-12 bg-white bg-opacity-20 backdrop-blur-sm rounded-xl flex items-center justify-center">
                {icon}
              </div>
            )}
            <div>
              <h1 className="text-2xl font-bold text-white">
                {title}
              </h1>
              {subtitle && (
                <p className="text-blue-100 text-sm">{subtitle}</p>
              )}
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {onToggleSound && (
              <button
                onClick={onToggleSound}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                aria-label={isSoundOn ? "Turn off sound" : "Turn on sound"}
              >
                {isSoundOn ? (
                  <Volume2 className="w-5 h-5 text-white" />
                ) : (
                  <VolumeX className="w-5 h-5 text-white" />
                )}
              </button>
            )}
            
            {onHelp && (
              <button
                onClick={onHelp}
                className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
                aria-label="Help"
              >
                <HelpCircle className="w-5 h-5 text-white" />
              </button>
            )}
            
            <button
              onClick={handleHomeClick}
              className="p-2 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg transition-all"
              aria-label="Return to home"
            >
              <Home className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GameHeader; 