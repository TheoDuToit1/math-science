import React from 'react';
import { X } from 'lucide-react';

interface GameIntroModalProps {
  title: string;
  description: string;
  icon?: React.ReactNode;
  onStart: () => void;
  isOpen: boolean;
}

const GameIntroModal: React.FC<GameIntroModalProps> = ({
  title,
  description,
  icon,
  onStart,
  isOpen
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div 
        className="bg-white rounded-2xl shadow-xl w-full transform transition-all duration-300 scale-100 overflow-hidden"
        style={{ 
          animation: 'pop-in 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards'
        }}
      >
        {/* Header with gradient background */}
        <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-6 relative">
          <h2 className="text-3xl font-bold text-white text-center">{title}</h2>
          <button 
            onClick={onStart}
            className="absolute top-4 right-4 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={24} />
          </button>
        </div>
          
        {/* Content */}
        <div className="p-8">
          <p className="text-gray-700 text-lg mb-8 leading-relaxed">{description}</p>
          
          <button
            onClick={onStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-6 py-4 rounded-xl text-lg font-bold shadow-md hover:shadow-lg transform transition-all duration-200 hover:-translate-y-1 flex items-center justify-center gap-2"
          >
            <span>Start Activity</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes pop-in {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
      `}</style>
    </div>
  );
};

// New modal component specifically for game activities, designed to match the screenshot
export const GameActivityModal: React.FC<GameIntroModalProps> = ({
  title,
  description,
  onStart,
  isOpen
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className="bg-white rounded-lg shadow-xl w-full transform transition-all duration-300"
      >
        {/* Header with blue-to-pink gradient */}
        <div className="bg-gradient-to-r from-blue-500 to-pink-500 p-4 rounded-t-lg relative">
          <h2 className="text-2xl font-bold text-white text-center">{title}</h2>
          <button 
            onClick={onStart}
            className="absolute top-3 right-3 text-white hover:text-gray-200 transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>
          
        {/* Content */}
        <div className="p-6">
          <p className="text-gray-700 mb-6">{description}</p>
          
          <button
            onClick={onStart}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white px-5 py-3 rounded-lg text-lg font-semibold flex items-center justify-center gap-2"
          >
            <span>Start Activity</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default GameIntroModal; 