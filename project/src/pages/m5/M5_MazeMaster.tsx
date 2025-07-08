import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import SectionWrapper from '../../components/common/SectionWrapper';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import VideoEmbed from '../../components/common/VideoEmbed';
import DragToCodeMaze from '../../components/games/math/DragToCodeMaze';
import SequenceBuilder from '../../components/games/math/SequenceBuilder';
import AlgorithmPuzzle from '../../components/games/math/AlgorithmPuzzle';
import SoundPlayer from '../../components/common/SoundPlayer';
import { playSoundEffect } from '../../components/common/SoundPlayer';
import ProgressBarQuestions from '../../components/global/ProgressBarQuestions';

// Quiz questions for the warm-up section
const warmupQuestions = [
  {
    question: 'What does an algorithm mean?',
    options: [
      { text: 'A magic trick', explanation: 'Algorithms are not magic tricks, though they can sometimes seem magical!' },
      { text: 'A set of steps', explanation: 'Correct! An algorithm is a set of clear steps to solve a problem.' },
      { text: 'A puzzle', explanation: 'While algorithms can help solve puzzles, they are the steps themselves, not the puzzle.' },
      { text: 'A mistake', explanation: 'Algorithms are intentional step-by-step instructions, not mistakes.' },
    ],
    correct: 1,
    image: '/images/math/m5_maze_master/algorithm_steps.png',
  },
  {
    question: 'Which direction is this arrow 👉 pointing?',
    options: [
      { text: 'Left', explanation: 'This arrow points to the right, not left.' },
      { text: 'Right', explanation: 'Correct! This arrow points to the right.' },
      { text: 'Up', explanation: 'This arrow points horizontally (to the right), not up.' },
      { text: 'Down', explanation: 'This arrow points horizontally (to the right), not down.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What comes after 3 steps forward and 1 left turn?',
    options: [
      { text: 'Jump', explanation: 'In step-by-step algorithms, we need to follow the exact steps. Jumping is not mentioned.' },
      { text: 'Turn around', explanation: 'The next step would depend on the algorithm, but turning around would be a different instruction.' },
      { text: 'Keep going', explanation: 'Correct! After following the steps, you should continue with the next instruction.' },
      { text: 'Right turn', explanation: 'A right turn would be a new instruction, not automatically what comes next.' },
    ],
    correct: 2,
    image: '/images/math/m5_maze_master/steps_sequence.png',
  },
  {
    question: 'Why do we follow step-by-step instructions?',
    options: [
      { text: 'To get lost', explanation: 'Step-by-step instructions actually help us avoid getting lost!' },
      { text: 'To move randomly', explanation: 'Instructions are the opposite of random movement - they give us a clear path.' },
      { text: 'To reach a goal', explanation: 'Correct! We follow step-by-step instructions to accomplish a specific goal.' },
      { text: 'To draw shapes', explanation: 'While some algorithms can help draw shapes, that\'s not the main purpose of following instructions.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is a sequence?',
    options: [
      { text: 'A list of steps in order', explanation: 'Correct! A sequence is an ordered list of steps.' },
      { text: 'A random guess', explanation: 'A sequence is not random.' },
      { text: 'A mistake', explanation: 'A mistake is not a sequence.' },
      { text: 'A puzzle', explanation: 'A puzzle can have a sequence, but is not itself a sequence.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which direction is opposite of left?',
    options: [
      { text: 'Right', explanation: 'Correct! Right is the opposite of left.' },
      { text: 'Up', explanation: 'Up is not the opposite of left.' },
      { text: 'Down', explanation: 'Down is not the opposite of left.' },
      { text: 'Forward', explanation: 'Forward is not the opposite of left.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What do you call a repeated set of steps?',
    options: [
      { text: 'A loop', explanation: 'Correct! A loop repeats steps.' },
      { text: 'A jump', explanation: 'A jump is not a repeated set of steps.' },
      { text: 'A stop', explanation: 'A stop means to halt.' },
      { text: 'A bug', explanation: 'A bug is a mistake in code.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which of these is a turn?',
    options: [
      { text: 'Left', explanation: 'Correct! Left is a turn.' },
      { text: 'Forward', explanation: 'Forward is not a turn.' },
      { text: 'Stop', explanation: 'Stop is not a turn.' },
      { text: 'Go', explanation: 'Go is not a turn.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the goal in a maze?',
    options: [
      { text: 'To reach the end', explanation: 'Correct! The goal is to reach the end.' },
      { text: 'To get lost', explanation: 'Getting lost is not the goal.' },
      { text: 'To go in circles', explanation: 'Going in circles is not the goal.' },
      { text: 'To stop', explanation: 'Stopping is not the goal.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What do you call a mistake in an algorithm?',
    options: [
      { text: 'A bug', explanation: 'Correct! A bug is a mistake in an algorithm or code.' },
      { text: 'A loop', explanation: 'A loop is a repeated set of steps.' },
      { text: 'A jump', explanation: 'A jump is not a mistake.' },
      { text: 'A puzzle', explanation: 'A puzzle is not a mistake.' },
    ],
    correct: 0,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'What are Algorithms? | Computer Science for Kids',
    url: 'https://www.youtube.com/embed/578hB0E6y4o',
    thumbnail: '/images/math/m5_maze_master/algorithm_kids_thumbnail.jpg',
  },
  {
    title: 'Algorithms for Young Children',
    url: 'https://www.youtube.com/embed/DYZ-zjU6HMg',
    thumbnail: '/images/math/m5_maze_master/young_children_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'BBC Learning - What Is An Algorithm',
    url: 'https://www.youtube.com/embed/Da5TOXCwLSg',
    thumbnail: '/images/math/m5_maze_master/bbc_algorithm_thumbnail.jpg',
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

const M5_MazeMaster: React.FC = () => {
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
      label: 'Drag-to-Code Maze',
      content: (
        <SectionWrapper key="dragtocode" label="Drag-to-Code Maze" icon="🧩">
          <DragToCodeMaze />
        </SectionWrapper>
      )
    },
    {
      label: 'Sequence Builder',
      content: (
        <SectionWrapper key="sequencebuilder" label="Sequence Builder" icon="🔢">
          <SequenceBuilder />
        </SectionWrapper>
      )
    },
    {
      label: 'Algorithm Puzzle',
      content: (
        <SectionWrapper key="algorithmpuzzle" label="Algorithm Puzzle" icon="🧠">
          <AlgorithmPuzzle />
        </SectionWrapper>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 p-4 sm:p-6">
      <div className="max-w-4xl mx-auto">
        <ProgressBarSection sectionLabels={sectionLabels} currentSection={section} onSectionChange={setSection} />
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
              <div className="bg-white rounded-xl shadow p-6 mb-6">
                <motion.div 
                  className="bg-blue-50 p-4 rounded-lg mb-6 border border-blue-100 flex items-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <div className="text-4xl mr-4">🤖</div>
                  <div className="flex-1">
                    <p className="font-bold text-lg mb-1">Robot says:</p>
                    <p>"I need your help! I only move if you tell me how."</p>
                  </div>
                </motion.div>
                
                <p className="mb-4">An algorithm is a set of step-by-step instructions that help us solve problems. Just like a recipe helps us cook, algorithms help computers (and robots!) know exactly what to do.</p>
                
                <div className="flex justify-center gap-8 my-6">
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.2 }}
                  >
                    <div className="text-4xl mb-2">⬆️</div>
                    <div className="text-sm font-medium">Forward</div>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.3 }}
                  >
                    <div className="text-4xl mb-2">⬇️</div>
                    <div className="text-sm font-medium">Backward</div>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="text-4xl mb-2">⬅️</div>
                    <div className="text-sm font-medium">Left</div>
                  </motion.div>
                  <motion.div 
                    className="flex flex-col items-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 }}
                  >
                    <div className="text-4xl mb-2">➡️</div>
                    <div className="text-sm font-medium">Right</div>
                  </motion.div>
                </div>
                
                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                  <p className="font-bold mb-2">Think about it:</p>
                  <p>"How would you guide this robot out of the maze using steps?"</p>
                </div>
              </div>
              
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {introVideos.map((video, index) => (
                    <div key={index} className="bg-white rounded-lg shadow p-4 flex flex-col items-center">
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
                myth="Algorithms are only for computers!"
                truth="An algorithm is any set of clear steps—even brushing your teeth or making cereal!"
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
                title="Maze Master Algorithms"
                summary="You've learned how algorithms are step-by-step instructions that help us solve problems!"
                keyPoints={[
                  "Algorithms are step-by-step instructions to solve problems",
                  "We use algorithms in everyday life, not just with computers",
                  "Clear instructions help robots (and people) know exactly what to do",
                  "Breaking down big problems into small steps makes them easier to solve"
                ]}
                questions={[
                  "What is an algorithm you use in your real life?",
                  "Why does a robot need clear steps?",
                  "How could you use algorithms to solve other problems?"
                ]}
                nextLessonText="Next up: Below Zero!"
              />
              
              {/* Final animation */}
              <motion.div 
                className="mt-6 bg-blue-50 p-6 rounded-xl flex flex-col items-center"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
              >
                <div className="text-xl font-bold mb-4">You are now a Maze Master!</div>
                <motion.div 
                  className="text-5xl mb-4"
                  animate={{ 
                    rotate: [0, 10, -10, 10, 0],
                    y: [0, -10, 0]
                  }}
                  transition={{ 
                    duration: 1.5, 
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                >
                  🤖
                </motion.div>
                <p className="text-center">
                  Now you can create your own algorithms and teach others how to think step-by-step!
                </p>
              </motion.div>
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

export default M5_MazeMaster; 