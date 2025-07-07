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
    question: 'If you eat 1 slice of an 8-slice pizza, what fraction have you eaten?',
    options: [
      { text: '1/4', explanation: '1/4 would be 2 slices of an 8-slice pizza.' },
      { text: '1/8', explanation: 'Correct! 1 slice out of 8 equal slices is 1/8.' },
      { text: '1/2', explanation: '1/2 would be 4 slices of an 8-slice pizza.' },
      { text: '1/16', explanation: '1/16 would be less than 1 slice of an 8-slice pizza.' },
    ],
    correct: 1,
    image: '/images/math/m4_pizza_fractions/eighth_pizza.png',
  },
  {
    question: 'Which fraction is bigger?',
    options: [
      { text: '1/2', explanation: 'Correct! 1/2 is bigger than 1/3 because halves are larger than thirds.' },
      { text: '1/3', explanation: '1/3 is smaller than 1/2 because thirds are smaller than halves.' },
      { text: 'Both equal', explanation: '1/2 and 1/3 are not equal; 1/2 is larger.' },
      { text: 'Can\'t compare', explanation: 'We can compare these fractions. 1/2 = 3/6 and 1/3 = 2/6, so 1/2 is larger.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which is equivalent to 2/4?',
    options: [
      { text: '1/2', explanation: 'Correct! 2/4 simplified equals 1/2.' },
      { text: '1/4', explanation: '1/4 is half of 2/4, not equivalent.' },
      { text: '3/4', explanation: '3/4 is larger than 2/4, not equivalent.' },
      { text: '4/8', explanation: '4/8 simplifies to 1/2, which is equivalent to 2/4, but 1/2 is the simplest form.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If 3 friends share a pizza equally, what fraction does each friend get?',
    options: [
      { text: '1/2', explanation: 'If 3 friends share equally, each gets less than 1/2.' },
      { text: '1/3', explanation: 'Correct! Each friend gets 1/3 of the pizza.' },
      { text: '1/4', explanation: 'If 4 friends shared, each would get 1/4.' },
      { text: '3/1', explanation: 'This would mean each person gets 3 whole pizzas.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What fraction of this pizza has pepperoni?',
    options: [
      { text: '1/2', explanation: 'Half the pizza has pepperoni.' },
      { text: '1/3', explanation: 'Not quite - look at how many equal parts there are.' },
      { text: '2/4', explanation: 'Correct! 2 out of 4 equal parts (or 1/2) have pepperoni.' },
      { text: '2/6', explanation: 'The pizza is divided into 4 parts, not 6.' },
    ],
    correct: 2,
    image: '/images/math/m4_pizza_fractions/pepperoni_pizza.png',
  },
  {
    question: 'Which is the same as 3/6?',
    options: [
      { text: '1/2', explanation: 'Correct! 3/6 simplifies to 1/2.' },
      { text: '1/3', explanation: '1/3 is not equal to 3/6 (which is 1/2).' },
      { text: '2/3', explanation: '2/3 is larger than 3/6 (which is 1/2).' },
      { text: '6/3', explanation: '6/3 equals 2, which is much larger than 3/6.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If you ate 3/8 of a pizza yesterday and 2/8 today, what fraction did you eat in total?',
    options: [
      { text: '5/8', explanation: 'Correct! 3/8 + 2/8 = 5/8.' },
      { text: '5/16', explanation: '5/16 would be less than the actual amount eaten.' },
      { text: '6/16', explanation: 'When adding fractions with the same denominator, we add the numerators only.' },
      { text: '1/2', explanation: '1/2 is 4/8, which is less than 5/8.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which fraction is NOT equivalent to 1/2?',
    options: [
      { text: '2/4', explanation: '2/4 simplifies to 1/2, so they are equivalent.' },
      { text: '3/6', explanation: '3/6 simplifies to 1/2, so they are equivalent.' },
      { text: '4/8', explanation: '4/8 simplifies to 1/2, so they are equivalent.' },
      { text: '3/5', explanation: 'Correct! 3/5 is not equivalent to 1/2. It equals 0.6, while 1/2 equals 0.5.' },
    ],
    correct: 3,
    image: null,
  },
  {
    question: 'If a pizza is cut into 6 equal slices and you eat 2 slices, what fraction of the pizza remains?',
    options: [
      { text: '2/6', explanation: 'This is the fraction you ate, not what remains.' },
      { text: '4/6', explanation: 'Correct! If you ate 2/6, then 4/6 (or 2/3) remains.' },
      { text: '1/3', explanation: 'This is the fraction you ate (2/6 = 1/3), not what remains.' },
      { text: '3/4', explanation: '3/4 is not the correct remaining fraction.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Which is larger: 2/3 or 3/5?',
    options: [
      { text: '2/3', explanation: 'Correct! 2/3 = 10/15 and 3/5 = 9/15, so 2/3 is larger.' },
      { text: '3/5', explanation: '3/5 is smaller than 2/3 (convert to the same denominator to compare).' },
      { text: 'They are equal', explanation: 'They are not equal; 2/3 is larger than 3/5.' },
      { text: 'Cannot be compared', explanation: 'Fractions can be compared by converting to a common denominator.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is 1/4 of a 12-slice pizza?',
    options: [
      { text: '3 slices', explanation: 'Correct! 1/4 of 12 slices = 12 ÷ 4 = 3 slices.' },
      { text: '4 slices', explanation: '4 slices would be 1/3 of a 12-slice pizza.' },
      { text: '6 slices', explanation: '6 slices would be 1/2 of a 12-slice pizza.' },
      { text: '8 slices', explanation: '8 slices would be 2/3 of a 12-slice pizza.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If 3/4 of a pizza has cheese and the rest has no cheese, what fraction has no cheese?',
    options: [
      { text: '1/4', explanation: 'Correct! If 3/4 has cheese, then 1/4 has no cheese (1 - 3/4 = 1/4).' },
      { text: '1/3', explanation: 'This is not correct. If 3/4 has cheese, then 1/4 has no cheese.' },
      { text: '2/4', explanation: 'This is not correct. If 3/4 has cheese, then 1/4 has no cheese.' },
      { text: '3/4', explanation: 'This is the fraction that has cheese, not the fraction without cheese.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'What is 2/3 of a 9-slice pizza?',
    options: [
      { text: '3 slices', explanation: '3 slices would be 1/3 of a 9-slice pizza.' },
      { text: '6 slices', explanation: 'Correct! 2/3 of 9 slices = 9 × 2/3 = 6 slices.' },
      { text: '4 slices', explanation: '4 slices is not 2/3 of 9 slices.' },
      { text: '7 slices', explanation: '7 slices is not 2/3 of 9 slices.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Which fraction is in simplest form?',
    options: [
      { text: '2/4', explanation: '2/4 can be simplified to 1/2.' },
      { text: '3/9', explanation: '3/9 can be simplified to 1/3.' },
      { text: '2/5', explanation: 'Correct! 2/5 is already in simplest form as 2 and 5 have no common factors.' },
      { text: '4/10', explanation: '4/10 can be simplified to 2/5.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If you have 3/4 of a pizza and give away 1/4, how much do you have left?',
    options: [
      { text: '1/4', explanation: 'This is not correct. 3/4 - 1/4 = 2/4 = 1/2.' },
      { text: '1/2', explanation: 'Correct! 3/4 - 1/4 = 2/4 = 1/2.' },
      { text: '2/4', explanation: 'Correct in value (2/4 = 1/2), but not in simplest form.' },
      { text: '2/8', explanation: 'This is not correct. 2/8 = 1/4, which is less than the actual amount.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'If one pizza is cut into 8 equal slices and another is cut into 4 equal slices, which slice is bigger?',
    options: [
      { text: '8-slice pizza slice', explanation: 'Slices from an 8-slice pizza are smaller than from a 4-slice pizza.' },
      { text: '4-slice pizza slice', explanation: 'Correct! Slices from a 4-slice pizza are larger because the pizza is divided into fewer pieces.' },
      { text: 'Both are the same', explanation: 'The slices are not the same size; 4-slice pizza slices are larger.' },
      { text: 'Cannot determine', explanation: 'We can determine that 4-slice pizza slices are larger if the pizzas are the same size.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is 1/2 + 1/4?',
    options: [
      { text: '1/6', explanation: 'This is not the correct sum. 1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
      { text: '2/6', explanation: 'This is not the correct sum. 1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
      { text: '3/4', explanation: 'Correct! 1/2 + 1/4 = 2/4 + 1/4 = 3/4.' },
      { text: '3/6', explanation: 'This is not the correct sum. 3/6 = 1/2, but 1/2 + 1/4 = 3/4.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If you have 2/3 of a pizza and eat 1/3, what fraction of the ORIGINAL pizza have you eaten?',
    options: [
      { text: '1/3', explanation: 'Correct! You ate 1/3 of the original pizza.' },
      { text: '1/2', explanation: 'This would be the fraction of your portion (2/3) that you ate, not of the original pizza.' },
      { text: '2/3', explanation: 'This is how much you started with, not how much you ate.' },
      { text: '1/9', explanation: 'This is not the correct fraction of the original pizza.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which is equal to 1?',
    options: [
      { text: '3/3', explanation: 'Correct! 3/3 = 1 whole.' },
      { text: '2/3', explanation: '2/3 is less than 1 whole.' },
      { text: '4/3', explanation: '4/3 is more than 1 whole.' },
      { text: '0/3', explanation: '0/3 = 0, not 1.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'If a pizza is cut into equal slices and you take 3 slices, which could be the fraction you took?',
    options: [
      { text: '3/3', explanation: '3/3 would be the whole pizza.' },
      { text: '3/8', explanation: 'Correct! 3/8 means you took 3 slices out of 8 total slices.' },
      { text: '8/3', explanation: 'This would mean you took more than the whole pizza.' },
      { text: '1/3', explanation: '1/3 would mean you took 1 slice out of 3 total slices, not 3 slices.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is 3/4 - 1/4?',
    options: [
      { text: '2/4', explanation: 'Correct in value, but 2/4 can be simplified to 1/2.' },
      { text: '1/2', explanation: 'Correct! 3/4 - 1/4 = 2/4 = 1/2.' },
      { text: '2/8', explanation: 'This is not correct. 2/8 = 1/4, which is not equal to 3/4 - 1/4.' },
      { text: '3/8', explanation: 'This is not correct. 3/4 - 1/4 = 2/4 = 1/2.' },
    ],
    correct: 1,
    image: null,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'Introduction to Fractions',
    url: 'https://www.youtube.com/embed/n0FZhQ_GkKw',
    thumbnail: '/images/math/m4_pizza_fractions/fractions_intro_thumbnail.jpg',
  },
  {
    title: 'Fractions in Real Life',
    url: 'https://www.youtube.com/embed/4PjuMJ5Z4hQ',
    thumbnail: '/images/math/m4_pizza_fractions/fractions_real_life_thumbnail.jpg',
  }
];

// Videos for the myth section
const mythVideos = [
  {
    title: 'Fractions Are Our Friends',
    url: 'https://www.youtube.com/embed/kn6-c223DUU',
    thumbnail: '/images/math/m4_pizza_fractions/fractions_friends_thumbnail.jpg',
  }
];

// Wrap-up quiz questions
const wrapupQuestions = [
  {
    question: 'What is a fraction?',
    options: [
      { text: 'A whole number', explanation: 'Fractions represent parts of a whole, not whole numbers.' },
      { text: 'A part of a whole', explanation: 'Correct! Fractions represent parts of a whole divided into equal portions.' },
      { text: 'A type of pizza', explanation: 'While we used pizza to learn about fractions, a fraction itself is a mathematical concept.' },
      { text: 'A decimal number', explanation: 'Fractions can be converted to decimals, but they are represented as one number over another.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'In the fraction 3/4, what does the 4 represent?',
    options: [
      { text: 'The number of parts taken', explanation: 'The numerator (3) represents the parts taken.' },
      { text: 'The total number of equal parts', explanation: 'Correct! The denominator (4) represents the total number of equal parts.' },
      { text: 'The size of each part', explanation: 'The denominator indicates how many parts, not their size.' },
      { text: 'The number of pizzas', explanation: 'The denominator represents parts of one whole, not the number of wholes.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'Which fraction is equivalent to 1/2?',
    options: [
      { text: '2/5', explanation: '2/5 = 0.4, which is less than 1/2 = 0.5.' },
      { text: '3/4', explanation: '3/4 = 0.75, which is greater than 1/2 = 0.5.' },
      { text: '2/4', explanation: 'Correct! 2/4 = 1/2 when simplified.' },
      { text: '1/3', explanation: '1/3 ≈ 0.33, which is less than 1/2 = 0.5.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'If you eat 1/4 of a pizza and then another 1/4, what fraction have you eaten in total?',
    options: [
      { text: '1/2', explanation: 'Correct! 1/4 + 1/4 = 2/4 = 1/2.' },
      { text: '1/8', explanation: '1/8 is less than either 1/4 portion.' },
      { text: '2/8', explanation: '2/8 = 1/4, which is less than the total amount eaten.' },
      { text: '2/4', explanation: 'This is correct (2/4), but it simplifies to 1/2.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'Which is larger: 3/8 or 1/2?',
    options: [
      { text: '3/8', explanation: '3/8 = 0.375, which is less than 1/2 = 0.5.' },
      { text: '1/2', explanation: 'Correct! 1/2 = 0.5, which is greater than 3/8 = 0.375.' },
      { text: 'They are equal', explanation: 'They are not equal; 1/2 is larger than 3/8.' },
      { text: 'Cannot be compared', explanation: 'Fractions can be compared by converting to decimals or finding a common denominator.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'If a pizza is cut into 8 equal slices and you eat 6 slices, what fraction of the pizza remains?',
    options: [
      { text: '6/8', explanation: 'This is the fraction you ate, not what remains.' },
      { text: '2/8', explanation: 'Correct! If you ate 6/8, then 2/8 (or 1/4) remains.' },
      { text: '1/4', explanation: 'Correct in value (2/8 = 1/4), but the question asked for the fraction.' },
      { text: '1/3', explanation: 'This is not the correct remaining fraction.' },
    ],
    correct: 1,
    image: null,
  },
  {
    question: 'What is a proper fraction?',
    options: [
      { text: 'When the numerator is less than the denominator', explanation: 'Correct! In a proper fraction, the numerator is less than the denominator, making the value less than 1.' },
      { text: 'When the numerator is greater than the denominator', explanation: 'This describes an improper fraction, which is greater than 1.' },
      { text: 'When the numerator equals the denominator', explanation: 'When the numerator equals the denominator, the fraction equals 1.' },
      { text: 'When the denominator is 0', explanation: 'A fraction with denominator 0 is undefined.' },
    ],
    correct: 0,
    image: null,
  },
  {
    question: 'How do you find an equivalent fraction?',
    options: [
      { text: 'Add the same number to the numerator and denominator', explanation: 'Adding the same number doesn\'t create equivalent fractions.' },
      { text: 'Subtract the same number from the numerator and denominator', explanation: 'Subtracting the same number doesn\'t create equivalent fractions.' },
      { text: 'Multiply the numerator and denominator by the same number', explanation: 'Correct! Multiplying both parts by the same number creates an equivalent fraction.' },
      { text: 'Divide the numerator by the denominator', explanation: 'This gives you the decimal value, not an equivalent fraction.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'What is 2/3 of a 12-slice pizza?',
    options: [
      { text: '4 slices', explanation: '4 slices would be 1/3 of a 12-slice pizza.' },
      { text: '6 slices', explanation: '6 slices would be 1/2 of a 12-slice pizza.' },
      { text: '8 slices', explanation: 'Correct! 2/3 of 12 = 8 slices.' },
      { text: '9 slices', explanation: '9 slices would be 3/4 of a 12-slice pizza.' },
    ],
    correct: 2,
    image: null,
  },
  {
    question: 'Why is it important that fractions represent equal parts?',
    options: [
      { text: 'So everyone gets the same amount', explanation: 'While fairness is important, the mathematical reason is different.' },
      { text: 'For accurate measurement and comparison', explanation: 'Correct! Equal parts ensure that fractions can be accurately measured and compared.' },
      { text: 'To make the pizza taste better', explanation: 'Equal parts don\'t affect taste.' },
      { text: 'It\'s not important', explanation: 'Equal parts are essential to the concept of fractions.' },
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
              <div className="mb-8">
                <h2 className="text-xl font-bold text-center mb-6">Test Your Knowledge</h2>
                <QuizQuestions questions={wrapupQuestions} />
              </div>
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