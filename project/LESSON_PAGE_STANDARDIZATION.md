# Lesson Page Standardization Guidelines

## Overview
This document outlines the standard structure for lesson pages in our application. All lesson pages should follow this structure to maintain consistency across the platform.

## Standard Structure (Based on S1RainbowMaker)

1. **Component Structure**
   - Each lesson page should be a standalone React component
   - Import necessary components from common/ and global/ folders
   - Use the standard section structure: Warm-Up, Introduction, Myth to Bust, Activities, Wrap-Up

2. **Required Imports**
   ```jsx
   import React, { useState, useEffect } from 'react';
   import SectionWrapper from '../../components/common/SectionWrapper';
   import { motion, AnimatePresence } from 'framer-motion';
   import SoundPlayer from '../../components/common/SoundPlayer';
   import { playSoundEffect } from '../../components/common/SoundPlayer';
   import ActivityTabs from '../../components/global/ActivityTabs';
   import ProgressBarQuestions from '../../components/global/ProgressBarQuestions';
   import ProgressBarSection from '../../components/global/ProgressBarSection';
   import ProgressBarMain from '../../components/global/ProgressBarMain';
   import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
   ```

3. **Standard State Variables**
   ```jsx
   const [section, setSection] = useState<number>(0);
   const [warmupIndex, setWarmupIndex] = useState<number>(0);
   const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
   const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
   const [questionsCompleted, setQuestionsCompleted] = useState(0);
   const [selectedOption, setSelectedOption] = useState<number | null>(null);
   const [showExplanation, setShowExplanation] = useState(false);
   const [activityIndex, setActivityIndex] = useState(0);
   const [activitiesCompleted, setActivitiesCompleted] = useState(0);
   ```

4. **Standard Section Structure**
   ```jsx
   const sections = [
     'Warm-Up',
     'Introduction',
     'Myth to Bust',
     'Activities',
     'Wrap-Up',
   ];
   ```

5. **Navigation Functions**
   ```jsx
   const nextSection = () => {
     if (section === 3) { // Activities
       if (activityIndex < activitySections.length - 1) {
         setActivityIndex(activityIndex + 1);
       } else {
         setSection(section + 1);
         setActivityIndex(0);
       }
     } else {
       setSection((s) => Math.min(s + 1, sections.length - 1));
     }
   };
   
   const prevSection = () => {
     if (section === 3 && activityIndex > 0) {
       setActivityIndex(activityIndex - 1);
     } else if (section === 3 && activityIndex === 0) {
       setSection(section - 1);
       setActivityIndex(activitySections.length - 1);
     } else {
       setSection((s) => Math.max(s - 1, 0));
     }
   };
   ```

6. **Component Return Structure**
   ```jsx
   return (
     <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-8">
       <div className="max-w-4xl mx-auto px-4">
         {/* Progress bars */}
         <ProgressBarSection 
           sectionLabels={sections}
           currentSection={section}
           onSectionChange={setSection}
         />
         
         <div className="my-4">
           <ProgressBarMain 
             current={questionsCompleted} 
             total={TOTAL_QUESTIONS} 
             color="bg-green-500" 
             label="questions" 
           />
         </div>
         
         {/* Main content */}
         <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
           {/* Section content based on current section */}
           {section === 0 && (
             <div>
               {/* Warm-Up content */}
             </div>
           )}
           
           {section === 1 && (
             <div>
               {/* Introduction content */}
             </div>
           )}
           
           {section === 2 && (
             <div>
               {/* Myth to Bust content */}
             </div>
           )}
           
           {section === 3 && (
             <div>
               {/* Activities content with tabs */}
               <ActivityTabs
                 tabs={activitySections.map((label, idx) => ({
                   label,
                   isCompleted: idx < activitiesCompleted
                 }))}
                 activeTab={activityIndex}
                 onTabChange={setActivityIndex}
               />
               
               {/* Activity content based on activityIndex */}
             </div>
           )}
           
           {section === 4 && (
             <div>
               {/* Wrap-Up content */}
               <WrapUp />
             </div>
           )}
         </div>
         
         {/* Navigation buttons */}
         <div className="flex justify-between">
           <button
             onClick={prevSection}
             className="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
             disabled={section === 0 && activityIndex === 0}
           >
             Back
           </button>
           
           <button
             onClick={nextSection}
             className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
             disabled={section === sections.length - 1}
           >
             Next
           </button>
         </div>
       </div>
     </div>
   );
   ```

## Implementation Notes

1. Each lesson should define its own:
   - Warm-up questions
   - Introduction videos/content
   - Myth busting content
   - Activities (with their own state and handlers)
   - Wrap-up content

2. Use the global components whenever possible:
   - `QuizQuestions` for warm-up section
   - `MythBuster` for myth section
   - `ActivityTabs` for activities section
   - `WrapUp` for wrap-up section

3. Avoid duplicating functionality across lessons. If you need a feature that exists in another lesson, extract it to a common component.

4. Follow the S1RainbowMaker structure as the gold standard for all lesson pages. 