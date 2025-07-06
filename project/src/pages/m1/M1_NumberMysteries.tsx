import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/common/SectionWrapper';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import PlaceValueBuilder from '../../components/games/math/PlaceValueBuilder';
import ZeroPowerGame from '../../components/games/math/ZeroPowerGame';
import RocketBuilderChallenge from '../../components/games/math/RocketBuilderChallenge';
import VideoEmbed from '../../components/common/VideoEmbed';
import SoundPlayer, { playSoundEffect } from '../../components/common/SoundPlayer';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What number comes after 49?',
    options: [
      { text: '50', explanation: 'Correct! After 49 comes 50.' },
      { text: '40', explanation: '40 is less than 49.' },
      { text: '59', explanation: '59 is 10 more than 49.' },
      { text: '60', explanation: '60 is more than 10 after 49.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the value of the 7 in seventy-three (73)?',
    options: [
      { text: '7 ones', explanation: 'The 7 is in the tens place, not the ones place.' },
      { text: '7 hundreds', explanation: 'The 7 is not in the hundreds place.' },
      { text: '7 tens', explanation: 'Correct! The 7 in 73 represents 7 tens or 70.' },
      { text: '7 thousands', explanation: 'The 7 is not in the thousands place.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which number has a 0 in the tens place?',
    options: [
      { text: '139', explanation: '139 does not have a 0 in the tens place.' },
      { text: '130', explanation: '130 has a 3 in the tens place.' },
      { text: '310', explanation: '310 has a 1 in the tens place.' },
      { text: '301', explanation: 'Correct! 301 has a 0 in the tens place.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'Which number is the greatest?',
    options: [
      { text: '305', explanation: '305 is not the greatest number in this list.' },
      { text: '530', explanation: 'Correct! 530 is the greatest number here.' },
      { text: '503', explanation: '503 is not the greatest number in this list.' },
      { text: '350', explanation: '350 is not the greatest number in this list.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is the smallest 3-digit number?',
    options: [
      { text: '100', explanation: 'Correct! 100 is the smallest 3-digit number.' },
      { text: '101', explanation: '101 is a 3-digit number, but not the smallest.' },
      { text: '99', explanation: '99 is a 2-digit number.' },
      { text: '111', explanation: '111 is a 3-digit number, but not the smallest.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which number is even?',
    options: [
      { text: '37', explanation: '37 is odd.' },
      { text: '42', explanation: 'Correct! 42 is even.' },
      { text: '55', explanation: '55 is odd.' },
      { text: '73', explanation: '73 is odd.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is 10 more than 68?',
    options: [
      { text: '78', explanation: 'Correct! 68 + 10 = 78.' },
      { text: '58', explanation: '58 is 10 less than 68.' },
      { text: '80', explanation: '80 is 12 more than 68.' },
      { text: '70', explanation: '70 is 2 more than 68.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which number is missing: 45, 46, __, 48?',
    options: [
      { text: '47', explanation: 'Correct! 45, 46, 47, 48.' },
      { text: '49', explanation: '49 comes after 48.' },
      { text: '44', explanation: '44 comes before 45.' },
      { text: '50', explanation: '50 comes after 49.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the value of the 2 in 245?',
    options: [
      { text: '2 ones', explanation: 'The 2 is in the hundreds place.' },
      { text: '2 tens', explanation: 'The 2 is in the hundreds place.' },
      { text: '2 hundreds', explanation: 'Correct! 2 hundreds = 200.' },
      { text: '20', explanation: '20 is two tens.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which number is odd?',
    options: [
      { text: '24', explanation: '24 is even.' },
      { text: '36', explanation: '36 is even.' },
      { text: '51', explanation: 'Correct! 51 is odd.' },
      { text: '60', explanation: '60 is even.' },
    ],
    correct: 2,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'Place Value for Kids',
    url: 'https://www.youtube.com/embed/Ju3kQjmcH5g',
    thumbnail: '/images/math/m1_zero_power/place_value_thumbnail.jpg',
  },
  {
    title: 'Math Antics - Place Value',
    url: 'https://www.youtube.com/embed/T5Qf0qSSJFI',
    thumbnail: '/images/math/m1_zero_power/math_antics_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'The Power of Zero',
    url: 'https://www.youtube.com/embed/7vYs6_syj-c',
    thumbnail: '/images/math/m1_zero_power/zero_power_thumbnail.jpg',
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

const sectionLabels = sections;
const TOTAL_QUESTIONS = warmupQuestions.length;
const TOTAL_ACTIVITIES = 3;

// Activity tabs
const activitySections = [
  'Place Value Builder',
  'Zero Power Mystery',
  'Rocket Builder Challenge',
];

const M1_NumberMysteries: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
  const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Navigation functions
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
    setWarmupIndex(0);
    setWarmupAnswered(false);
    setWarmupCorrect(false);
  };
  
  const prevSection = () => {
    if (section === 3 && activityIndex > 0) {
      setActivityIndex(activityIndex - 1);
    } else if (section === 3 && activityIndex === 0) {
      setSection(section - 1);
    } else {
      setSection((s) => Math.max(s - 1, 0));
    }
  };

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

  // ActivityTabs content
  const activityTabs = [
    {
      label: 'Place Value Builder',
      content: (
        <SectionWrapper key="placevalue" label="Place Value Builder" icon="🧩">
          <PlaceValueBuilder />
        </SectionWrapper>
      )
    },
    {
      label: 'Zero Power Mystery',
      content: (
        <SectionWrapper key="zeropower" label="Zero Power Mystery" icon="🔍">
          <ZeroPowerGame />
        </SectionWrapper>
      )
    },
    {
      label: 'Rocket Builder Challenge',
      content: (
        <SectionWrapper key="rocketbuilder" label="Rocket Builder Challenge" icon="🚀">
          <RocketBuilderChallenge />
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
          <ProgressBarMain current={activityIndex + 1} total={TOTAL_ACTIVITIES} color="bg-blue-400" label="activities" />
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
                <div className="text-2xl font-bold mb-6 text-center">Number Mysteries & Place Value Power</div>
                
                {/* Rocket countdown animation */}
                <div className="bg-gray-100 rounded-xl p-6 mb-6 w-full max-w-md">
                  <div className="text-center text-xl mb-4">Rocket Launch Countdown:</div>
                  <div className="flex justify-center gap-6 mb-4">
                    {[3, 2, 1, 0].map((num, i) => (
                      <motion.div
                        key={num}
                        className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold"
                        initial={{ scale: 0.8, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: i * 0.5 }}
                      >
                        {num}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-center text-lg">Blast off with place value!</div>
                </div>

                <div className="text-xl font-semibold mb-4 text-center">Why do we need that zero?</div>

                {/* Video placeholders - replaced with actual videos */}
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

                <div className="text-lg mb-6">
                  <p>Place value is like a special code that gives each digit a different value based on its position.</p>
                  <p className="mt-2">The digit 0 might seem like "nothing," but it's actually super important! It holds places and changes values.</p>
                </div>

                <div className="bg-yellow-100 p-4 rounded-lg w-full">
                  <div className="font-semibold mb-2">Did you know?</div>
                  <p>Without the zero, we couldn't write numbers like 205 or 1,070!</p>
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Zero means nothing, so it's not important."
                truth="Zero is actually a powerful digit that changes the entire value of a number!"
                videos={mythVideos}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <ActivityTabs tabs={activityTabs} activeTab={activityIndex} onTabChange={setActivityIndex} />
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
              <WrapUp
                title="Place Value Master"
                summary="You've unlocked the power of place value and zero!"
                keyPoints={[
                  "Each digit's position gives it a different value",
                  "Zero is a powerful placeholder that changes a number's value",
                  "Place value helps us read, write, and understand numbers",
                  "The same digits in different orders make completely different numbers"
                ]}
                questions={[
                  "How does changing the position of digits change a number's value?",
                  "Why is zero important in our number system?",
                  "How do you use place value in everyday life?"
                ]}
                nextLessonText="Next up: Magic 9× Finger Trick!"
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

export default M1_NumberMysteries; 