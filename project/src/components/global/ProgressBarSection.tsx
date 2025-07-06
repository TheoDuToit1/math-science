import React from 'react';

interface ProgressBarSectionProps {
  sectionLabels: string[];
  currentSection: number;
  onSectionChange?: (idx: number) => void;
}

const ProgressBarSection: React.FC<ProgressBarSectionProps> = ({ sectionLabels, currentSection, onSectionChange }) => (
  <div className="flex justify-center mb-4 space-x-2">
    {sectionLabels.map((label, idx) => (
      <button
        key={label}
        className={`px-4 py-2 rounded-lg font-bold text-sm transition-colors duration-200 ${idx === currentSection ? 'bg-indigo-600 text-white shadow' : 'bg-gray-200 text-gray-600'}`}
        onClick={() => onSectionChange && onSectionChange(idx)}
        disabled={!onSectionChange}
      >
        {label}
      </button>
    ))}
  </div>
);

export default ProgressBarSection; 