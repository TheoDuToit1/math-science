import React, { useState, useEffect } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import DragDropZone from '../../components/common/DragDropZone';
import { motion, AnimatePresence } from 'framer-motion';
import SoundPlayer from '../../components/common/SoundPlayer';
import { playSoundEffect } from '../../components/common/SoundPlayer';
import type { DragEndEvent } from '@dnd-kit/core';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarQuestions from '../../components/global/ProgressBarQuestions';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';

const warmupQuestions = [
  {
    question: 'What color comes first in a rainbow?',
    options: [
      { text: 'Violet', explanation: 'Violet is the last color in a rainbow.' },
      { text: 'Green', explanation: 'Green is in the middle of the rainbow.' },
      { text: 'Red', explanation: 'Correct! Red is always first.' },
      { text: 'Blue', explanation: 'Blue comes after green in a rainbow.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What shape is a rainbow?',
    options: [
      { text: 'Triangle', explanation: 'Rainbows are not triangles.' },
      { text: 'Circle', explanation: 'Rainbows are actually full circles, but we usually see an arch.' },
      { text: 'Straight line', explanation: 'Rainbows are curved, not straight.' },
      { text: 'Arch', explanation: 'Correct! We see rainbows as an arch in the sky.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'When do we often see rainbows?',
    options: [
      { text: 'At night', explanation: 'Rainbows need sunlight, so they do not appear at night.' },
      { text: 'After it rains and the sun comes out', explanation: 'Correct! Rainbows appear when sunlight shines through raindrops.' },
      { text: 'When it\'s snowing', explanation: 'Snow does not make rainbows.' },
      { text: 'In the dark', explanation: 'Rainbows need light to appear.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'How many main colors are in a rainbow?',
    options: [
      { text: '3', explanation: 'There are more than 3 colors in a rainbow.' },
      { text: '5', explanation: 'There are more than 5 colors in a rainbow.' },
      { text: '6', explanation: 'There are 7 main colors in a rainbow.' },
      { text: '7', explanation: 'Correct! There are 7 main colors.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'What causes a rainbow to form?',
    options: [
      { text: 'Sunlight and raindrops', explanation: 'Correct! Rainbows form when sunlight passes through raindrops, which act like tiny prisms.' },
      { text: 'Moonlight and clouds', explanation: 'Moonlight is too weak to create rainbows, and clouds alone don\'t split light.' },
      { text: 'Wind and trees', explanation: 'Wind and trees don\'t create the light-splitting effect needed for rainbows.' },
      { text: 'Lightning and thunder', explanation: 'Lightning produces light but doesn\'t split it into rainbow colors.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Where do you need to be standing to see a rainbow?',
    options: [
      { text: 'With the sun in front of you', explanation: 'If the sun is in front of you, the rainbow would be behind you, so you couldn\'t see it.' },
      { text: 'With the sun behind you', explanation: 'Correct! You need the sun behind you and rain/water droplets in front of you to see a rainbow.' },
      { text: 'Under a tree', explanation: 'Being under a tree doesn\'t determine whether you can see a rainbow.' },
      { text: 'Inside a building', explanation: 'You usually need to be outside to see natural rainbows.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Can you touch a rainbow?',
    options: [
      { text: 'Yes, if you\'re close enough', explanation: 'Rainbows aren\'t physical objects, so you can\'t touch them.' },
      { text: 'No, it\'s not a physical object', explanation: 'Correct! A rainbow isn\'t a physical object - it\'s light being split and reflected in a special way.' },
      { text: 'Only on rainy days', explanation: 'Rainbows aren\'t physical objects regardless of the weather.' },
      { text: 'Only at the end of the rainbow', explanation: 'Rainbows don\'t have an actual "end" that you can reach.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What shape is a complete rainbow in the sky?',
    options: [
      { text: 'Half-circle', explanation: 'We usually see half-circles, but complete rainbows are full circles.' },
      { text: 'Full circle', explanation: 'Correct! A rainbow is actually a full circle, but we usually only see half because the ground gets in the way.' },
      { text: 'Triangle', explanation: 'Rainbows are never triangular in shape.' },
      { text: 'Square', explanation: 'Rainbows are never square in shape.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is at the end of a rainbow?',
    options: [
      { text: 'A pot of gold', explanation: 'This is a fun myth, but rainbows don\'t have an actual "end" you can reach.' },
      { text: 'More rainbow', explanation: 'Rainbows are circular, so they don\'t have an end.' },
      { text: 'Nothing special', explanation: 'Correct! The "end" of a rainbow isn\'t a real place - rainbows are optical illusions that move as you move.' },
      { text: 'Another rainbow', explanation: 'While double rainbows exist, they don\'t appear at the "end" of the first rainbow.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Which scientist is famous for discovering how white light splits into colors?',
    options: [
      { text: 'Albert Einstein', explanation: 'Einstein is known for relativity, not for work on light splitting into colors.' },
      { text: 'Marie Curie', explanation: 'Curie is known for her work on radioactivity, not light.' },
      { text: 'Isaac Newton', explanation: 'Correct! Isaac Newton discovered that white light contains all colors of the rainbow when he split light with a prism.' },
      { text: 'Thomas Edison', explanation: 'Edison is known for the light bulb and other inventions, not for studying how light splits into colors.' },
    ],
    correct: 2,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'How Is A Rainbow Formed | The Dr. Binocs Show',
    url: 'https://www.youtube.com/embed/nCPPLhPTAIk',
    thumbnail: '/images/science/s1_rainbow_maker/rainbow_binocs_thumbnail.jpg',
  },
  {
    title: 'How to Make a Rainbow',
    url: 'https://www.youtube.com/embed/Cm9ZkYTnCNE',
    thumbnail: '/images/science/s1_rainbow_maker/make_rainbow_thumbnail.jpg',
  }
];

const mythVideos = [
  {
    title: 'What Is a Rainbow? | Rainbows for Kids',
    url: 'https://www.youtube.com/embed/lVDSvGz4iJs',
    thumbnail: '/images/science/s1_rainbow_maker/real-rainbow.jpg',
  },
];

const builderPuzzles = [
  {
  prompt: 'Drag the pieces in order to make a rainbow!',
  items: [
    { id: 'sun', label: 'Sun ☀️', image: '/images/science/s1_rainbow_maker/sun.png' },
    { id: 'water', label: 'Water 💧', image: '/images/science/s1_rainbow_maker/drop.png' },
    { id: 'refraction', label: 'Refraction ✨', image: '/images/science/s1_rainbow_maker/prism split.jpg' },
    { id: 'rainbow', label: 'Rainbow 🌈', image: '/images/science/s1_rainbow_maker/rainbow.png' },
  ],
  correctOrder: ['sun', 'water', 'refraction', 'rainbow'],
  successImage: '/images/science/s1_rainbow_maker/real-rainbow.jpg',
  },
  {
    prompt: 'Build a rainbow with clouds first!',
    items: [
      { id: 'cloud', label: 'Cloud ☁️', image: '/images/science/s1_rainbow_maker/rainbow-clouds.png' },
      { id: 'sun', label: 'Sun ☀️', image: '/images/science/s1_rainbow_maker/sun.png' },
      { id: 'water', label: 'Water 💧', image: '/images/science/s1_rainbow_maker/drop.png' },
      { id: 'rainbow', label: 'Rainbow 🌈', image: '/images/science/s1_rainbow_maker/rainbow.png' },
    ],
    correctOrder: ['cloud', 'sun', 'water', 'rainbow'],
    successImage: '/images/science/s1_rainbow_maker/rainbow-clouds.jpg',
  },
  {
    prompt: 'Add rain before the rainbow appears!',
    items: [
      { id: 'sun', label: 'Sun ☀️', image: '/images/science/s1_rainbow_maker/sun.png' },
      { id: 'cloud', label: 'Cloud ☁️', image: '/images/science/s1_rainbow_maker/rainbow-clouds.png' },
      { id: 'rain', label: 'Rain 🌧️', image: '/images/science/s1_rainbow_maker/rainbow-fake1.jpeg' },
      { id: 'rainbow', label: 'Rainbow 🌈', image: '/images/science/s1_rainbow_maker/rainbow.png' },
    ],
    correctOrder: ['sun', 'cloud', 'rain', 'rainbow'],
    successImage: '/images/science/s1_rainbow_maker/rainbow-clouds.jpg',
  },
  {
    prompt: 'Use a prism to split the sunlight!',
    items: [
      { id: 'sun', label: 'Sun ☀️', image: '/images/science/s1_rainbow_maker/sun.png' },
      { id: 'prism', label: 'Prism 🔺', image: '/images/science/s1_rainbow_maker/triangle.png' },
      { id: 'refraction', label: 'Refraction ✨', image: '/images/science/s1_rainbow_maker/prism split.jpg' },
      { id: 'rainbow', label: 'Rainbow 🌈', image: '/images/science/s1_rainbow_maker/rainbow.png' },
    ],
    correctOrder: ['sun', 'prism', 'refraction', 'rainbow'],
    successImage: '/images/science/s1_rainbow_maker/prism split.jpg',
  },
];

const colorOrderPuzzle = {
  prompt: 'Drag the colors into rainbow order (ROYGBIV)!',
  items: [
    { id: 'red', label: 'Red', color: 'bg-red-500' },
    { id: 'orange', label: 'Orange', color: 'bg-orange-400' },
    { id: 'yellow', label: 'Yellow', color: 'bg-yellow-300' },
    { id: 'green', label: 'Green', color: 'bg-green-500' },
    { id: 'blue', label: 'Blue', color: 'bg-blue-500' },
    { id: 'indigo', label: 'Indigo', color: 'bg-indigo-600' },
    { id: 'violet', label: 'Violet', color: 'bg-violet-500' },
  ],
  correctOrder: ['red', 'orange', 'yellow', 'green', 'blue', 'indigo', 'violet'],
  successImage: '/images/science/s1_rainbow_maker/rainbow.png',
};

const exitTicket = {
  prompt: 'What comes next when sunlight meets water?',
  image: '/images/science/s1_rainbow_maker/sun.png',
  image2: '/images/science/s1_rainbow_maker/drop.png',
  options: [
    { label: 'Rainbow', isCorrect: true },
    { label: 'Cloud', isCorrect: false },
    { label: 'Lightning', isCorrect: false },
    { label: 'Thunder', isCorrect: false },
  ],
};

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

const EMPTY_COLOR_ARRAY = Array(7).fill(undefined) as (string | undefined)[];

function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const colorIdToHex: Record<string, string> = {
  red: '#ef4444',
  orange: '#f59e42',
  yellow: '#fde047',
  green: '#22c55e',
  blue: '#3b82f6',
  indigo: '#6366f1',
  violet: '#a78bfa',
};

const musicNotes = [
  { id: 'red', label: 'Red', color: 'bg-red-500', note: '🎵' },
  { id: 'orange', label: 'Orange', color: 'bg-orange-400', note: '🎶' },
  { id: 'yellow', label: 'Yellow', color: 'bg-yellow-300', note: '🎼' },
  { id: 'green', label: 'Green', color: 'bg-green-500', note: '🎷' },
  { id: 'blue', label: 'Blue', color: 'bg-blue-500', note: '🎺' },
  { id: 'indigo', label: 'Indigo', color: 'bg-indigo-600', note: '🎻' },
  { id: 'violet', label: 'Violet', color: 'bg-violet-500', note: '🥁' },
];

const PrismSplitActivity: React.FC = () => {
  const [split, setSplit] = useState(false);
  const [showNice, setShowNice] = useState(false);

  // Animate sparkle after split
  useEffect(() => {
    if (split) {
      setTimeout(() => setShowNice(true), 900);
    } else {
      setShowNice(false);
    }
  }, [split]);

  // Layout constants
  const w = 420;
  const h = 220;
  const sunX = 60;
  const sunY = h / 2;
  const prismX = 210;
  const prismY = h / 2;

  return (
    <div className="flex flex-col items-center justify-center w-full">
      <div className="text-2xl font-bold text-indigo-700 mb-2">Split the Light!</div>
      <div className="relative bg-gradient-to-b from-blue-50 to-white rounded-xl shadow-lg border w-[420px] h-[220px] flex items-center justify-center mx-auto">
        {/* SVG beams */}
        <svg width={w} height={h} className="absolute left-0 top-0 w-full h-full pointer-events-none">
          {/* Main beam */}
          <motion.line
            x1={sunX + 32}
            y1={sunY}
            x2={prismX - 12}
            y2={prismY}
            stroke="#fffde4"
            strokeWidth={7}
            strokeLinecap="round"
            initial={false}
            animate={{ opacity: split ? 0.3 : 1 }}
            transition={{ duration: 0.5 }}
          />
          {/* Split beams */}
          <motion.line
            x1={prismX + 12}
            y1={prismY}
            x2={prismX + 110}
            y2={prismY - 40}
            stroke="#ef4444"
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: split ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
          />
          <motion.line
            x1={prismX + 12}
            y1={prismY}
            x2={prismX + 110}
            y2={prismY + 0}
            stroke="#3b82f6"
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: split ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          />
          <motion.line
            x1={prismX + 12}
            y1={prismY}
            x2={prismX + 110}
            y2={prismY + 40}
            stroke="#a78bfa"
            strokeWidth={6}
            strokeLinecap="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: split ? 1 : 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
          />
        </svg>
        {/* Sun icon */}
        <div className="absolute left-2 top-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
            <circle cx="24" cy="24" r="14" fill="#ffe066" stroke="#f59e42" strokeWidth="3" />
            <g stroke="#f59e42" strokeWidth="3">
              <line x1="24" y1="2" x2="24" y2="12" />
              <line x1="24" y1="36" x2="24" y2="46" />
              <line x1="2" y1="24" x2="12" y2="24" />
              <line x1="36" y1="24" x2="46" y2="24" />
              <line x1="8" y1="8" x2="16" y2="16" />
              <line x1="40" y1="8" x2="32" y2="16" />
              <line x1="8" y1="40" x2="16" y2="32" />
              <line x1="40" y1="40" x2="32" y2="32" />
            </g>
          </svg>
        </div>
        {/* Prism icon */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center">
          <svg width="56" height="56" viewBox="0 0 48 48" fill="none">
            <polygon points="24,6 42,36 6,36" fill="#e0e7ef" stroke="#6366f1" strokeWidth="3" />
            <polygon points="24,6 33,36 15,36" fill="#a5b4fc" stroke="#6366f1" strokeWidth="2" />
          </svg>
        </div>
        {/* Sparkle or Nice! */}
        {showNice && (
          <motion.div
            className="absolute left-[340px] top-1/2 -translate-y-1/2 text-3xl font-bold text-indigo-500 select-none"
            initial={{ opacity: 0, scale: 0.7 }}
            animate={{ opacity: [0.7, 1, 0.7], scale: [0.7, 1.2, 0.7] }}
            transition={{ duration: 1.2, repeat: Infinity }}
          >
            🌈 Nice!
          </motion.div>
        )}
      </div>
      <button
        className="mt-6 px-6 py-3 bg-indigo-500 text-white rounded-xl text-xl font-bold shadow hover:bg-indigo-600 transition"
        onClick={() => setSplit(true)}
        disabled={split}
      >
        Split the Light
      </button>
      {split && (
        <button
          className="mt-2 px-4 py-1 bg-gray-100 text-indigo-700 rounded text-sm font-bold border border-indigo-200 hover:bg-indigo-50"
          onClick={() => setSplit(false)}
        >
          Reset
        </button>
      )}
    </div>
  );
};

const sectionLabels = [
  'Warm-Up',
  'Introduction',
  'Myth',
  'Activities',
  'Wrap-Up',
];
const TOTAL_QUESTIONS = warmupQuestions.length;
const TOTAL_ACTIVITIES = 3;

const S1RainbowMaker: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
  const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
  const [puzzleStep, setPuzzleStep] = useState(0); // 0: builder, 1: color order
  const [builderLevel, setBuilderLevel] = useState(0);
  const [builderPlaced, setBuilderPlaced] = useState<(string | undefined)[]>([]);
  const [colorPlaced, setColorPlaced] = useState<(string | undefined)[]>([...EMPTY_COLOR_ARRAY]);
  const [shuffledColors, setShuffledColors] = useState<typeof colorOrderPuzzle.items>([]);
  const [showBuilderSuccess, setShowBuilderSuccess] = useState<boolean>(false);
  const [showColorSuccess, setShowColorSuccess] = useState<boolean>(false);
  const [draggedColor, setDraggedColor] = useState<string | null>(null);
  const [playCorrectSound, setPlayCorrectSound] = useState(false);
  const [shakeBand, setShakeBand] = useState<number | null>(null);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);
  const [activityTab, setActivityTab] = useState(0);

  const nextSection = () => {
    setSection((s) => Math.min(s + 1, sections.length - 1));
    setWarmupIndex(0);
    setWarmupAnswered(false);
    setWarmupCorrect(false);
    setPuzzleStep(0);
    setBuilderPlaced([]);
    setColorPlaced([...EMPTY_COLOR_ARRAY]);
    setShowBuilderSuccess(false);
    setShowColorSuccess(false);
    setDraggedColor(null);
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

  // Builder puzzle logic
  const currentBuilderPuzzle = builderPuzzles[builderLevel];
  const builderDraggables = currentBuilderPuzzle.items
    .filter(item => !builderPlaced.includes(item.id))
    .map(item => ({ id: item.id, content: (
      <div className="flex flex-col items-center">
        <img src={item.image} alt={item.label} className="w-16 h-16 mb-1 cursor-zoom-in" onClick={() => setFullscreenImage(item.image)} />
        <span className="font-bold text-sm">{item.label}</span>
      </div>
    ) }));
  const builderDroppables = currentBuilderPuzzle.correctOrder.map((id, idx) => ({
    id: `slot-${idx}`,
    content: builderPlaced[idx]
      ? (() => {
          const found = currentBuilderPuzzle.items.find(i => i.id === builderPlaced[idx]);
          return found ? (
            <div className="flex flex-col items-center">
              <img src={found.image} alt="" className="w-16 h-16 mb-1 cursor-zoom-in" onClick={() => setFullscreenImage(found.image)} />
              <span className="font-bold text-sm">{found.label}</span>
            </div>
          ) : <div className="w-16 h-16 bg-gray-100 rounded mb-1" />;
        })()
      : <div className="w-16 h-16 bg-gray-100 rounded mb-1" />
  }));
  const handleBuilderDrop = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const slotIdx = parseInt((over.id as string).replace('slot-', ''));
    let newPlaced = [...builderPlaced];
    newPlaced = newPlaced.map(id => (id === active.id ? undefined : id));
    newPlaced[slotIdx] = active.id as string;
    setBuilderPlaced(newPlaced);
    setTimeout(() => {
      if (
        newPlaced.length === currentBuilderPuzzle.correctOrder.length &&
        newPlaced.every((id, i) => id === currentBuilderPuzzle.correctOrder[i])
      ) {
        setShowBuilderSuccess(true);
      }
    }, 200);
  };

  // Color order puzzle logic
  const colorDraggables = colorOrderPuzzle.items
    .filter(item => !colorPlaced.includes(item.id))
    .map(item => ({ id: item.id, content: (
      <div className={`w-12 h-12 rounded-full ${item.color} border-2 border-gray-300`} title={item.label} onClick={() => setFullscreenImage(item.image)}></div>
    ) }));
  const colorDroppables = colorOrderPuzzle.correctOrder.map((id, idx) => ({
    id: `color-slot-${idx}`,
    content: colorPlaced[idx]
      ? (() => {
          const found = colorOrderPuzzle.items.find(i => i.id === colorPlaced[idx]);
          return found ? (
            <div className={`w-12 h-12 rounded-full ${found.color} border-2 border-gray-300`} onClick={() => setFullscreenImage(found.image)}></div>
          ) : <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-gray-300" />;
        })()
      : <div className="w-12 h-12 bg-gray-100 rounded-full border-2 border-gray-300" />
  }));
  const handleColorDrop = (event: DragEndEvent) => {
    const { active, over } = event;
    if (!active || !over) return;
    const idx = parseInt((over.id as string).replace('color-slot-', ''));
    if (colorPlaced[idx]) return;
    
    const colorId = active.id as string;
    const isCorrect = colorId === colorOrderPuzzle.correctOrder[idx];
    
    if (isCorrect) {
      playSoundEffect('correct-6033');
    const newPlaced = [...colorPlaced];
      newPlaced[idx] = colorId;
    setColorPlaced(newPlaced);
    setTimeout(() => {
      if (
        newPlaced.length === colorOrderPuzzle.correctOrder.length &&
        newPlaced.every((id, i) => id === colorOrderPuzzle.correctOrder[i])
      ) {
        setShowColorSuccess(true);
      }
    }, 200);
    } else {
      playSoundEffect('fail');
    }
  };

  // Shuffle only on Color Order tab entry and reset colorPlaced
  useEffect(() => {
    if (section === 3 && activityTab === 1) {
      setShuffledColors(shuffle([...colorOrderPuzzle.items])); // always shuffle a copy
      setColorPlaced([...EMPTY_COLOR_ARRAY]); // reset the rainbow
    }
  }, [section, activityTab]);

  // In the SVG rainbow section, render bands in fixed ROYGBIV order:
  const handleDragOverSVG = (e: React.DragEvent<SVGPathElement>) => { e.preventDefault(); };
  const handleDropSVG = (e: React.DragEvent<SVGPathElement>, i: number) => {
    e.preventDefault();
    const dragged = e.dataTransfer.getData('color-id');
    if (!dragged) return;
    if (dragged !== colorOrderPuzzle.correctOrder[i]) {
      setShakeBand(i);
      playSoundEffect('fail');
      setTimeout(() => setShakeBand(null), 500);
      return;
    }
    if (!colorPlaced[i] && !colorPlaced.includes(dragged)) {
      const newPlaced = [...colorPlaced];
      newPlaced[i] = dragged;
      setColorPlaced(newPlaced);
      playSoundEffect('correct-6033');
      setTimeout(() => {
        if (
          newPlaced.length === 7 &&
          newPlaced.every((id, idx) => id === colorOrderPuzzle.correctOrder[idx])
        ) {
          setShowColorSuccess(true);
        }
      }, 200);
    }
  };

  // ActivityTabs content
  const activityTabs = [
    {
      label: 'Builder Puzzle',
      content: (
            <SectionWrapper key="builder" label="Hands-On Puzzle" icon="🧩">
              <div className="mb-8 flex flex-col items-center">
                <div className="font-bold mb-2">{currentBuilderPuzzle.prompt}</div>
                <DragDropZone
                  draggableItems={builderDraggables}
                  droppableZones={builderDroppables}
                  onDrop={handleBuilderDrop}
                  layout="horizontal"
                />
              </div>
              {showBuilderSuccess && (
                <div className="flex flex-col items-center mt-2">
                  <motion.img
                    src={currentBuilderPuzzle.successImage}
                    alt="Rainbow celebration"
                    className="w-96 rounded-xl shadow-lg border-4 border-yellow-200 cursor-zoom-in"
                    initial={{ opacity: 0, x: -100 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 1 }}
                    onClick={() => setFullscreenImage(currentBuilderPuzzle.successImage)}
                  />
                  <motion.div
                    initial={{ opacity: 0, x: -60 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5, duration: 0.8 }}
                    className="text-5xl mt-[-2.5rem]"
                  >
                    ✨
                  </motion.div>
                </div>
              )}
            </SectionWrapper>
      ),
    },
    {
      label: 'Color Order',
      content: (
            <SectionWrapper key="colororder" label="Color Order Puzzle" icon="🌈">
              <div className="flex flex-col items-center w-full">
                <div className="text-2xl font-bold mb-2">Color Order Puzzle</div>
                <div className="text-lg mb-6">Drag the colors into rainbow order (ROYGBIV)!</div>
                {/* SVG rainbow with 7 interactive drop bands */}
                <div className="relative flex justify-center items-center mb-10 w-full" style={{ height: '768px' }}>
                  <svg width="1365" height="768" viewBox="0 0 1365 768" className="mx-auto" style={{ zIndex: 1 }}>
                    {colorOrderPuzzle.correctOrder.map((bandColorId, i) => {
                      // Band geometry
                      const bandWidth = 90;
                      const bandSpacing = 10;
                      const outerRadius = 600;
                      const radius = outerRadius - i * (bandWidth + bandSpacing);
                      const startAngle = Math.PI;
                      const endAngle = 0;
                      const x1 = 682.5 + radius * Math.cos(startAngle);
                      const y1 = 768 + radius * Math.sin(startAngle);
                      const x2 = 682.5 + radius * Math.cos(endAngle);
                      const y2 = 768 + radius * Math.sin(endAngle);
                      const largeArcFlag = 1;
                      // Color logic
                      const placed = colorPlaced[i];
                      const color = placed ? colorIdToHex[placed] : '#d1d5db';
                      return (
                        <g key={`${i}-${placed}`}>
                          <motion.path
                            d={`M${x1},${y1} A${radius},${radius} 0 ${largeArcFlag},1 ${x2},${y2}`}
                            stroke={color}
                            strokeWidth={bandWidth}
                            fill="none"
                            opacity={placed ? 1 : 0.9}
                            strokeLinecap="round"
                            onDragOver={handleDragOverSVG}
                            onDrop={e => handleDropSVG(e, i)}
                            style={{ cursor: !colorPlaced[i] ? 'pointer' : 'pointer' }}
                            whileHover={!colorPlaced[i] ? { stroke: '#a5b4fc', opacity: 1 } : {}}
                            animate={shakeBand === i ? { x: [0, -10, 10, -10, 10, 0] } : {}}
                            transition={{ duration: 0.5 }}
                            onClick={() => {
                              if (colorPlaced[i]) {
                                const newPlaced = [...colorPlaced];
                                newPlaced[i] = undefined;
                                setColorPlaced(newPlaced);
                              }
                            }}
                          />
                        </g>
                      );
                    })}
                  </svg>
                </div>
                {/* Well done message */}
                {showColorSuccess && (
                  <motion.div
                    className="text-green-600 text-2xl font-bold mb-4"
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.5 }}
                  >
                    ✅ Well done!
                  </motion.div>
                )}
                {/* Draggable color buttons */}
                <div className="flex flex-row justify-center gap-6 mb-2 w-full">
                  {shuffledColors.filter(item => !colorPlaced.includes(item.id)).map(item => {
                    const noteObj = musicNotes.find(n => n.id === item.id);
                    return (
                      <motion.div
                        key={item.id}
                        className={`cursor-pointer w-14 h-14 rounded-full border-4 flex items-center justify-center ${item.color} shadow-lg text-3xl`}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.95 }}
                        draggable
                        onDragStart={e => e.dataTransfer.setData('color-id', item.id)}
                        style={{ zIndex: 10 }}
                      >
                        <span aria-label={item.label}>{noteObj ? noteObj.note : '🎵'}</span>
                      </motion.div>
                    );
                  })}
                </div>
          </div>
        </SectionWrapper>
      ),
    },
    {
      label: 'Split the Light!',
      content: (
        <SectionWrapper key="prismsplit" label="Split the Light!" icon="💎">
          <PrismSplitActivity />
        </SectionWrapper>
      ),
    },
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
                <img
                  src="/images/science/s1_rainbow_maker/real-rainbow.jpg"
                  alt="Rainbow over water"
                  className="w-96 rounded-xl mb-4 cursor-zoom-in"
                  onClick={() => setFullscreenImage('/images/science/s1_rainbow_maker/real-rainbow.jpg')}
                />
                <div className="text-lg font-medium mb-4 text-center">
                  Have you ever seen a rainbow? Where do you think those colors come from?
                </div>
                <img
                  src="/images/science/s1_rainbow_maker/prism split.jpg"
                  alt="Prism splitting light"
                  className="w-64 rounded mb-6 cursor-zoom-in"
                  onClick={() => setFullscreenImage('/images/science/s1_rainbow_maker/prism split.jpg')}
                />
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Rainbows come from paint in the clouds."
                truth="Rainbows form when sunlight bends and splits as it passes through raindrops."
                videos={[{ url: 'https://www.youtube.com/embed/GqbgJ3c3yhc', title: 'What Is a Rainbow?' }]}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <ActivityTabs tabs={activityTabs} activeTab={activityTab} onTabChange={setActivityTab} />
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
              <WrapUp
                title="Rainbow Science Expert"
                summary="You've discovered how rainbows are formed!"
                keyPoints={[
                  "Rainbows form when sunlight passes through water droplets",
                  "Light bends (refracts) and splits into different colors",
                  "The colors always appear in the same order: ROYGBIV",
                  "You need both sunlight and water to see a rainbow"
                ]}
                questions={[
                  "Where have you seen rainbows in nature?",
                  "Can you remember the colors in order?",
                  "How could you make your own rainbow at home?"
                ]}
                nextLessonText="Next up: Learn about Moon phases!"
              >
                <div className="flex gap-2 mb-4">
                  <span className="bg-red-500 text-white px-2 py-1 rounded">Red</span>
                  <span className="bg-orange-400 text-white px-2 py-1 rounded">Orange</span>
                  <span className="bg-yellow-300 text-white px-2 py-1 rounded">Yellow</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded">Green</span>
                  <span className="bg-blue-500 text-white px-2 py-1 rounded">Blue</span>
                  <span className="bg-indigo-600 text-white px-2 py-1 rounded">Indigo</span>
                  <span className="bg-violet-500 text-white px-2 py-1 rounded">Violet</span>
                </div>
              </WrapUp>
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

export default S1RainbowMaker; 