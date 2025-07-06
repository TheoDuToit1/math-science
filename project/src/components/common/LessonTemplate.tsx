import React, { ReactNode, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from './SectionWrapper';
import ProgressBarSection from '../global/ProgressBarSection';
import ProgressBarMain from '../global/ProgressBarMain';
import ActivityTabs from '../global/ActivityTabs';

interface LessonTemplateProps {
  // Section content
  warmUpContent: ReactNode;
  introductionContent: ReactNode;
  mythContent: ReactNode;
  activitiesContent: {
    tabs: Array<{
      label: string;
      content: ReactNode;
      isCompleted?: boolean;
    }>;
  };
  wrapUpContent: ReactNode;
  
  // Section labels and progress
  sectionLabels: string[];
  questionsCompleted?: number;
  totalQuestions?: number;
  sectionsCompleted?: number[];
  
  // Navigation
  onNext: () => void;
  onBack: () => void;
  
  // Activities
  activityIndex: number;
  setActivityIndex: (index: number) => void;
  totalActivities: number;
}

const LessonTemplate: React.FC<LessonTemplateProps> = ({
  warmUpContent,
  introductionContent,
  mythContent,
  activitiesContent,
  wrapUpContent,
  sectionLabels,
  questionsCompleted = 0,
  totalQuestions = 4,
  sectionsCompleted = [],
  onNext,
  onBack,
  activityIndex,
  setActivityIndex,
  totalActivities
}) => {
  const [section, setSection] = useState(0);

  // Handle section change
  const handleSectionChange = (idx: number) => {
    setSection(idx);
    setActivityIndex(0);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Section navigation */}
        <div className="mb-4">
          <ProgressBarSection 
            sectionLabels={sectionLabels} 
            currentSection={section}
            onSectionChange={handleSectionChange}
          />
        </div>
        
        {/* Main progress bar */}
        <div className="mb-6">
          <ProgressBarMain 
            current={sectionsCompleted.length} 
            total={sectionLabels.length}
            color="bg-indigo-500"
            label="sections completed"
          />
        </div>

        {/* Show activities progress bar only in Activities section */}
        {section === 3 && (
          <div className="mb-4">
            <ProgressBarMain 
              current={activityIndex + 1} 
              total={totalActivities} 
              color="bg-blue-400" 
              label="activities" 
            />
          </div>
        )}

        {/* Main content */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <AnimatePresence mode="wait">
            {section === 0 && (
              <SectionWrapper key="warmup" label="Warm-Up Quiz" icon="🔥">
                {warmUpContent}
              </SectionWrapper>
            )}

            {section === 1 && (
              <SectionWrapper key="intro" label="Introduction" icon="🎬">
                {introductionContent}
              </SectionWrapper>
            )}

            {section === 2 && (
              <SectionWrapper key="myth" label="Myth to Bust" icon="🔍">
                {mythContent}
              </SectionWrapper>
            )}

            {section === 3 && (
              <SectionWrapper key="activities" label="Activities" icon="🧩">
                <ActivityTabs
                  tabs={activitiesContent.tabs}
                  activeTab={activityIndex}
                  onTabChange={setActivityIndex}
                />
              </SectionWrapper>
            )}

            {section === 4 && (
              <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
                {wrapUpContent}
              </SectionWrapper>
            )}
          </AnimatePresence>
        </div>
        
        {/* Navigation buttons - consistent positioning and styling */}
        <div className="flex justify-between">
          <button
            onClick={onBack}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg font-medium"
            disabled={section === 0}
          >
            Back
          </button>
          
          <button
            onClick={onNext}
            className="px-4 py-2 bg-blue-500 text-white rounded-lg font-medium"
            disabled={section === sectionLabels.length - 1}
          >
            Next
          </button>
        </div>
      </div>
    </div>
  );
};

export default LessonTemplate; 