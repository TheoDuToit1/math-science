import React from 'react';

interface SectionWrapperProps {
  label: string;
  icon?: string;
  children: React.ReactNode;
}

const SectionWrapper: React.FC<SectionWrapperProps> = ({ label, icon, children }) => {
  return (
    <div className="bg-white rounded-2xl shadow-xl p-6 mb-8">
      <div className="flex items-center mb-4">
        {icon && <span className="text-3xl mr-3" aria-label="section icon">{icon}</span>}
        <h2 className="text-2xl font-bold text-indigo-800">{label}</h2>
      </div>
      <div>{children}</div>
    </div>
  );
};

export default SectionWrapper; 