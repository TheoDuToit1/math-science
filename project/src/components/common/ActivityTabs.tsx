import React from 'react';

interface ActivityTab {
  label: string;
  content: React.ReactNode;
}

interface ActivityTabsProps {
  tabs: ActivityTab[];
  currentTab: number;
  onTabChange: (index: number) => void;
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({ tabs, currentTab, onTabChange }) => {
  return (
    <div>
      <div className="flex gap-2 mb-4">
        {tabs.map((tab, i) => (
          <button
            key={tab.label}
            className={`px-4 py-2 rounded-t-lg font-semibold border-b-2 transition-colors ${
              currentTab === i
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-blue-100'
            }`}
            onClick={() => onTabChange(i)}
          >
            {tab.label}
          </button>
        ))}
      </div>
      <div className="bg-white rounded-b-lg shadow p-4 min-h-[180px]">
        {tabs[currentTab]?.content}
      </div>
    </div>
  );
};

export default ActivityTabs; 