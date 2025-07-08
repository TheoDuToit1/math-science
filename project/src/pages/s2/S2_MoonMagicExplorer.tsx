import React, { useState, useEffect, useRef, useCallback } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import GameCanvas from '../../components/common/GameCanvas';
import ConfettiEffect from '../../components/common/ConfettiEffect';
import SoundPlayer, { useSound } from '../../components/common/SoundPlayer';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ActivityTabs from '../../components/global/ActivityTabs';

const warmupQuestions = [
  {
    question: 'What shape is a full moon?',
    options: [
      { text: 'Square', explanation: 'The full moon is not a square.' },
      { text: 'Circle', explanation: 'Correct! The full moon looks like a circle.' },
      { text: 'Triangle', explanation: 'The moon never looks like a triangle.' },
      { text: 'Star', explanation: 'Stars and moons are different shapes.' },
    ],
    correct: 1,
  },
  {
    question: 'What do we call the moon when we cannot see it?',
    options: [
      { text: 'Full Moon', explanation: 'A full moon is bright and easy to see.' },
      { text: 'Crescent Moon', explanation: 'A crescent moon is a thin slice, not invisible.' },
      { text: 'No Moon', explanation: 'We call it a New Moon, not "No Moon".' },
      { text: 'New Moon', explanation: 'Correct! A New Moon is when the sunlit half faces away from us.' },
    ],
    correct: 3,
  },
  {
    question: 'What makes the moon shine?',
    options: [
      { text: 'Flashlight', explanation: 'The moon is not lit by a flashlight.' },
      { text: 'Sunlight', explanation: 'Correct! The moon reflects sunlight.' },
      { text: 'Fire', explanation: 'There is no fire on the moon.' },
      { text: 'Magic', explanation: 'It is not magic, it is sunlight!' },
    ],
    correct: 1,
  },
  {
    question: 'How many moon phases are there?',
    options: [
      { text: '2', explanation: 'There are more than 2 phases.' },
      { text: '4', explanation: 'There are more than 4 phases.' },
      { text: '6', explanation: 'There are 8 main phases.' },
      { text: '8', explanation: 'Correct! There are 8 main phases. The moon never changes shape, but we see different parts lit up.' },
    ],
    correct: 3,
  },
  {
    question: 'How long does it take for the moon to go through all its phases?',
    options: [
      { text: 'One day', explanation: 'It takes much longer than a day for the moon to complete its phases.' },
      { text: 'One week', explanation: 'It takes longer than a week for the moon to complete all its phases.' },
      { text: 'About one month', explanation: 'Correct! It takes about 29.5 days (about one month) for the moon to go through all its phases.' },
      { text: 'One year', explanation: 'It takes much less than a year for the moon to complete its phases.' },
    ],
    correct: 2,
  },
  {
    question: 'Which moon phase comes after a Full Moon?',
    options: [
      { text: 'New Moon', explanation: 'New Moon comes after Waning Crescent, not directly after Full Moon.' },
      { text: 'Waning Gibbous', explanation: 'Correct! After Full Moon, the visible portion starts to decrease, becoming Waning Gibbous.' },
      { text: 'Waxing Gibbous', explanation: 'Waxing Gibbous comes before Full Moon, not after it.' },
      { text: 'First Quarter', explanation: 'First Quarter comes before Full Moon, not after it.' },
    ],
    correct: 1,
  },
  {
    question: 'What does "waxing" mean when talking about moon phases?',
    options: [
      { text: 'The moon is getting smaller', explanation: 'When the moon is getting smaller, we call it "waning," not "waxing."' },
      { text: 'The moon is getting brighter', explanation: 'Correct! "Waxing" means the visible part of the moon is increasing (getting bigger).' },
      { text: 'The moon is changing color', explanation: 'The moon doesn\'t change color during its phases.' },
      { text: 'The moon is moving faster', explanation: 'The moon\'s speed doesn\'t change during its phases.' },
    ],
    correct: 1,
  },
  {
    question: 'Does the moon make its own light?',
    options: [
      { text: 'Yes, it glows like a lightbulb', explanation: 'The moon doesn\'t produce its own light like a lightbulb.' },
      { text: 'Yes, but only during a full moon', explanation: 'The moon never produces its own light.' },
      { text: 'No, it reflects sunlight', explanation: 'Correct! The moon doesn\'t make its own light - it reflects sunlight like a mirror.' },
      { text: 'No, it reflects starlight', explanation: 'The moon reflects sunlight, not starlight.' },
    ],
    correct: 2,
  },
  {
    question: 'What is the dark part of the moon during its phases?',
    options: [
      { text: 'The part facing away from Earth', explanation: 'The dark part we see is still facing Earth, just not receiving sunlight.' },
      { text: 'The part not receiving sunlight', explanation: 'Correct! The dark parts we see are not being hit by the sun\'s light.' },
      { text: 'The part covered by Earth\'s shadow', explanation: 'Earth\'s shadow only falls on the moon during a lunar eclipse, not during regular phases.' },
      { text: 'The part covered by clouds', explanation: 'The moon\'s dark areas aren\'t caused by clouds - the moon doesn\'t have clouds like Earth.' },
    ],
    correct: 1,
  },
  {
    question: 'Why does the moon look different throughout the month?',
    options: [
      { text: 'The moon changes shape', explanation: 'The moon doesn\'t actually change its shape.' },
      { text: 'Clouds block parts of the moon', explanation: 'Clouds might occasionally block our view, but they don\'t cause the regular phases.' },
      { text: 'Different parts are lit by the sun', explanation: 'Correct! As the moon orbits Earth, different portions of its surface are illuminated by the sun.' },
      { text: 'The moon spins really fast', explanation: 'The moon rotates, but very slowly - once per orbit, which is why we always see the same side.' },
    ],
    correct: 2,
  },
  // 14 new questions for variety, patterns, logic, and moon/space facts:
  {
    question: 'Which phase comes next? 🌑 🌓 🌕 ...',
    options: [
      { text: '🌗', explanation: 'Correct! The sequence is new, first quarter, full, last quarter.' },
      { text: '🌑', explanation: 'The sequence does not repeat new moon yet.' },
      { text: '🌒', explanation: 'Waxing crescent comes before first quarter.' },
      { text: '🌘', explanation: 'Waning crescent comes after last quarter.' },
    ],
    correct: 0,
  },
  {
    question: 'If you see a crescent moon, what shape is it?',
    options: [
      { text: 'A thin curve', explanation: 'Correct! A crescent moon looks like a thin curve or banana.' },
      { text: 'A square', explanation: 'The moon never looks like a square.' },
      { text: 'A triangle', explanation: 'The moon never looks like a triangle.' },
      { text: 'A star', explanation: 'Stars and moons are different shapes.' },
    ],
    correct: 0,
  },
  {
    question: 'What causes a lunar eclipse?',
    options: [
      { text: 'Earth blocks sunlight from reaching the moon', explanation: 'Correct! A lunar eclipse happens when Earth is between the sun and the moon.' },
      { text: 'The moon moves in front of the sun', explanation: 'That is a solar eclipse.' },
      { text: 'Clouds cover the moon', explanation: 'Clouds do not cause eclipses.' },
      { text: 'The moon spins faster', explanation: 'The moon\'s speed does not cause eclipses.' },
    ],
    correct: 0,
  },
  {
    question: 'Which direction does the moon orbit Earth?',
    options: [
      { text: 'West to east', explanation: 'Correct! The moon orbits Earth from west to east.' },
      { text: 'East to west', explanation: 'The moon appears to move east to west in the sky, but orbits west to east.' },
      { text: 'North to south', explanation: 'The moon does not orbit north to south.' },
      { text: 'South to north', explanation: 'The moon does not orbit south to north.' },
    ],
    correct: 0,
  },
  {
    question: 'What is the next number in this pattern: 1, 2, 4, 8, ...?',
    options: [
      { text: '10', explanation: 'The pattern is doubling: 1, 2, 4, 8, 16.' },
      { text: '12', explanation: 'The pattern is doubling: 1, 2, 4, 8, 16.' },
      { text: '16', explanation: 'Correct! The pattern is doubling: 1, 2, 4, 8, 16.' },
      { text: '20', explanation: 'The pattern is doubling: 1, 2, 4, 8, 16.' },
    ],
    correct: 2,
  },
  {
    question: 'Which of these is a pattern you might see in the sky?',
    options: [
      { text: 'Full moon every month', explanation: 'Correct! The full moon appears about once a month.' },
      { text: 'Stars forming a square', explanation: 'Stars form many shapes, but not a perfect square.' },
      { text: 'Clouds always in a line', explanation: 'Clouds move randomly, not always in a line.' },
      { text: 'The sun rising in the west', explanation: 'The sun rises in the east.' },
    ],
    correct: 0,
  },
  {
    question: 'What is a tide?',
    options: [
      { text: 'The rise and fall of ocean water', explanation: 'Correct! Tides are caused by the moon\'s gravity.' },
      { text: 'A type of moon phase', explanation: 'Tides are not moon phases.' },
      { text: 'A kind of eclipse', explanation: 'Tides are not eclipses.' },
      { text: 'A star pattern', explanation: 'Tides are not related to star patterns.' },
    ],
    correct: 0,
  },
  {
    question: 'Which symbol means "full moon"?',
    options: [
      { text: '🌕', explanation: 'Correct! This is the full moon symbol.' },
      { text: '🌑', explanation: 'This is the new moon symbol.' },
      { text: '🌓', explanation: 'This is the first quarter moon.' },
      { text: '🌗', explanation: 'This is the last quarter moon.' },
    ],
    correct: 0,
  },
  {
    question: 'If you see the moon during the day, is that normal?',
    options: [
      { text: 'Yes, sometimes the moon is visible in daylight', explanation: 'Correct! The moon can be seen during the day.' },
      { text: 'No, the moon only comes out at night', explanation: 'The moon can be visible during the day.' },
      { text: 'Only during an eclipse', explanation: 'The moon can be seen in the day even when there is no eclipse.' },
      { text: 'Only in winter', explanation: 'The moon can be seen in the day in any season.' },
    ],
    correct: 0,
  },
  {
    question: 'What is the next phase after Waxing Crescent?',
    options: [
      { text: 'First Quarter', explanation: 'Correct! Waxing Crescent is followed by First Quarter.' },
      { text: 'Full Moon', explanation: 'Full Moon comes later.' },
      { text: 'New Moon', explanation: 'New Moon comes before Waxing Crescent.' },
      { text: 'Waning Crescent', explanation: 'Waning Crescent comes after Last Quarter.' },
    ],
    correct: 0,
  },
  {
    question: 'If you face the moon and turn left, what direction are you facing?',
    options: [
      { text: 'East', explanation: 'If the moon is in the south, turning left faces east.' },
      { text: 'West', explanation: 'If the moon is in the south, turning right faces west.' },
      { text: 'North', explanation: 'If the moon is in the south, turning around faces north.' },
      { text: 'South', explanation: 'You started facing south.' },
    ],
    correct: 0,
  },
  {
    question: 'What is a "blue moon"?',
    options: [
      { text: 'A second full moon in one month', explanation: 'Correct! A blue moon is the second full moon in a calendar month.' },
      { text: 'A moon that looks blue', explanation: 'The moon rarely looks blue.' },
      { text: 'A new moon', explanation: 'A blue moon is not a new moon.' },
      { text: 'A moon during an eclipse', explanation: 'A blue moon is not related to eclipses.' },
    ],
    correct: 0,
  },
  {
    question: 'What is the next letter in this pattern: M, O, O, N, ...?',
    options: [
      { text: 'M', explanation: 'Correct! The pattern spells MOON repeatedly.' },
      { text: 'O', explanation: 'The next letter is M to start the word again.' },
      { text: 'N', explanation: 'The last letter was N.' },
      { text: 'P', explanation: 'The pattern is MOON, not MOONP.' },
    ],
    correct: 0,
  },
  {
    question: 'What is the next phase? 🌑 🌒 🌓 ...',
    options: [
      { text: '🌔', explanation: 'Correct! The sequence is new, waxing crescent, first quarter, waxing gibbous.' },
      { text: '🌕', explanation: 'Full moon comes after waxing gibbous.' },
      { text: '🌗', explanation: 'Last quarter comes later.' },
      { text: '🌘', explanation: 'Waning crescent comes much later.' },
    ],
    correct: 0,
  },
  {
    question: 'What is the main cause of moon phases?',
    options: [
      { text: 'The moon orbits Earth', explanation: 'Correct! The changing angles of sunlight as the moon orbits Earth cause the phases.' },
      { text: 'Clouds cover the moon', explanation: 'Clouds do not cause phases.' },
      { text: 'The moon changes shape', explanation: 'The moon never changes shape.' },
      { text: 'The sun moves around Earth', explanation: 'The sun does not orbit Earth.' },
    ],
    correct: 0,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'The Phases of the Moon for Kids',
    url: 'https://www.youtube.com/embed/Ie2WRraxdPs',
    thumbnail: '/images/science/s2_moon_magic/phases_thumbnail.jpg',
  },
  {
    title: 'Phases of the Moon: Astronomy and Space for Kids',
    url: 'https://www.youtube.com/embed/f4ZHdzl6ZWg',
    thumbnail: '/images/science/s2_moon_magic/astronomy_thumbnail.jpg',
  }
];

const mythVideos = [
  {
    title: 'Phases Of The Moon | Why Does The Moon Change Its Shape?',
    url: 'https://www.youtube.com/embed/BQvo7vyCmuE',
    thumbnail: '/images/science/s2_moon_magic/moon_change_thumbnail.jpg',
  }
];

// Define activity sections
const activitySections = [
  'Moon Phase Builder',
  'Orbit Explorer',
  'Flashlight Lab',
];
const sections = [
  'Warm-Up',
  'Introduction',
  'Myth to Bust',
  'Activities',
  'Wrap-Up',
];
const TOTAL_ACTIVITIES = activitySections.length;
const TOTAL_QUESTIONS = 24;

// Moon phase images for sequence (no flipping needed)
const moonPhases = [
  { name: 'New Moon', src: '/images/science/s2_moon_magic/moon-phases/new-moon.png' },
  { name: 'Waxing Crescent', src: '/images/science/s2_moon_magic/moon-phases/waxing-crescent.png' },
  { name: 'First Quarter', src: '/images/science/s2_moon_magic/moon-phases/first-quarter.png' },
  { name: 'Waxing Gibbous', src: '/images/science/s2_moon_magic/moon-phases/waxing-gibbous.png' },
  { name: 'Full Moon', src: '/images/science/s2_moon_magic/moon-phases/full-moon.png' },
  { name: 'Waning Gibbous', src: '/images/science/s2_moon_magic/moon-phases/waning-gibbous.png' },
  { name: 'Last Quarter', src: '/images/science/s2_moon_magic/moon-phases/last-quarter.png' },
  { name: 'Waning Crescent', src: '/images/science/s2_moon_magic/moon-phases/waning-crescent.png' },
];

const S2_MoonMagicExplorer: React.FC = () => {
  const [section, setSection] = useState<number>(0);
  const [warmupIndex, setWarmupIndex] = useState<number>(0);
  const [warmupAnswered, setWarmupAnswered] = useState<boolean>(false);
  const [warmupCorrect, setWarmupCorrect] = useState<boolean>(false);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [activityIndex, setActivityIndex] = useState(0);
  const [activitiesCompleted, setActivitiesCompleted] = useState(0);
  const [showFullscreen, setShowFullscreen] = useState(false);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // Activity 1: Moon Phase Builder
  const [placedPhases, setPlacedPhases] = useState<{[key: string]: string}>({});
  const [phasesCorrect, setPhasesCorrect] = useState<number>(0);
  const [showOrbitAnimation, setShowOrbitAnimation] = useState<boolean>(false);
  const [feedbackEffect, setFeedbackEffect] = useState<{zoneIndex: number | null, isCorrect: boolean}>({zoneIndex: null, isCorrect: false});
  
  // Activity 2: Orbit Explorer (Memory Game)
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCards, setMatchedCards] = useState<number[]>([]);
  const [shuffledCards, setShuffledCards] = useState<any[]>([]);
  
  // Activity 3: Flashlight Lab
  const [moonAngle, setMoonAngle] = useState<number>(0);
  const [flashlightPosition, setFlashlightPosition] = useState({ x: -100, y: 0 });
  const [isDraggingLight, setIsDraggingLight] = useState(false);

  // Add new state variables for the enhanced Flashlight Lab
  const [isAutoOrbit, setIsAutoOrbit] = useState<boolean>(true);
  const [showFlashlightPhaseName, setShowFlashlightPhaseName] = useState<boolean>(false);
  const [moonOrbitAngle, setMoonOrbitAngle] = useState<number>(0);
  const [isDraggingMoon, setIsDraggingMoon] = useState<boolean>(false);

  // Add state for lock-on-moon
  const [lockOnMoon, setLockOnMoon] = useState(false);

  // Section bar and progress bar logic
  const sectionLabels = sections;

  // Warm-Up Quiz logic
  const warmupQ = warmupQuestions[warmupIndex];
  const handleWarmupAnswer = (idx: number) => {
    if (warmupAnswered || showExplanation) return;
    setSelectedOption(idx);
    setShowExplanation(true);
    setWarmupAnswered(true);
    if (idx === warmupQ.correct) {
      setWarmupCorrect(true);
      setQuestionsCompleted((prev) => prev + 1);
      setTimeout(() => {
        setShowExplanation(false);
        setWarmupAnswered(false);
        setSelectedOption(null);
        if (warmupIndex === warmupQuestions.length - 1) {
          setSection(section + 1);
        } else {
          setWarmupIndex(warmupIndex + 1);
          setWarmupCorrect(false);
        }
      }, 1000);
    } else {
      setWarmupCorrect(false);
    }
  };

  const handleDismissExplanation = () => {
    setShowExplanation(false);
    setWarmupAnswered(false);
    setSelectedOption(null);
  };

  // Navigation
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

  // Mark activity as complete (call this in each activity when done)
  const handleActivityComplete = () => {
    setActivitiesCompleted((prev) => Math.min(prev + 1, TOTAL_ACTIVITIES));
  };

  // For Activity 1: Reset drop zones when activity changes
  useEffect(() => {
    if (activityIndex === 0 && section === 3) {
      setPlacedPhases({});
      setPhasesCorrect(0);
      setShowOrbitAnimation(false);
    }
  }, [activityIndex, section]);
  
  // Create memory cards from moon phases
  const createMemoryCards = () => {
    const cards = [];
    // Add image cards
    moonPhases.forEach(phase => {
      cards.push({
        type: 'image',
        value: phase.name,
        src: phase.src
      });
    });
    
    // Add text cards
    moonPhases.forEach(phase => {
      cards.push({
        type: 'text',
        value: phase.name,
        label: phase.name
      });
    });
    
    return shuffleArray(cards);
  };
  
  // For Activity 2: Initialize memory card game when it's selected
  useEffect(() => {
    if (activityIndex === 1 && section === 3) {
      const cards = createMemoryCards();
      setShuffledCards(cards);
      setFlippedCards([]);
      setMatchedCards([]);
    }
  }, [activityIndex, section]);
  
  // For Activity 3: Reset flashlight position when activity changes
  useEffect(() => {
    if (activityIndex === 2 && section === 3) {
      setFlashlightPosition({ x: -100, y: 0 });
      setMoonAngle(0);
    }
  }, [activityIndex, section]);
  
  // Helper function to shuffle array for memory card game
  const shuffleArray = (array: any[]) => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };
  
  // Sound effects hook
  const { playSound } = useSound();
  
  // Activity 1: Moon Phase Builder logic
  const handlePhaseDropped = (e: React.DragEvent, zoneIndex: number) => {
    e.preventDefault();
    const phaseIndex = parseInt(e.dataTransfer.getData('phaseIndex'));
    
    // Create a copy of existing placements
    const newPlaced = { ...placedPhases };
    newPlaced[`phase-${phaseIndex}`] = `zone-${zoneIndex}`;
    setPlacedPhases(newPlaced);
    
    // Check if this placement is correct (phase index matches zone index)
    const isCorrect = phaseIndex === zoneIndex;
    
    // Show feedback effect
    setFeedbackEffect({zoneIndex, isCorrect});
    
    // Play appropriate sound
    if (isCorrect) {
      // Use the correct-6033.mp3 file which is confirmed to exist
      const correctSound = new Audio('/audio/correct-6033.mp3');
      correctSound.volume = 0.5;
      correctSound.play().catch(e => console.error("Error playing sound:", e));
    } else {
      const incorrectSound = new Audio('/audio/incorrect.mp3');
      incorrectSound.volume = 0.5;
      incorrectSound.play().catch(e => console.error("Error playing sound:", e));
    }
    
    // Reset feedback after animation completes
    setTimeout(() => {
      setFeedbackEffect({zoneIndex: null, isCorrect: false});
    }, 1000);
    
    // Update correct placements count if correct
    if (isCorrect) {
      const newCorrectCount = phasesCorrect + 1;
      setPhasesCorrect(newCorrectCount);
      
      // Check if all 8 phases are correctly placed
      if (newCorrectCount >= moonPhases.length) {
        setTimeout(() => {
          // Play celebratory sound directly
          const winSound = new Audio('/audio/win.mp3');
          winSound.volume = 0.6;
          winSound.play().catch(e => console.error("Error playing win sound:", e));
          
          setShowOrbitAnimation(true);
          
          // Mark the activity as complete
          setTimeout(() => handleActivityComplete(), 2000);
        }, 1000);
      }
    }
  };
  
  // Activity 2: Orbit Explorer (Memory Game) logic
  const handleCardFlip = (index: number) => {
    // Don't flip if already matched or if we already have 2 flipped cards
    if (matchedCards.includes(index) || flippedCards.length >= 2) return;
    
    // Add this card to flipped cards
    const newFlipped = [...flippedCards, index];
    setFlippedCards(newFlipped);
    
    // If we now have 2 cards, check for a match
    if (newFlipped.length === 2) {
      const [first, second] = newFlipped;
      const firstCard = shuffledCards[first];
      const secondCard = shuffledCards[second];
      
      // Check if the values match (and they're different card types)
      if (firstCard.value === secondCard.value && firstCard.type !== secondCard.type) {
        // It's a match!
        setMatchedCards(prev => [...prev, first, second]);
        
        // Clear flipped cards after a short delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 500);
        
        // Check if all cards are matched
        if (matchedCards.length + 2 >= shuffledCards.length) {
          // Mark the activity as complete
          setTimeout(() => handleActivityComplete(), 1000);
        }
      } else {
        // Not a match, flip back after a delay
        setTimeout(() => {
          setFlippedCards([]);
        }, 1500);
      }
    }
  };
  
  // Function to handle moon dragging in orbit
  const handleMoonDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingMoon || isAutoOrbit) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    // Calculate angle from center
    const angle = Math.atan2(y, x) * (180 / Math.PI);
    setMoonOrbitAngle(angle);
  };

  // Auto orbit animation effect
  useEffect(() => {
    let animationFrame: number;
    
    if (isAutoOrbit && activityIndex === 2) {
      const animate = () => {
        setMoonOrbitAngle(prev => (prev + 0.2) % 360);
        animationFrame = requestAnimationFrame(animate);
      };
      
      animationFrame = requestAnimationFrame(animate);
    }
    
    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame);
      }
    };
  }, [isAutoOrbit, activityIndex]);

  // Enhanced flashlight lab
  const handleEnhancedFlashlightMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDraggingLight) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const x = e.clientX - rect.left - centerX;
    const y = e.clientY - rect.top - centerY;
    
    setFlashlightPosition({ x, y });
    
    // Calculate the angle based on position
    const angle = Math.atan2(y, -x) * (180 / Math.PI);
    setMoonAngle(angle);
    
    // Mark activity as complete after some movement
    const distanceFromStart = Math.sqrt(
      Math.pow(x - (-100), 2) + Math.pow(y - 0, 2)
    );
    if (distanceFromStart > 150) {
      handleActivityComplete();
    }
  };

  // Function to get moon phase name based on angle
  const getMoonPhaseName = (angle: number): string => {
    const normalizedAngle = ((angle % 360) + 360) % 360;
    if (normalizedAngle >= 0 && normalizedAngle < 22.5) return 'New Moon';
    if (normalizedAngle >= 22.5 && normalizedAngle < 67.5) return 'Waxing Crescent';
    if (normalizedAngle >= 67.5 && normalizedAngle < 112.5) return 'First Quarter';
    if (normalizedAngle >= 112.5 && normalizedAngle < 157.5) return 'Waxing Gibbous';
    if (normalizedAngle >= 157.5 && normalizedAngle < 202.5) return 'Full Moon';
    if (normalizedAngle >= 202.5 && normalizedAngle < 247.5) return 'Waning Gibbous';
    if (normalizedAngle >= 247.5 && normalizedAngle < 292.5) return 'Last Quarter';
    return 'Waning Crescent';
  };

  // Improved state variables for moon panel position and size
  const [moonPanelPosition, setMoonPanelPosition] = useState<{x: number, y: number}>({x: 0, y: 0});
  const [isDraggingPanel, setIsDraggingPanel] = useState<boolean>(false);
  const [moonPanelSize, setMoonPanelSize] = useState<string>("medium"); // small, medium, large
  const moonPanelRef = useRef<HTMLDivElement>(null);

  // Function to toggle panel size
  const togglePanelSize = () => {
    const sizes = ["small", "medium", "large"];
    const currentIndex = sizes.indexOf(moonPanelSize);
    const nextIndex = (currentIndex + 1) % sizes.length;
    setMoonPanelSize(sizes[nextIndex]);
  };

  // Improved dragging function with boundary checks and fixed direction
  const handleMoonPanelDrag = useCallback((e: MouseEvent) => {
    if (isDraggingPanel && moonPanelRef.current) {
      // Calculate new position (note: no inversion here)
      const newX = moonPanelPosition.x + e.movementX;
      const newY = moonPanelPosition.y - e.movementY; // Invert Y movement to match expected direction
      
      // Get window dimensions
      const windowWidth = window.innerWidth;
      const windowHeight = window.innerHeight;
      
      // Get panel dimensions
      const panelWidth = moonPanelRef.current.offsetWidth;
      const panelHeight = moonPanelRef.current.offsetHeight;
      
      // Calculate boundaries (keep at least 20% of the panel visible)
      const minX = -(windowWidth / 2) + (panelWidth * 0.2);
      const maxX = (windowWidth / 2) - (panelWidth * 0.2);
      const minY = -(windowHeight - 100) + (panelHeight * 0.2);
      const maxY = windowHeight - 150;
      
      // Apply boundaries
      const boundedX = Math.min(Math.max(newX, minX), maxX);
      const boundedY = Math.min(Math.max(newY, minY), maxY);
      
      setMoonPanelPosition({
        x: boundedX,
        y: boundedY
      });
    }
  }, [isDraggingPanel, moonPanelPosition]);

  // Set up global mouse event listeners for smoother dragging
  useEffect(() => {
    if (isDraggingPanel) {
      window.addEventListener('mousemove', handleMoonPanelDrag);
      window.addEventListener('mouseup', () => setIsDraggingPanel(false));
    }
    
    return () => {
      window.removeEventListener('mousemove', handleMoonPanelDrag);
      window.removeEventListener('mouseup', () => setIsDraggingPanel(false));
    };
  }, [isDraggingPanel, handleMoonPanelDrag]);

  // Add state for showing phase names
  const [showPhaseNames, setShowPhaseNames] = useState<boolean>(false);

  // Add this useEffect to inject the required animation styles
  useEffect(() => {
    // Create style element for animations
    const style = document.createElement('style');
    style.id = 'moon-animations';
    
    // Add animation keyframes
    style.innerHTML = `
      @keyframes spin-very-slow {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
      
      @keyframes fade-in {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes twinkle {
        0% { opacity: 0.3; }
        100% { opacity: 1; }
      }
      
      .animate-spin-very-slow {
        animation: spin-very-slow 120s linear infinite;
      }
      
      .animate-fade-in {
        animation: fade-in 0.5s ease-in-out forwards;
      }
    `;
    
    // Add to document
    document.head.appendChild(style);
    
    // Clean up
    return () => {
      const existingStyle = document.getElementById('moon-animations');
      if (existingStyle) {
        existingStyle.remove();
      }
    };
  }, []);

  // Make sure the Flashlight Lab is initialized with proper values
  useEffect(() => {
    if (activityIndex === 2) {
      // Reset flashlight and moon positions
      setFlashlightPosition({ x: 100, y: 0 });
      setMoonOrbitAngle(0);
      setMoonAngle(0);
    }
  }, [activityIndex]);

  // Calculate the angle to the moon if lockOnMoon is enabled
  const getFlashlightAngle = () => {
    if (!lockOnMoon) {
      return Math.atan2(0 - flashlightPosition.y, 0 - flashlightPosition.x) * (180 / Math.PI);
    }
    // Calculate moon's position relative to flashlight
    const moonX = Math.cos(moonOrbitAngle * Math.PI / 180) * 200;
    const moonY = Math.sin(moonOrbitAngle * Math.PI / 180) * 200;
    return Math.atan2(moonY - flashlightPosition.y, moonX - flashlightPosition.x) * (180 / Math.PI);
  };
  const flashlightAngle = getFlashlightAngle();

  const activityTabs = [
    {
      label: 'Moon Phase Builder',
      content: (
                <div className="space-y-6">
                  <div className="font-bold text-lg mb-2">Drag and place all 8 moon phases around the Earth in correct order!</div>
                  
                  {/* Toggle for moon phase names */}
                  <div className="flex justify-center mb-4">
                    <button
                      onClick={() => setShowPhaseNames(!showPhaseNames)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        showPhaseNames ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>🔤</span> 
                      <span>{showPhaseNames ? 'Hide Phase Names' : 'Show Phase Names'}</span>
                    </button>
                  </div>
                  
                  <GameCanvas height="min-h-[600px]">
                    <div className="relative w-full h-full flex items-center justify-center">
                      <div className="relative w-[500px] h-[500px]">
                        {/* Earth in center */}
                        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                          <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                            <img 
                              src="/images/shapes/earth-icon.png" 
                              alt="Earth"
                              className="w-full h-full object-cover"
                              onError={(e) => {
                                // Fallback if image doesn't exist
                                e.currentTarget.onerror = null;
                                e.currentTarget.parentElement!.className = "w-32 h-32 rounded-full bg-blue-500 border-4 border-blue-600 shadow-lg flex items-center justify-center";
                                e.currentTarget.parentElement!.innerHTML = "<span class='text-white font-bold'>Earth</span>";
                              }}
                            />
                            
                            {/* Stickman Viewer - positioned at bottom-right of Earth */}
                            <div className="absolute bottom-0 right-0 w-8 h-8 z-20">
                              <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                <circle cx="12" cy="7" r="4" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
                                <path d="M12 11v7M8 15h8M9 23l3-4M15 23l-3-4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                              </svg>
                            </div>
                          </div>
                          
                          {/* Waxing/Waning Labels */}
                          <div className="absolute -left-20 top-1/2 transform -translate-y-1/2 text-xs font-bold text-indigo-700">
                            Waxing ⟶
                          </div>
                          <div className="absolute -right-20 top-1/2 transform -translate-y-1/2 text-xs font-bold text-indigo-700">
                            ⟵ Waning
                          </div>
                        </div>
                        
                        {/* Moon phase drop zones - without orbit circle */}
                        {[...Array(8)].map((_, index) => {
                          // Calculate position around the circle
                          const angle = (index * 45) * (Math.PI / 180);
                          const x = 250 * Math.sin(angle);
                          const y = -250 * Math.cos(angle);
                          
                          // Determine if this zone has feedback effects
                          const hasFeedback = feedbackEffect.zoneIndex === index;
                          const feedbackClass = hasFeedback 
                            ? feedbackEffect.isCorrect 
                              ? 'correct-drop ring-4 ring-green-500 scale-110' 
                              : 'wrong-drop ring-4 ring-red-500'
                            : '';
                          
                          return (
                            <div
                              key={`zone-${index}`}
                              className="absolute"
                              style={{
                                left: `calc(50% + ${x}px)`,
                                top: `calc(50% + ${y}px)`,
                                transform: 'translate(-50%, -50%)'
                              }}
                              onDragOver={(e) => e.preventDefault()}
                              onDrop={(e) => handlePhaseDropped(e, index)}
                            >
                              <div className={`w-16 h-16 rounded-full border-2 border-gray-300 flex items-center justify-center bg-white/30 transition-all duration-300 ${feedbackClass}`}>
                                {placedPhases[`phase-${index}`] && (
                                  <img 
                                    src={moonPhases[index].src}
                                    alt={moonPhases[index].name}
                                    className="w-full h-full object-contain p-0.5"
                                  />
                                )}
                              </div>
                              
                              {/* Phase name label - conditionally shown */}
                              {(showPhaseNames && placedPhases[`phase-${index}`]) && (
                                <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                                  <span className="bg-white/80 px-2 py-0.5 rounded text-xs font-bold text-indigo-800 whitespace-nowrap">
                                    {moonPhases[index].name}
                                  </span>
                                </div>
                              )}
                            </div>
                          );
                        })}
                        
                        {/* Success animation - without orbit circle */}
                        {showOrbitAnimation && (
                          <div className="absolute inset-0 z-20 flex items-center justify-center">
                            <div className="animate-spin-slow w-[500px] h-[500px] rounded-full">
                              {moonPhases.map((phase, index) => {
                                // Calculate position around the circle for animation
                                const angle = (index * 45) * (Math.PI / 180);
                                const x = 250 * Math.sin(angle);
                                const y = -250 * Math.cos(angle);
                                
                                return (
                                  <div
                                    key={`anim-${index}`}
                                    className="absolute w-16 h-16"
                                    style={{
                                      left: `${x + 250}px`,
                                      top: `${y + 250}px`,
                                      transform: 'translate(-50%, -50%)'
                                    }}
                                  >
                                    <img
                                      src={phase.src}
                                      alt={phase.name}
                                      className="w-full h-full object-contain"
                                    />
                                    
                                    {/* Phase name label in animation - conditionally shown */}
                                    {showPhaseNames && (
                                      <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-1 text-center">
                                        <span className="bg-white/80 px-2 py-0.5 rounded text-xs font-bold text-indigo-800 whitespace-nowrap">
                                          {phase.name}
                                        </span>
                                      </div>
                                    )}
                                  </div>
                                );
                              })}
                            </div>
                            
                            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10">
                              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-blue-600 shadow-lg">
                                <img 
                                  src="/images/shapes/earth-icon.png" 
                                  alt="Earth"
                                  className="w-full h-full object-cover"
                                  onError={(e) => {
                                    // Fallback if image doesn't exist
                                    e.currentTarget.onerror = null;
                                    e.currentTarget.parentElement!.className = "w-32 h-32 rounded-full bg-blue-500 border-4 border-blue-600 shadow-lg flex items-center justify-center";
                                    e.currentTarget.parentElement!.innerHTML = "<span class='text-white font-bold'>Earth</span>";
                                  }}
                                />
                                
                                {/* Stickman Viewer in animation */}
                                <div className="absolute bottom-0 right-0 w-8 h-8 z-20">
                                  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                                    <circle cx="12" cy="7" r="4" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
                                    <path d="M12 11v7M8 15h8M9 23l3-4M15 23l-3-4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                                  </svg>
                                </div>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                      
                      {/* Moon phases to drag */}
                      <div 
                        ref={moonPanelRef}
                        className="fixed z-50"
                        style={{ 
                          bottom: `${50 + moonPanelPosition.y}px`, 
                          left: `${50 + moonPanelPosition.x}px`, 
                          transform: 'translate(-50%, 0)',
                          cursor: isDraggingPanel ? 'grabbing' : 'move'
                        }}
                      >
                        <div 
                          className={`bg-indigo-50/90 p-4 pt-8 rounded-xl shadow-lg border-2 border-blue-200 ${
                            moonPanelSize === "small" ? "w-64" : 
                            moonPanelSize === "large" ? "w-[32rem]" : "w-96"
                          }`}
                          onMouseDown={(e) => {
                            // Only start dragging if clicking on the container or handle, not on moon phases
                            if (e.target === e.currentTarget || (e.target as HTMLElement).closest('.drag-handle')) {
                              e.preventDefault(); // Prevent text selection during drag
                              setIsDraggingPanel(true);
                            }
                          }}
                        >
                          {/* Drag handle with size toggle */}
                          <div className="absolute top-0 left-0 right-0 h-8 bg-blue-200 rounded-t-xl flex items-center justify-between px-3 cursor-move drag-handle">
                            <div className="flex items-center space-x-2">
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                              <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
                            </div>
                            
                            <div className="text-xs text-blue-700 font-bold">Drag me</div>
                            
                            {/* Size toggle button */}
                            <button 
                              onClick={togglePanelSize}
                              className="bg-blue-300 hover:bg-blue-400 text-blue-800 px-2 py-1 rounded text-xs"
                            >
                              {moonPanelSize === "small" ? "Size: S" : 
                               moonPanelSize === "medium" ? "Size: M" : "Size: L"}
                            </button>
                          </div>
                          
                          {/* Moon phases - responsive grid based on size */}
                          <div className={`flex flex-wrap justify-center gap-2 ${
                            moonPanelSize === "small" ? "max-w-xs" : 
                            moonPanelSize === "large" ? "max-w-3xl" : "max-w-xl"
                          }`}>
                            {moonPhases.map((phase, index) => (
                              <div
                                key={`phase-${index}`}
                                draggable
                                onDragStart={(e) => {
                                  e.dataTransfer.setData('phaseIndex', index.toString());
                                  // Play click sound directly
                                  const clickSound = new Audio('/audio/click.mp3');
                                  clickSound.volume = 0.3;
                                  clickSound.play().catch(e => console.error("Error playing click sound:", e));
                                }}
                                className={`rounded-full bg-white border-2 border-gray-300 hover:border-blue-500 p-1 cursor-grab hover:shadow-lg transition-all m-1 ${
                                  moonPanelSize === "small" ? "w-12 h-12" : 
                                  moonPanelSize === "large" ? "w-20 h-20" : "w-16 h-16"
                                }`}
                              >
                                <img
                                  src={phase.src}
                                  alt={phase.name}
                                  className="w-full h-full object-contain"
                                  draggable="false"
                                />
                              </div>
                            ))}
                            
                            {/* Show phase names in the panel if toggle is on */}
                            {showPhaseNames && (
                              <div className="w-full mt-2 pt-2 border-t border-blue-200">
                                <div className="text-xs font-bold text-center mb-1">Moon Phase Names:</div>
                                <div className="grid grid-cols-4 gap-1 text-center">
                                  {moonPhases.map((phase, index) => (
                                    <div key={`name-${index}`} className="text-xs bg-white/70 rounded px-1 py-0.5">
                                      {phase.name}
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </GameCanvas>
                  
                  {phasesCorrect === 8 && !showOrbitAnimation && (
                    <div className="text-center text-green-600 font-bold text-xl">
                      Great job! You've correctly placed all moon phases!
                    </div>
                  )}
                  
                  {showOrbitAnimation && (
                    <div className="text-center text-green-600 font-bold text-xl">
                      Amazing! Watch the moon orbit around Earth!
                    </div>
                  )}
                </div>
      )
    },
    {
      label: 'Orbit Explorer',
      content: (
                <div className="space-y-6">
                  <div className="font-bold text-lg mb-2">Match the moon phase name to its image to explore the orbit!</div>
                  
                  <GameCanvas height="min-h-[500px]">
                    <div className="grid grid-cols-4 gap-4 p-4">
                      {shuffledCards.length > 0 && shuffledCards.map((card, index) => (
                        <div 
                          key={index} 
                          className="relative h-24 w-full cursor-pointer perspective-500"
                          onClick={() => handleCardFlip(index)}
                        >
                          <div 
                            className={`relative w-full h-full transition-all duration-300 transform-style-3d ${
                              flippedCards.includes(index) || matchedCards.includes(index) ? 'rotate-y-180' : ''
                            }`}
                          >
                            {/* Card back */}
                            <div 
                              className="absolute w-full h-full backface-hidden bg-indigo-600 rounded-xl flex items-center justify-center text-white font-bold text-2xl border-4 border-indigo-700"
                            >
                              ?
                            </div>
                            
                            {/* Card front */}
                            <div 
                              className={`absolute w-full h-full backface-hidden bg-white rounded-xl border-4 flex items-center justify-center rotate-y-180 ${
                                matchedCards.includes(index) ? 'border-green-500' : 'border-gray-300'
                              }`}
                            >
                              {card.type === 'image' ? (
                                <div className="w-full h-full p-1">
                                  <img 
                                    src={card.src} 
                                    alt={card.value} 
                                    className="w-full h-full object-contain" 
                                  />
                                </div>
                              ) : (
                                <div className="text-center p-2">
                                  <span className="font-bold text-base">{card.label}</span>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </GameCanvas>
                  
                  {matchedCards.length === shuffledCards.length && (
                    <>
                      <div className="text-center text-green-600 font-bold text-xl">
                        Amazing job! You've matched all the moon phases!
                      </div>
                      <ConfettiEffect />
                    </>
                  )}
                  
                  <div className="bg-blue-50 rounded-xl p-4 shadow-inner">
                    <h3 className="font-bold mb-2">Moon Phase Names</h3>
                    <div className="grid grid-cols-4 gap-2">
                      {moonPhases.map((phase, index) => (
                        <div key={index} className="text-center">
                          <div className="text-xs font-medium">{phase.name}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
      )
    },
    {
      label: 'Flashlight Lab',
      content: (
                <div className="space-y-6">
                  <div className="font-bold text-lg mb-2">Move the flashlight around to see moon phases appear!</div>
                  
                  <div className="flex justify-center gap-4 mb-4">
                    {/* Toggle for auto orbit */}
                    <button
                      onClick={() => setIsAutoOrbit(!isAutoOrbit)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        isAutoOrbit ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>{isAutoOrbit ? '🛑 Pause Orbit' : '🖐 Move Moon Yourself'}</span>
                    </button>
                    
                    {/* Toggle for phase names */}
                    <button
                      onClick={() => setShowFlashlightPhaseName(!showFlashlightPhaseName)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        showFlashlightPhaseName ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>👁 {showFlashlightPhaseName ? 'Hide Phase Name' : 'Show Phase Name'}</span>
                    </button>
                    
                    {/* Toggle for lock on moon */}
                    <button
                      onClick={() => setLockOnMoon((v) => !v)}
                      className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${
                        lockOnMoon ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-700'
                      }`}
                    >
                      <span>🔒 {lockOnMoon ? 'Lock on Moon' : 'Free Aim'}</span>
                    </button>
                  </div>
                  
                  <div 
                    className="relative w-full h-[600px] bg-blue-50 overflow-hidden rounded-lg border border-gray-300"
                    onMouseMove={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const x = e.clientX - rect.left - rect.width / 2;
                      const y = e.clientY - rect.top - rect.height / 2;
                      
                      if (isDraggingLight) {
                        setFlashlightPosition({ x, y });
                        // Calculate angle for moon shadow
                        const angle = Math.atan2(y, -x) * (180 / Math.PI);
                        setMoonAngle(angle);
                      }
                      
                      if (isDraggingMoon && !isAutoOrbit) {
                        const angle = Math.atan2(y, x) * (180 / Math.PI);
                        setMoonOrbitAngle(angle);
                      }
                    }}
                    onMouseDown={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const centerX = rect.width / 2;
                      const centerY = rect.height / 2;
                      const x = e.clientX - rect.left;
                      const y = e.clientY - rect.top;
                      
                      // Check if clicking near flashlight
                      const flashlightX = centerX + flashlightPosition.x;
                      const flashlightY = centerY + flashlightPosition.y;
                      const distToFlashlight = Math.sqrt(
                        Math.pow(x - flashlightX, 2) + Math.pow(y - flashlightY, 2)
                      );
                      
                      // Check if clicking near moon
                      const moonX = centerX + Math.cos(moonOrbitAngle * Math.PI / 180) * 200;
                      const moonY = centerY + Math.sin(moonOrbitAngle * Math.PI / 180) * 200;
                      const distToMoon = Math.sqrt(
                        Math.pow(x - moonX, 2) + Math.pow(y - moonY, 2)
                      );
                      
                      if (distToFlashlight < 40) {
                        setIsDraggingLight(true);
                      } else if (distToMoon < 30 && !isAutoOrbit) {
                        setIsDraggingMoon(true);
                      }
                    }}
                    onMouseUp={() => {
                      setIsDraggingLight(false);
                      setIsDraggingMoon(false);
                    }}
                    onMouseLeave={() => {
                      setIsDraggingLight(false);
                      setIsDraggingMoon(false);
                    }}
                  >
                    {/* Stars */}
                    {[...Array(50)].map((_, i) => (
                      <div
                        key={i}
                        className="absolute bg-white rounded-full"
                        style={{
                          width: Math.random() * 2 + 1,
                          height: Math.random() * 2 + 1,
                          top: `${Math.random() * 100}%`,
                          left: `${Math.random() * 100}%`,
                          opacity: Math.random() * 0.5 + 0.3
                        }}
                      />
                    ))}
                    
                    {/* Earth */}
                    <div 
                      className="absolute top-1/2 left-1/2 w-40 h-40 rounded-full bg-blue-500 border-4 border-blue-600 shadow-lg transform -translate-x-1/2 -translate-y-1/2 z-30"
                      style={{
                        backgroundImage: "url('/images/shapes/earth-icon.png')",
                        backgroundSize: "cover",
                        backgroundPosition: "center"
                      }}
                    >
                      {/* Stickman */}
                      <div className="absolute bottom-2 right-2 w-10 h-10 z-40">
                        <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
                          <circle cx="12" cy="7" r="4" fill="#FFD700" stroke="#000000" strokeWidth="1.5" />
                          <path d="M12 11v7M8 15h8M9 23l3-4M15 23l-3-4" stroke="#000000" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                    
                    {/* Orbit path */}
                    <div className="absolute top-1/2 left-1/2 w-[400px] h-[400px] rounded-full border border-gray-300 border-dashed transform -translate-x-1/2 -translate-y-1/2"></div>
                    
                    {/* Waxing/Waning Labels */}
                    <div className="absolute left-[20%] top-1/2 transform -translate-y-1/2 text-xs font-bold text-indigo-700">
                      Waxing ⟶
                    </div>
                    <div className="absolute right-[20%] top-1/2 transform -translate-y-1/2 text-xs font-bold text-indigo-700">
                      ⟵ Waning
                    </div>
                    
                    {/* Moon */}
                    <div 
                      className="absolute w-24 h-24 z-20"
                      style={{
                        left: `calc(50% + ${Math.cos(moonOrbitAngle * Math.PI / 180) * 200}px)`,
                        top: `calc(50% + ${Math.sin(moonOrbitAngle * Math.PI / 180) * 200}px)`,
                        transform: 'translate(-50%, -50%)'
                      }}
                    >
                      <div className="relative w-full h-full rounded-full bg-gray-200 border-2 border-gray-300 overflow-hidden">
                        {/* Moon shadow */}
                        <div 
                          className="absolute inset-0"
                          style={{
                            background: 'linear-gradient(90deg, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)',
                            transform: `rotate(${moonAngle}deg)`
                          }}
                        ></div>
                        
                        {/* Moon craters */}
                        <div className="absolute w-4 h-4 rounded-full bg-gray-300" style={{ top: '20%', left: '30%' }}></div>
                        <div className="absolute w-3 h-3 rounded-full bg-gray-300" style={{ top: '60%', left: '70%' }}></div>
                        <div className="absolute w-5 h-5 rounded-full bg-gray-300" style={{ top: '40%', left: '50%' }}></div>
                      </div>
                      
                      {/* Moon phase name */}
                      {showFlashlightPhaseName && (
                        <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 bg-white px-2 py-1 rounded-full text-xs font-bold text-indigo-800 shadow-md">
                          {getMoonPhaseName(moonAngle)}
                        </div>
                      )}
                    </div>
                    
                    {/* Flashlight - image and beam, both locked and aligned */}
                    <div
                      className="absolute z-40"
                      style={{
                        width: '100px',
                        height: '100px',
                        left: `calc(50% + ${flashlightPosition.x}px)`,
                        top: `calc(50% + ${flashlightPosition.y}px)`,
                        transform: 'translate(-50%, -50%)',
                        cursor: isDraggingLight ? 'grabbing' : 'grab',
                        pointerEvents: 'auto',
                      }}
                    >
                      {/* Beam and flashlight image are both rotated together */}
                      <div style={{
                        position: 'absolute',
                        width: '100px',
                        height: '100px',
                        left: 0,
                        top: 0,
                        pointerEvents: 'none',
                        transform: `rotate(${flashlightAngle + 90}deg)`,
                        zIndex: 35,
                      }}>
                        {/* Flashlight image only, beam removed */}
                        <img
                          src="/images/science/s2_moon_magic/flashlight.png"
                          alt="Flashlight"
                          style={{
                            position: 'absolute',
                            width: '100px',
                            height: '100px',
                            left: 0,
                            top: 0,
                            objectFit: 'contain',
                            pointerEvents: 'auto',
                          }}
                          onError={(e) => {
                            e.currentTarget.onerror = null;
                            e.currentTarget.style.display = 'none';
                            e.currentTarget.parentElement!.innerHTML = `
                              <div class=\"w-full h-full bg-gray-700 rounded-full border-2 border-yellow-500 flex items-center justify-center\">
                                <div class=\"w-10 h-10 bg-yellow-400 rounded-full\"></div>
                                <div class=\"absolute w-6 h-12 bg-gray-600 bottom-0 left-1/2 transform -translate-x-1/2 translate-y-3/4 rounded-b-lg border-2 border-t-0 border-yellow-500\"></div>
                              </div>
                            `;
                          }}
                        />
                      </div>
                    </div>
                    
                    {/* Instructions */}
                    <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 bg-white px-4 py-2 rounded-lg shadow-lg text-sm text-center max-w-md">
                      <p className="font-bold text-indigo-800">Drag the flashlight to see how sunlight creates moon phases!</p>
                      <p className="text-xs text-gray-600 mt-1">The Moon doesn't make its own light - it reflects the Sun's light.</p>
                    </div>
                  </div>
                  
                  <div className="bg-blue-50 rounded-xl p-4 shadow-inner">
                    <h3 className="font-bold mb-2">How Moon Phases Work</h3>
                    <p className="text-sm">The Moon doesn't make its own light! It reflects sunlight. As the Moon orbits Earth, we see different amounts of the sunlit side, creating the phases we observe from Earth.</p>
                    <p className="text-sm mt-2">
                      <span className="font-bold">Waxing</span> (growing): Light on the right side of the Moon.<br/>
                      <span className="font-bold">Waning</span> (shrinking): Light on the left side of the Moon.
                    </p>
                  </div>
                </div>
      )
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-2 sm:px-6">
        {/* Section Bar (now global) */}
        <ProgressBarSection sectionLabels={sections} currentSection={section} onSectionChange={setSection} />
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
              <QuizQuestions questions={warmupQuestions} onComplete={() => setSection(section + 1)} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <div className="flex gap-4 mb-4">
                  {moonPhases.map((phase, i) => (
                    <div key={i} className="flex flex-col items-center">
                      <img src={phase.src} alt={phase.name} className="w-14 h-14 rounded-full border border-gray-300 bg-gray-100 cursor-zoom-in" onClick={() => setFullscreenImage(phase.src)} />
                      <span className="text-xs mt-1 text-center w-16 font-medium">{phase.name}</span>
                    </div>
                  ))}
                  <div className="flex flex-col items-center">
                    <img src={moonPhases[0].src} alt={moonPhases[0].name} className="w-14 h-14 rounded-full border border-gray-300 bg-gray-100 cursor-zoom-in" onClick={() => setFullscreenImage(moonPhases[0].src)} />
                    <span className="text-xs mt-1 text-center w-16 font-medium">{moonPhases[0].name}</span>
                  </div>
                </div>
                <div className="text-xl font-semibold mt-2 mb-4">Why does the moon look different each night?</div>
                {/* Realistic orbit/diagram image */}
                <img
                  src="/images/science/s2_moon_magic/moon-cycle-diagram.jpg"
                  alt="Moon cycle diagram"
                  className="w-96 rounded-xl shadow mb-4 cursor-zoom-in"
                  onClick={() => setFullscreenImage('/images/science/s2_moon_magic/moon-cycle-diagram.jpg')}
                />
                <img
                  src="/images/science/s2_moon_magic/earth-moon-sun.jpg"
                  alt="Earth, Moon, and Sun"
                  className="w-96 rounded-xl shadow cursor-zoom-in"
                  onClick={() => setFullscreenImage('/images/science/s2_moon_magic/earth-moon-sun.jpg')}
                />
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="The moon makes its own light."
                truth="The moon reflects sunlight."
                videos={mythVideos.map(v => ({ url: v.url, title: v.title }))}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <SectionWrapper label="Activities" icon="🧩">
              <ActivityTabs tabs={activityTabs} activeTab={activityIndex} onTabChange={setActivityIndex} />
            </SectionWrapper>
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="🎯">
              <WrapUp
                title="Moon Phase Master"
                summary="You've discovered the science behind moon phases!"
                keyPoints={[
                  "The Moon doesn't make its own light - it reflects sunlight",
                  "Moon phases change as the Moon orbits Earth",
                  "We see different amounts of the sunlit side from Earth",
                  "A complete cycle of phases takes about 29.5 days"
                ]}
                questions={[
                  "What did you learn about the moon phases?",
                  "Why does the moon look different each night?",
                  "Can you explain what causes a lunar eclipse?"
                ]}
                nextLessonText="Next up: Explore lightning power!"
              />
            </SectionWrapper>
          )}
        </AnimatePresence>
        <div className="flex gap-4 mt-8">
          {section > 0 && (
            <button className="px-4 py-2 bg-gray-200 rounded font-bold" onClick={prevSection}>Back</button>
          )}
          {(section < sectionLabels.length - 1 || (section === 3 && activityIndex < activitySections.length - 1)) && (
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

      {/* Add invisible sound player component */}
      <SoundPlayer soundEnabled={true} volume={0.5} />
    </div>
  );
};

export default S2_MoonMagicExplorer; 