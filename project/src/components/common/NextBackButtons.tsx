import React from 'react';

interface NextBackButtonsProps {
  onNext?: () => void;
  onBack?: () => void;
  nextText?: string;
  backText?: string;
  nextDisabled?: boolean;
  backDisabled?: boolean;
  showNext?: boolean;
  showBack?: boolean;
}

const NextBackButtons: React.FC<NextBackButtonsProps> = ({
  onNext,
  onBack,
  nextText = 'Next',
  backText = 'Back',
  nextDisabled = false,
  backDisabled = false,
  showNext = true,
  showBack = true,
}) => {
  return (
    <div className="flex gap-4 mt-6 justify-between w-full">
      {onBack && showBack ? (
        <button
          className={`px-4 py-2 rounded font-bold ${
            backDisabled ? 'bg-gray-200 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
          }`}
          onClick={onBack}
          disabled={backDisabled}
        >
          ← {backText}
        </button>
      ) : (
        <div></div> // Empty div to maintain flex layout
      )}
      
      {onNext && showNext ? (
        <button
          className={`px-4 py-2 rounded font-bold ${
            nextDisabled ? 'bg-indigo-300 text-white cursor-not-allowed' : 'bg-indigo-500 text-white hover:bg-indigo-600'
          }`}
          onClick={onNext}
          disabled={nextDisabled}
        >
          {nextText} →
        </button>
      ) : (
        <div></div> // Empty div to maintain flex layout
      )}
    </div>
  );
};

export default NextBackButtons; 