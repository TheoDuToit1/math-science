import React from 'react';

interface ProgressBarMainProps {
  current: number;
  total: number;
  color?: string; // Tailwind color class, e.g. 'bg-indigo-500'
  label?: string; // Optional label, e.g. 'questions complete'
}

const ProgressBarMain: React.FC<ProgressBarMainProps> = ({ current, total, color = 'bg-indigo-500', label = 'questions complete' }) => (
  <div className="w-full flex items-center mb-6">
    <div className="flex-1 h-3 bg-gray-200 rounded-full overflow-hidden mr-4">
      <div
        className={`h-3 ${color} rounded-full transition-all duration-500`}
        style={{ width: `${Math.round((current / total) * 100)}%` }}
      />
    </div>
    <div className="text-sm font-bold text-indigo-700">
      {current}/{total} {label}
    </div>
  </div>
);

export default ProgressBarMain; 