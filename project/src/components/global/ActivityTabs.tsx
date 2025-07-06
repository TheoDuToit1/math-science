import React from 'react';
import { motion } from 'framer-motion';

interface ActivityTab {
  label: string;
  content: React.ReactNode;
  isCompleted?: boolean;
}

interface ActivityTabsProps {
  tabs: ActivityTab[];
  activeTab: number;
  onTabChange: (index: number) => void;
}

const ActivityTabs: React.FC<ActivityTabsProps> = ({ tabs, activeTab, onTabChange }) => {
  return (
    <div className="mb-6">
      <div className="flex flex-wrap gap-2 mb-4">
        {tabs.map((tab, i) => (
          <motion.button
            key={tab.label}
            className={`
              px-4 py-2 rounded-lg font-semibold border-b-2 transition-colors
              flex items-center gap-2
              ${activeTab === i
                ? 'bg-blue-500 text-white border-blue-600'
                : 'bg-gray-100 text-gray-700 border-transparent hover:bg-blue-100'}
              ${tab.isCompleted ? 'ring-2 ring-green-400 ring-offset-1' : ''}
            `}
            onClick={() => onTabChange(i)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <span>{tab.label}</span>
            {tab.isCompleted && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="text-green-500 bg-white rounded-full w-5 h-5 flex items-center justify-center text-xs"
              >
                ✓
              </motion.span>
            )}
          </motion.button>
        ))}
      </div>
      <motion.div 
        className="bg-white rounded-lg shadow-lg p-6 min-h-[400px]"
        key={activeTab}
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        transition={{ duration: 0.3 }}
      >
        {tabs[activeTab]?.content}
      </motion.div>
    </div>
  );
};

export default ActivityTabs; 