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
import MagicFingerTrickTutorial from '../../components/games/math/MagicFingerTrickTutorial';
import SpeedRoundRelay from '../../components/games/math/SpeedRoundRelay';
import NineTimesLadder from '../../components/games/math/NineTimesLadder';
import VideoEmbed from '../../components/common/VideoEmbed';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What is 9 × 2?',
    options: [
      { text: '11', explanation: '11 is 9 + 2, not 9 × 2.' },
      { text: '18', explanation: 'Correct! 9 × 2 = 18' },
      { text: '9', explanation: '9 is just 9 × 1.' },
      { text: '12', explanation: '12 is 6 × 2 or 4 × 3, not 9 × 2.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is 9 × 5?',
    options: [
      { text: '40', explanation: '40 is 8 × 5, not 9 × 5.' },
      { text: '54', explanation: '54 is 9 × 6, not 9 × 5.' },
      { text: '45', explanation: 'Correct! 9 × 5 = 45' },
      { text: '49', explanation: '49 is 7 × 7, not 9 × 5.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What pattern do you see in 9\'s answers?',
    options: [
      { text: 'All are odd', explanation: 'Not all multiples of 9 are odd. For example, 18 is even.' },
      { text: 'They go up and down', explanation: 'The multiples of 9 consistently increase.' },
      { text: 'Digits add to 9', explanation: 'Correct! In multiples of 9, the digits add up to 9 (or a multiple of 9 for larger numbers).' },
      { text: 'No pattern', explanation: 'There is a clear pattern in the multiples of 9.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which of these is not a multiple of 9?',
    options: [
      { text: '18', explanation: '18 is 9 × 2, so it is a multiple of 9.' },
      { text: '36', explanation: '36 is 9 × 4, so it is a multiple of 9.' },
      { text: '27', explanation: '27 is 9 × 3, so it is a multiple of 9.' },
      { text: '35', explanation: 'Correct! 35 is not a multiple of 9. It\'s 5 × 7.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'What is 9 × 3?',
    options: [
      { text: '27', explanation: 'Correct! 9 × 3 = 27.' },
      { text: '18', explanation: '18 is 9 × 2.' },
      { text: '36', explanation: '36 is 9 × 4.' },
      { text: '21', explanation: '21 is 7 × 3.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is 9 × 7?',
    options: [
      { text: '63', explanation: 'Correct! 9 × 7 = 63.' },
      { text: '56', explanation: '56 is 8 × 7.' },
      { text: '72', explanation: '72 is 9 × 8.' },
      { text: '49', explanation: '49 is 7 × 7.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the sum of the digits in 54?',
    options: [
      { text: '9', explanation: 'Correct! 5 + 4 = 9.' },
      { text: '7', explanation: '7 is 5 + 2.' },
      { text: '6', explanation: '6 is 3 + 3.' },
      { text: '8', explanation: '8 is 4 + 4.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which of these is a multiple of 9?',
    options: [
      { text: '27', explanation: 'Correct! 27 is 9 × 3.' },
      { text: '25', explanation: '25 is not a multiple of 9.' },
      { text: '32', explanation: '32 is not a multiple of 9.' },
      { text: '40', explanation: '40 is not a multiple of 9.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is 9 × 6?',
    options: [
      { text: '54', explanation: 'Correct! 9 × 6 = 54.' },
      { text: '45', explanation: '45 is 9 × 5.' },
      { text: '63', explanation: '63 is 9 × 7.' },
      { text: '36', explanation: '36 is 9 × 4.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is 9 × 10?',
    options: [
      { text: '90', explanation: 'Correct! 9 × 10 = 90.' },
      { text: '99', explanation: '99 is 9 × 11.' },
      { text: '81', explanation: '81 is 9 × 9.' },
      { text: '100', explanation: '100 is not a multiple of 9.' },
    ],
    correct: 0,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: '9 Times Table Finger Trick',
    url: 'https://www.youtube.com/embed/02xtbQt22XY',
    thumbnail: '/images/math/m2_magic_9x/finger_trick_thumbnail.jpg',
  },
  {
    title: 'Learn your 9 times table using fingers',
    url: 'https://www.youtube.com/embed/xBTGKiVgWcA',
    thumbnail: '/images/math/m2_magic_9x/nine_times_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'Multiplying 9\'s Finger Trick',
    url: 'https://www.youtube.com/embed/uFxDr33FLgU',
    thumbnail: '/images/math/m2_magic_9x/multiplying_9s_thumbnail.jpg',
  }
];

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

const M2_Magic9xFingerTrick: React.FC = () => {
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
      label: 'Magic Finger Trick Tutorial',
      content: (
        <SectionWrapper key="magictrick" label="Magic Finger Trick Tutorial" icon="��">
          <MagicFingerTrickTutorial />
        </SectionWrapper>
      )
    },
    {
      label: 'Speed Round Relay',
      content: (
        <SectionWrapper key="speedround" label="Speed Round Relay" icon="🏃">
          <SpeedRoundRelay />
        </SectionWrapper>
      )
    },
    {
      label: 'Build the 9× Table Ladder',
      content: (
        <SectionWrapper key="ninetimesladder" label="9× Table Ladder" icon="🪜">
          <NineTimesLadder />
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
                <div className="text-2xl font-bold mb-6 text-center">Magic 9× Finger Trick</div>
                
                {/* Story scene */}
                <div className="bg-blue-50 rounded-xl p-6 mb-6 w-full">
                  <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
                    <div className="bg-white rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">A kid struggling with 9-times tables...</div>
                      <div className="text-gray-600">
                        "I'll never remember all these multiplication facts!"
                      </div>
                    </div>
                    <div className="text-5xl">✨</div>
                    <div className="bg-purple-100 rounded-lg p-4 shadow-md flex-1">
                      <div className="text-lg font-medium mb-2">A magical math wizard appears!</div>
                      <div className="text-purple-700 font-medium">
                        "Let me show you a magical finger trick that makes 9× easy!"
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video section */}
                <div className="w-full mb-6">
                  <div className="text-xl font-bold mb-4 text-center">Watch and Learn</div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {introVideos.map((video, index) => (
                      <div key={index} className="bg-gray-50 rounded-lg p-3 shadow-sm">
                        <VideoEmbed 
                          title={video.title} 
                          url={video.url} 
                          thumbnail={video.thumbnail} 
                        />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="The 9× finger trick is just a coincidence and doesn't really work for math."
                truth="The 9× finger trick works because of place value patterns. It's based on solid math principles!"
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
                title="Magic 9× Mastery"
                summary="You've mastered the magical 9× finger trick!"
                keyPoints={[
                  "The 9× finger trick uses your fingers to find products quickly",
                  "The tens digit is always one less than the number you're multiplying by",
                  "The ones digit and tens digit always add up to 9",
                  "This pattern works because of place value and number properties"
                ]}
                questions={[
                  "How does the finger trick help you remember 9× facts?",
                  "Can you explain the pattern to someone else?",
                  "What other math tricks have you learned?"
                ]}
                nextLessonText="Next up: Learn about grid coding!"
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

export default M2_Magic9xFingerTrick; 