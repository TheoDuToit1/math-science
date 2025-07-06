import React from 'react';

interface SectionTitleBoxProps {
  title: string;
  icon?: string;
}

const SectionTitleBox: React.FC<SectionTitleBoxProps> = ({ title, icon }) => {
  return (
    <div className="flex items-center gap-2 mb-6">
      {icon && <span className="text-2xl">{icon}</span>}
      <h2 className="text-2xl font-bold text-indigo-700">{title}</h2>
    </div>
  );
};

export default SectionTitleBox; 