import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/common/SectionWrapper';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import VideoEmbed from '../../components/common/VideoEmbed';
import PizzaSlicer from '../../components/games/math/PizzaSlicer';
import FractionMatchUp from '../../components/games/math/FractionMatchUp';
import TreasureClueHunt from '../../components/games/math/TreasureClueHunt';
import SoundPlayer from '../../components/common/SoundPlayer';
import { playSoundEffect } from '../../components/common/SoundPlayer';
import ProgressBarQuestions from '../../components/global/ProgressBarQuestions';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What is ½ of a pizza?',
    options: [
      { text: 'The whole', explanation: 'The whole pizza is 1 whole, not half.' },
      { text: '1 slice out of 4', explanation: '1 out of 4 slices would be ¼, not ½.' },
      { text: '2 equal parts', explanation: 'Correct! Half means dividing into 2 equal parts.' },
      { text: 'Just cheese', explanation: 'Cheese is a topping, not a fraction of the pizza.' },
    ],
    correct: 2,
    image: '/images/math/m4_pizza_fractions/half_pizza.png',
  },
  {
    question: 'If you cut a pizza into 4 equal parts, each part is called a:',
    options: [
      { text: 'Whole', explanation: 'A whole pizza is the complete pizza before cutting.' },
      { text: 'Half', explanation: 'Half is when you divide something into 2 equal parts.' },
      { text: 'Quarter', explanation: 'Correct! When divided into 4 equal parts, each part is a quarter (¼).' },
      { text: 'Eighth', explanation: 'An eighth is when you divide something into 8 equal parts.' },
    ],
    correct: 2,
    image: '/images/math/m4_pizza_fractions/quarter_pizza.png',
  },
  {
    question: 'Which shows 1/3?',
    options: [
      { text: '1 out of 3', explanation: 'Correct! One-third (1/3) means 1 part out of 3 equal parts.' },
      { text: '3 out of 3', explanation: '3 out of 3 parts would be the whole (3/3 = 1).' },
      { text: 'Half', explanation: 'Half is 1 out of 2 equal parts (1/2), not 1/3.' },
      { text: 'None', explanation: 'One of the options does show 1/3.' },
    ],
    correct: 0,
    image: '/images/math/m4_pizza_fractions/third_options.png',
  },
  {
    question: 'What happens if the parts are not equal?',
    options: [
      { text: 'It\'s still a fraction', explanation: 'Fractions must represent equal parts to be valid.' },
      { text: 'It doesn\'t count', explanation: 'Correct! Fractions must be equal parts of the whole.' },
      { text: 'It\'s bigger', explanation: 'Unequal parts don\'t make a fraction bigger or smaller - they make it invalid.' },
      { text: 'It\'s tastier', explanation: 'The taste of food doesn\'t change based on how equally it\'s divided.' },
    ],
    correct: 1,
    image: '/images/math/m4_pizza_fractions/unequal_parts.png',
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'Using Pizza to Teach Fractions',
    url: 'https://www.youtube.com/embed/X61BxuhIeBs',
    thumbnail: '/images/math/m4_pizza_fractions/pizza_teach_thumbnail.jpg',
  },
  {
    title: 'Pizza Fractions',
    url: 'https://www.youtube.com/embed/fHRvP_n8khw',
    thumbnail: '/images/math/m4_pizza_fractions/pizza_fractions_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'Fun with Fractions - Pizza Fractions',
    url: 'https://www.youtube.com/embed/lP1l5lOgjEs',
    thumbnail: '/images/math/m4_pizza_fractions/fun_fractions_thumbnail.jpg',
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

const M4_PizzaFractions: React.FC = () => {
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
      label: 'Pizza Slicer',
      content: (
        <SectionWrapper key="pizzaslicer" label="Pizza Slicer" icon="🍕">
          <PizzaSlicer />
        </SectionWrapper>
      )
    },
    {
      label: 'Fraction Match-Up',
      content: (
        <SectionWrapper key="fractionmatchup" label="Fraction Match-Up" icon="🧩">
          <FractionMatchUp />
        </SectionWrapper>
      )
    },
    {
      label: 'Treasure Clue Hunt',
      content: (
        <SectionWrapper key="treasurecluehunt" label="Treasure Clue Hunt" icon="🗺️">
          <TreasureClueHunt />
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
                <div className="text-2xl font-bold mb-6 text-center">Pizza Fractions Adventure</div>
                
                {/* Pizza slicing animation placeholder */}
                <div className="bg-orange-50 rounded-xl p-6 mb-6 w-full">
                  <div className="flex flex-col items-center gap-4">
                    <div className="text-lg font-medium mb-2 text-center">
                      Watch how a pizza is sliced into equal parts
                    </div>
                    <div className="bg-white rounded-lg p-6 shadow-md w-full max-w-md">
                      <div className="aspect-square bg-orange-100 rounded-full flex items-center justify-center relative">
                        <div className="text-6xl">🍕</div>
                        <div className="absolute inset-0 flex items-center justify-center">
                          <motion.div 
                            className="h-full w-0.5 bg-red-500 origin-center"
                            animate={{ rotate: [0, 180] }}
                            transition={{ duration: 2, repeat: Infinity, repeatDelay: 1 }}
                          />
                        </div>
                      </div>
                      <div className="text-center mt-4 text-lg font-medium">
                        "Fractions help us share fairly!"
                      </div>
                    </div>
                    <div className="text-center mt-4 text-lg">
                      Can you divide this pizza for 3 friends so everyone gets a fair slice?
                    </div>
                  </div>
                </div>

                {/* Video section - now side by side */}
                <div className="w-full mb-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Fractions only mean tiny pieces."
                truth="Fractions are fair equal parts of a whole—big or small!"
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
                title="Pizza Fractions Adventure"
                summary="You've learned how fractions help us divide things into equal parts and share fairly!"
                keyPoints={[
                  "Fractions represent equal parts of a whole",
                  "The denominator tells how many equal parts the whole is divided into",
                  "The numerator tells how many parts we're talking about",
                  "Fractions help us share things fairly"
                ]}
                questions={[
                  "If a pizza is cut into 4 pieces and you eat 1, how much is left?",
                  "Can a bigger slice be a smaller fraction?",
                  "How do you use fractions in everyday life?"
                ]}
                nextLessonText="Next up: Maze Master!"
              />
              
              {/* Summary animation */}
              <div className="mt-8 bg-orange-50 p-6 rounded-lg">
                <div className="text-center text-lg font-medium mb-4">Friends sharing pizzas fairly using fractions</div>
                <div className="flex justify-center gap-8">
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">👧</div>
                    <div className="text-orange-500 font-bold">1/3</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">👦</div>
                    <div className="text-orange-500 font-bold">1/3</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="text-4xl mb-2">👧</div>
                    <div className="text-orange-500 font-bold">1/3</div>
                  </div>
                </div>
                <div className="flex justify-center mt-4">
                  <div className="w-48 h-48 bg-orange-100 rounded-full flex items-center justify-center relative">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="h-full w-0.5 bg-red-500 origin-center rotate-60" />
                      <div className="h-full w-0.5 bg-red-500 origin-center -rotate-60" />
                    </div>
                    <div className="text-6xl">🍕</div>
                  </div>
                </div>
              </div>
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

export default M4_PizzaFractions; 