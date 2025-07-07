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
    question: 'What is an algorithm?',
    options: [
      { text: 'A type of robot', explanation: 'An algorithm is not a physical object like a robot.' },
      { text: 'A step-by-step set of instructions', explanation: 'Correct! An algorithm is a step-by-step set of instructions to solve a problem.' },
      { text: 'A computer game', explanation: 'While algorithms are used in games, they are not games themselves.' },
      { text: 'A math equation', explanation: 'Algorithms can include math equations, but they are more than just equations.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Which of these is NOT a coding direction?',
    options: [
      { text: 'Forward', explanation: 'Forward is a common coding direction.' },
      { text: 'Left', explanation: 'Left is a common coding direction.' },
      { text: 'Right', explanation: 'Right is a common coding direction.' },
      { text: 'Sideways', explanation: 'Correct! "Sideways" is not typically used as a coding direction. We use left or right instead.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'What is a grid?',
    options: [
      { text: 'A series of horizontal and vertical lines forming squares', explanation: 'Correct! A grid is made up of horizontal and vertical lines that form squares or cells.' },
      { text: 'A type of computer', explanation: 'A grid is not a type of computer.' },
      { text: 'A programming language', explanation: 'A grid is not a programming language.' },
      { text: 'A robot', explanation: 'A grid is not a robot.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What does "loop" mean in coding?',
    options: [
      { text: 'To make a mistake', explanation: 'Making mistakes in code is called a "bug," not a loop.' },
      { text: 'To repeat steps', explanation: 'Correct! A loop repeats a set of instructions multiple times.' },
      { text: 'To delete code', explanation: 'Deleting code is not referred to as a loop.' },
      { text: 'To save a file', explanation: 'Saving a file is not related to loops in coding.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Which of these is a pattern?',
    options: [
      { text: 'Red, blue, red, blue', explanation: 'Correct! This is a repeating pattern.' },
      { text: 'Red, red, red, red', explanation: 'This is not a pattern, just repetition.' },
      { text: 'Blue, green, yellow', explanation: 'This is a sequence, not a repeating pattern.' },
      { text: 'Green, green, green', explanation: 'This is not a pattern.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What do you call a mistake in code?',
    options: [
      { text: 'A bug', explanation: 'Correct! A bug is a mistake in code.' },
      { text: 'A frog', explanation: 'A frog is not a coding term.' },
      { text: 'A code', explanation: 'Code is the instructions, not the mistake.' },
      { text: 'A jump', explanation: 'Jump is not a coding mistake.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which command moves you forward?',
    options: [
      { text: 'Go', explanation: 'Correct! "Go" or "Move forward" are commands to move ahead.' },
      { text: 'Stop', explanation: 'Stop means to halt.' },
      { text: 'Turn left', explanation: 'Turn left changes direction.' },
      { text: 'Turn right', explanation: 'Turn right changes direction.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is a coordinate in a grid?',
    options: [
      { text: 'A type of robot', explanation: 'A coordinate is not a robot.' },
      { text: 'A location defined by numbers', explanation: 'Correct! Coordinates use numbers to identify a specific location in a grid.' },
      { text: 'A programming language', explanation: 'A coordinate is not a programming language.' },
      { text: 'A computer game', explanation: 'A coordinate is not a game, though games may use coordinates.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What does "debug" mean?',
    options: [
      { text: 'To add more bugs', explanation: 'Debugging actually means removing bugs, not adding them.' },
      { text: 'To find and fix mistakes in code', explanation: 'Correct! Debugging is the process of finding and fixing errors in code.' },
      { text: 'To create a new program', explanation: 'Creating a new program is not debugging.' },
      { text: 'To turn off a computer', explanation: 'Turning off a computer is not debugging.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a sequence?',
    options: [
      { text: 'A type of computer', explanation: 'A sequence is not a type of computer.' },
      { text: 'A random collection of items', explanation: 'A sequence is ordered, not random.' },
      { text: 'An ordered list of items', explanation: 'Correct! A sequence is an ordered list of items or instructions.' },
      { text: 'A programming language', explanation: 'A sequence is not a programming language.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If a robot is facing north and turns right, which direction is it facing?',
    options: [
      { text: 'North', explanation: 'The robot would no longer be facing north after turning right.' },
      { text: 'South', explanation: 'Turning right from north would not result in facing south.' },
      { text: 'East', explanation: 'Correct! If facing north and turning right, the robot would now face east.' },
      { text: 'West', explanation: 'Turning right from north would not result in facing west.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is a function in coding?',
    options: [
      { text: 'A type of loop', explanation: 'While functions can contain loops, they are not loops themselves.' },
      { text: 'A reusable block of code', explanation: 'Correct! A function is a reusable block of code that performs a specific task.' },
      { text: 'A type of bug', explanation: 'Functions are not bugs; they are useful code components.' },
      { text: 'A grid coordinate', explanation: 'Functions are not related to grid coordinates.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a conditional statement?',
    options: [
      { text: 'Code that always runs', explanation: 'Conditional statements only run when certain conditions are met.' },
      { text: 'Code that never runs', explanation: 'Conditional statements do run when their conditions are met.' },
      { text: 'Code that runs only if a condition is met', explanation: 'Correct! Conditional statements execute only when specific conditions are true.' },
      { text: 'Code that causes bugs', explanation: 'Conditional statements are not inherently buggy.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is the purpose of comments in code?',
    options: [
      { text: 'To make the code run faster', explanation: 'Comments don\'t affect code execution speed.' },
      { text: 'To create bugs', explanation: 'Comments don\'t create bugs; they\'re not executed.' },
      { text: 'To explain how the code works', explanation: 'Correct! Comments help explain code to humans reading it.' },
      { text: 'To give instructions to the computer', explanation: 'Comments are ignored by the computer; they\'re for humans.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is a variable in coding?',
    options: [
      { text: 'A fixed value that never changes', explanation: 'Variables can change; constants are fixed values.' },
      { text: 'A storage container for data', explanation: 'Correct! Variables store data that can be used or changed in a program.' },
      { text: 'A type of function', explanation: 'Variables are not functions; they store data.' },
      { text: 'A coding error', explanation: 'Variables are not errors; they\'re essential parts of code.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What does "iterate" mean in coding?',
    options: [
      { text: 'To delete something', explanation: 'Iteration is not about deletion.' },
      { text: 'To create something new', explanation: 'Iteration is not specifically about creation.' },
      { text: 'To repeat a process', explanation: 'Correct! Iteration means to repeat a process, often using loops.' },
      { text: 'To fix a bug', explanation: 'Fixing bugs is debugging, not iteration.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is an "if-else" statement?',
    options: [
      { text: 'A statement that always runs', explanation: 'If-else statements run conditionally.' },
      { text: 'A statement that never runs', explanation: 'If-else statements do run based on conditions.' },
      { text: 'A statement that does one thing if a condition is true and another if false', explanation: 'Correct! If-else statements execute different code based on whether a condition is true or false.' },
      { text: 'A type of loop', explanation: 'If-else statements are conditional statements, not loops.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is the x-coordinate in a grid?',
    options: [
      { text: 'The horizontal position', explanation: 'Correct! The x-coordinate represents the horizontal position in a grid.' },
      { text: 'The vertical position', explanation: 'The vertical position is the y-coordinate.' },
      { text: 'The diagonal position', explanation: 'Coordinates don\'t directly represent diagonal positions.' },
      { text: 'The center of the grid', explanation: 'The x-coordinate can be any horizontal position, not just the center.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which of these is NOT a common programming concept?',
    options: [
      { text: 'Loops', explanation: 'Loops are a common programming concept.' },
      { text: 'Variables', explanation: 'Variables are a common programming concept.' },
      { text: 'Telepathy', explanation: 'Correct! Telepathy is not a programming concept; it\'s a fictional ability to read minds.' },
      { text: 'Functions', explanation: 'Functions are a common programming concept.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is pseudocode?',
    options: [
      { text: 'A programming language', explanation: 'Pseudocode is not a formal programming language.' },
      { text: 'Fake code that doesn\'t work', explanation: 'While pseudocode doesn\'t run on computers, it\'s not "fake" - it\'s a planning tool.' },
      { text: 'A simplified description of an algorithm', explanation: 'Correct! Pseudocode is a human-readable description of an algorithm\'s steps.' },
      { text: 'A type of bug', explanation: 'Pseudocode is not a bug; it\'s a planning tool.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If a robot moves forward 3 spaces, turns right, and moves forward 2 spaces, how far is it from its starting point?',
    options: [
      { text: '1 space', explanation: 'This is not the correct distance.' },
      { text: '3 spaces', explanation: 'This is not the correct distance.' },
      { text: '5 spaces', explanation: 'Adding the distances (3+2) doesn\'t give the correct answer for this movement pattern.' },
      { text: '√13 spaces (approximately 3.6)', explanation: 'Correct! Using the Pythagorean theorem (3² + 2² = 13), the distance is √13.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'What is a "for loop" used for?',
    options: [
      { text: 'To repeat code a specific number of times', explanation: 'Correct! For loops repeat code a predetermined number of times.' },
      { text: 'To make decisions', explanation: 'Decision-making is done with conditional statements, not for loops.' },
      { text: 'To fix bugs', explanation: 'Loops don\'t fix bugs; they repeat code.' },
      { text: 'To store data', explanation: 'Loops don\'t store data; variables do that.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is the output of this algorithm: Start with 5, add 3, multiply by 2?',
    options: [
      { text: '10', explanation: 'This would be (5 × 2) + 3, but the order is different.' },
      { text: '13', explanation: 'This would be 5 + 3 + 5, which is not the algorithm.' },
      { text: '16', explanation: 'Correct! 5 + 3 = 8, then 8 × 2 = 16.' },
      { text: '11', explanation: 'This is not the correct result of the algorithm.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is the purpose of indentation in code?',
    options: [
      { text: 'To make the code run faster', explanation: 'Indentation doesn\'t affect execution speed.' },
      { text: 'To create more bugs', explanation: 'Proper indentation helps prevent bugs, not create them.' },
      { text: 'To make the code look prettier', explanation: 'While indentation does improve appearance, that\'s not its main purpose.' },
      { text: 'To show structure and organization', explanation: 'Correct! Indentation visually indicates code structure and helps show which code belongs to which blocks.' },
    ],
    correct: 3,
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

// Wrap-up quiz questions
const wrapupQuestions = [
  {
    question: 'What is an algorithm?',
    options: [
      { text: 'A type of computer', explanation: 'An algorithm is not a type of computer.' },
      { text: 'A step-by-step set of instructions to solve a problem', explanation: 'Correct! Algorithms are precise instructions that solve problems.' },
      { text: 'A programming language', explanation: 'An algorithm can be written in any programming language, but it\'s not a language itself.' },
      { text: 'A type of robot', explanation: 'Algorithms are instructions, not physical objects like robots.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Why is pattern recognition important in coding?',
    options: [
      { text: 'It makes the code colorful', explanation: 'Pattern recognition isn\'t about visual appearance.' },
      { text: 'It helps identify bugs', explanation: 'While this can be true, it\'s not the main benefit.' },
      { text: 'It helps solve problems more efficiently', explanation: 'Correct! Recognizing patterns helps create efficient solutions and reusable code.' },
      { text: 'It\'s not important', explanation: 'Pattern recognition is very important in coding.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What happens when you run code with a bug?',
    options: [
      { text: 'The computer breaks', explanation: 'Bugs don\'t typically break computers physically.' },
      { text: 'The code might not work as expected', explanation: 'Correct! Bugs cause code to behave incorrectly or fail.' },
      { text: 'Nothing happens', explanation: 'Bugs do affect code execution.' },
      { text: 'The code runs faster', explanation: 'Bugs don\'t make code run faster; they cause problems.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a grid in coding?',
    options: [
      { text: 'A network of computers', explanation: 'In coding, a grid typically refers to a coordinate system, not a network.' },
      { text: 'A coordinate system with rows and columns', explanation: 'Correct! A grid is a coordinate system that helps position elements.' },
      { text: 'A type of programming language', explanation: 'A grid is not a programming language.' },
      { text: 'A computer screen', explanation: 'While screens display grids, they aren\'t grids themselves.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a loop used for?',
    options: [
      { text: 'To repeat code multiple times', explanation: 'Correct! Loops allow you to execute the same code multiple times.' },
      { text: 'To make decisions', explanation: 'Decision-making is done with conditional statements, not loops.' },
      { text: 'To store data', explanation: 'Data storage is done with variables, not loops.' },
      { text: 'To connect to the internet', explanation: 'Loops don\'t connect to the internet.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If a robot is at position (3,4) and moves 2 units right, where is it now?',
    options: [
      { text: '(5,4)', explanation: 'Correct! Moving right increases the x-coordinate by 2, from 3 to 5.' },
      { text: '(3,6)', explanation: 'Moving right affects the x-coordinate, not the y-coordinate.' },
      { text: '(1,4)', explanation: 'Moving right increases the x-coordinate, not decreases it.' },
      { text: '(3,2)', explanation: 'Moving right affects the x-coordinate, not the y-coordinate.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is a function in coding?',
    options: [
      { text: 'A type of variable', explanation: 'Functions and variables are different concepts.' },
      { text: 'A reusable block of code', explanation: 'Correct! Functions are reusable code blocks that perform specific tasks.' },
      { text: 'A type of loop', explanation: 'Functions and loops are different concepts.' },
      { text: 'A programming error', explanation: 'Functions are not errors; they\'re useful code components.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is debugging?',
    options: [
      { text: 'Writing new code', explanation: 'Debugging is fixing existing code, not writing new code.' },
      { text: 'Finding and fixing errors in code', explanation: 'Correct! Debugging is the process of identifying and fixing bugs.' },
      { text: 'Creating a grid', explanation: 'Debugging is not related to creating grids.' },
      { text: 'Running code faster', explanation: 'Debugging doesn\'t necessarily make code run faster.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a conditional statement?',
    options: [
      { text: 'Code that always runs', explanation: 'Conditional statements only run when specific conditions are met.' },
      { text: 'Code that runs based on a condition', explanation: 'Correct! Conditional statements execute different code based on whether conditions are true or false.' },
      { text: 'A type of loop', explanation: 'Conditional statements and loops are different concepts.' },
      { text: 'A way to store data', explanation: 'Conditional statements don\'t store data; they control program flow.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is the most important skill for a coder to have?',
    options: [
      { text: 'Typing speed', explanation: 'While helpful, typing speed is not the most important skill.' },
      { text: 'Problem-solving', explanation: 'Correct! Problem-solving is the core skill needed for coding.' },
      { text: 'Memory', explanation: 'Good memory helps, but problem-solving is more important.' },
      { text: 'Drawing ability', explanation: 'Drawing isn\'t typically necessary for coding.' },
    ],
    correct: 1,
    image: null,
  },
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
              <div className="mb-8">
                <h2 className="text-xl font-bold text-center mb-6">Test Your Knowledge</h2>
                <QuizQuestions questions={wrapupQuestions} />
              </div>
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