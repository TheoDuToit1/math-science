import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/common/SectionWrapper';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import VideoEmbed from '../../components/common/VideoEmbed';
import CodeTheGrid from '../../components/games/math/CodeTheGrid';
import PatternBreaker from '../../components/games/math/PatternBreaker';
import ObstacleMap from '../../components/games/math/ObstacleMap';
import SoundPlayer from '../../components/common/SoundPlayer';
import { playSoundEffect } from '../../components/common/SoundPlayer';
import ProgressBarQuestions from '../../components/global/ProgressBarQuestions';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What do we call a step-by-step instruction?',
    options: [
      { text: 'Dance', explanation: 'A dance has steps, but it\'s not the term for step-by-step instructions in computing.' },
      { text: 'Plan', explanation: 'A plan can include steps, but it\'s not the specific term used in computing.' },
      { text: 'Algorithm', explanation: 'Correct! An algorithm is a step-by-step procedure for solving a problem or accomplishing a task.' },
      { text: 'Magic', explanation: 'While coding might seem magical, it follows logical steps, not magic.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which way is LEFT?',
    options: [
      { text: '🡺', explanation: 'This arrow points right, not left.' },
      { text: '🡸', explanation: 'Correct! This arrow points left.' },
      { text: '🡹', explanation: 'This arrow points up, not left.' },
      { text: '🡻', explanation: 'This arrow points down, not left.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What\'s the next pattern? 🔺🔺🔵🔺🔺🔵...',
    options: [
      { text: '🔵', explanation: 'Correct! The pattern is two triangles followed by a circle, repeating.' },
      { text: '🔺', explanation: 'If we follow the pattern of two triangles and one circle, the next shape would be a circle, not a triangle.' },
      { text: '⚫', explanation: 'The pattern uses blue circles, not black circles.' },
      { text: '❌', explanation: 'An X is not part of the established pattern.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What happens if one step in a code is wrong?',
    options: [
      { text: 'It still works', explanation: 'Code requires precise instructions. One wrong step can cause problems.' },
      { text: 'Nothing changes', explanation: 'A wrong step in code will affect the outcome.' },
      { text: 'It breaks', explanation: 'Correct! When code has an error, it often doesn\'t work as expected or breaks completely.' },
      { text: 'It goes faster', explanation: 'Errors in code don\'t make it run faster; they cause problems.' },
    ],
    correct: 2,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'Introduction to Grids',
    url: 'https://www.youtube.com/embed/VCT2X_6bTDQ',
    thumbnail: '/images/math/m3_code_grid/grid_intro_thumbnail.jpg',
  },
  {
    title: 'Human Coding Grid',
    url: 'https://www.youtube.com/embed/IfHmHZPxuV8',
    thumbnail: '/images/math/m3_code_grid/human_coding_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'Introducing Kids to Coding',
    url: 'https://www.youtube.com/embed/nwMeINjRl6Y',
    thumbnail: '/images/math/m3_code_grid/kids_coding_thumbnail.jpg',
  }
];

// Section labels
const sections = [
  'Warm-Up',
  'Introduction',
  'Myth to Bust',
  'Activities',
  'Wrap-Up',
];

const sectionToStage: Record<string, 'warmup' | 'intro' | 'activity' | 'exit'> = {
  'Warm-Up': 'warmup',
  'Introduction': 'intro',
  'Myth to Bust': 'activity',
  'Activities': 'activity',
  'Wrap-Up': 'activity',
  'Exit': 'exit',
};

const sectionLabels = sections;
const TOTAL_QUESTIONS = warmupQuestions.length;
const TOTAL_ACTIVITIES = 3;

const M3_CodeGrid: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
  const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activityTab, setActivityTab] = useState(0);

  const nextSection = () => {
    setSection((s) => Math.min(s + 1, sections.length - 1));
    setWarmupIndex(0);
    setWarmupAnswered(false);
    setWarmupCorrect(false);
  };
  
  const prevSection = () => setSection((s) => Math.max(s - 1, 0));

  // Custom MCQ for warmup
  const warmupQ = warmupQuestions[warmupIndex];
  const handleWarmupAnswer = (idx: number) => {
    if (warmupAnswered || showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    setWarmupAnswered(true);
    if (idx === warmupQ.correct) {
      setWarmupCorrect(true);
    } else {
      setWarmupCorrect(false);
    }
  };

  // Add a handler for dismissing the explanation
  const handleDismissExplanation = () => {
    setShowExplanation(false);
    setWarmupAnswered(false);
    setSelectedOption(null);
    if (warmupCorrect) {
      setQuestionsCompleted((prev) => prev + 1);
      setTimeout(() => {
        if (warmupIndex === warmupQuestions.length - 1) {
          nextSection();
        } else {
          setWarmupIndex(warmupIndex + 1);
          setWarmupCorrect(false);
        }
      }, 300);
    }
  };

  // Activity tabs
  const activityTabs = [
    {
      label: 'Code the Grid',
      content: (
        <SectionWrapper key="codethegrid" label="Code the Grid" icon="🧩">
          <CodeTheGrid />
        </SectionWrapper>
      )
    },
    {
      label: 'Pattern Breaker',
      content: (
        <SectionWrapper key="patternbreaker" label="Pattern Breaker" icon="🔍">
          <PatternBreaker />
        </SectionWrapper>
      )
    },
    {
      label: 'Obstacle Map',
      content: (
        <SectionWrapper key="obstaclemap" label="Obstacle Map" icon="🗺️">
          <ObstacleMap />
        </SectionWrapper>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-2 sm:px-6">
        <ProgressBarSection sectionLabels={sectionLabels} currentSection={section} />
        {/* Only show the quiz progress bar in the Warm-Up section */}
        {sectionLabels[section] === 'Warm-Up' && (
          <ProgressBarMain current={questionsCompleted} total={TOTAL_QUESTIONS} color="bg-indigo-500" label="questions complete" />
        )}
        {/* Show activities progress bar only in Activities section */}
        {sectionLabels[section] === 'Activities' && (
          <ProgressBarMain current={activityTab + 1} total={TOTAL_ACTIVITIES} color="bg-blue-400" label="activities" />
        )}
        <AnimatePresence mode="wait">
          {section === 0 && (
            <SectionWrapper key="warmup" label="Warm-Up Quiz" icon="🔥">
              <QuizQuestions questions={warmupQuestions} onComplete={nextSection} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <div className="text-2xl font-bold mb-6 text-center">Code Grid: Pattern Breaker</div>
                
                {/* Story scene */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6 w-full">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">A robot is lost in a grid...</div>
                      <div className="text-gray-600">
                        "Beep boop! I need help to find my way!"
                      </div>
                    </div>
                    <div className="text-5xl">🤖</div>
                    <div className="bg-green-100 rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">Can you guide the robot?</div>
                      <div className="text-green-700 font-medium">
                        "Give the robot the right steps to reach the goal!"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Instruction demonstration */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6 w-full">
                  <div className="text-center text-xl mb-4 font-bold">Robot Commands</div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡺</div>
                      <div className="font-medium">Turn Right</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡸</div>
                      <div className="font-medium">Turn Left</div>
                    </div>
                    <div className="bg-white p-4 rounded-lg shadow-sm flex flex-col items-center">
                      <div className="text-4xl mb-2">🡹</div>
                      <div className="font-medium">Move Forward</div>
                    </div>
                  </div>
                </div>

                {/* Video placeholders */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                  {introVideos.map((video, index) => (
                    <div key={index} className="bg-gray-100 rounded-lg p-4 flex flex-col items-center">
                      <VideoEmbed 
                        title={video.title}
                        url={video.url}
                        thumbnail={video.thumbnail}
                      />
                      <div className="text-sm font-medium mt-2">{video.title}</div>
                    </div>
                  ))}
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Coding is only for computers!"
                truth="Coding is just giving clear instructions - like telling someone how to make a sandwich!"
                videos={mythVideos}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <ActivityTabs tabs={activityTabs} activeTab={activityTab} onTabChange={setActivityTab} />
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
              <WrapUp
                title="Code Grid Master"
                summary="You've learned how algorithms are step-by-step instructions that help us solve problems!"
                keyPoints={[
                  "Coding is about giving clear step-by-step instructions",
                  "Algorithms help us solve problems in a logical way",
                  "Patterns can help us predict what comes next",
                  "Even simple commands can create complex movements"
                ]}
                questions={[
                  "What is an algorithm you use in your real life?",
                  "Why does a robot need clear steps?",
                  "How could you use coding ideas in other subjects?"
                ]}
                nextLessonText="Next up: Pizza Fractions!"
              />
            </SectionWrapper>
          )}
        </AnimatePresence>
        <div className="flex gap-4 mt-8">
          {section > 0 && (
            <button className="px-4 py-2 bg-gray-200 rounded font-bold" onClick={prevSection}>Back</button>
          )}
          {section < sections.length - 1 && (
            <button className="px-4 py-2 bg-indigo-500 text-white rounded font-bold" onClick={nextSection}>Next</button>
          )}
        </div>
      </div>
      {fullscreenImage && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-80">
          <button
            className="absolute top-6 right-8 text-white text-4xl font-bold hover:text-red-400 focus:outline-none"
            onClick={() => setFullscreenImage(null)}
            aria-label="Close fullscreen image"
          >
            ×
          </button>
          <img src={fullscreenImage} alt="Enlarged" className="w-[90vw] h-[90vh] max-w-[98vw] max-h-[98vh] object-contain rounded shadow-lg" />
        </div>
      )}
    </div>
  );
};

export default M3_CodeGrid; 