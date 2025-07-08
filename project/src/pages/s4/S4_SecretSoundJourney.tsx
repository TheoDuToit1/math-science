import React, { useState } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import VideoEmbed from '../../components/common/VideoEmbed';
import SoundWaveVisualizer from '../../components/games/science/SoundWaveVisualizer';
import TravelTracker from '../../components/games/science/TravelTracker';
import SoundDetective from '../../components/games/science/SoundDetective';

const warmupQuestions = [
  {
    question: "Which travels faster: sound or light?",
    options: [
      { text: "Sound", explanation: "Sound is much slower than light." },
      { text: "Light", explanation: "Correct! Light travels much faster than sound." },
    ],
    correct: 1,
  },
  {
    question: "Can sound travel in space?",
    options: [
      { text: "Yes", explanation: "Sound needs a medium to travel through, and space is a vacuum." },
      { text: "No", explanation: "Correct! Sound cannot travel in space because it's a vacuum." },
    ],
    correct: 1,
  },
  {
    question: "Which of these makes the highest pitch?",
    options: [
      { text: "Whistle", explanation: "Correct! A whistle produces a high-pitched sound." },
      { text: "Drum", explanation: "Drums produce low-pitched sounds." },
      { text: "Thunder", explanation: "Thunder produces a low rumbling sound." },
    ],
    correct: 0,
  },
  {
    question: "What causes sound?",
    options: [
      { text: "Light", explanation: "Light is different from sound - it's a form of electromagnetic radiation." },
      { text: "Vibrations", explanation: "Correct! Sound is caused by vibrations that travel through a medium." },
      { text: "Magnets", explanation: "Magnets create magnetic fields, not sound." },
      { text: "Electricity", explanation: "Electricity doesn't directly cause sound, though electrical devices may create vibrations that produce sound." },
    ],
    correct: 1,
  },
  {
    question: "Which material does sound travel through fastest?",
    options: [
      { text: "Air", explanation: "Sound travels slowest through air compared to liquids and solids." },
      { text: "Water", explanation: "Sound travels faster in water than air, but not as fast as in solids." },
      { text: "Metal", explanation: "Correct! Sound travels fastest through solid materials like metal." },
      { text: "Nothing - sound travels at the same speed everywhere", explanation: "Sound travels at different speeds through different materials." },
    ],
    correct: 2,
  },
  {
    question: "What happens to sound waves when they hit a wall?",
    options: [
      { text: "They disappear completely", explanation: "Sound waves don't simply disappear when they hit a surface." },
      { text: "They bounce back (echo)", explanation: "Correct! Sound waves bounce off hard surfaces, creating echoes." },
      { text: "They turn into light", explanation: "Sound waves cannot transform into light waves." },
      { text: "They stop moving", explanation: "Sound waves don't just stop - they reflect, absorb, or transmit through materials." },
    ],
    correct: 1,
  },
  {
    question: "What part of your body helps you hear sound?",
    options: [
      { text: "Eyes", explanation: "Eyes detect light, not sound." },
      { text: "Nose", explanation: "The nose is for smelling, not hearing." },
      { text: "Ears", explanation: "Correct! Ears detect sound waves and send signals to your brain." },
      { text: "Fingers", explanation: "While you can feel vibrations with fingers, ears are the primary organs for hearing." },
    ],
    correct: 2,
  },
  {
    question: "What is the unit used to measure how loud a sound is?",
    options: [
      { text: "Meter", explanation: "Meters measure distance, not sound." },
      { text: "Decibel", explanation: "Correct! Decibels (dB) measure the loudness or intensity of sound." },
      { text: "Kilogram", explanation: "Kilograms measure mass, not sound." },
      { text: "Celsius", explanation: "Celsius measures temperature, not sound." },
    ],
    correct: 1,
  },
  {
    question: "What happens to sound waves when they travel away from their source?",
    options: [
      { text: "They get louder", explanation: "Sound waves actually get quieter as they travel away from their source." },
      { text: "They get faster", explanation: "The speed of sound depends on the medium, not the distance from the source." },
      { text: "They get quieter", explanation: "Correct! Sound waves spread out and lose energy as they travel away, making them quieter." },
      { text: "They change color", explanation: "Sound waves don't have color." },
    ],
    correct: 2,
  },
  {
    question: "What makes a sound have a high pitch?",
    options: [
      { text: "Slow vibrations", explanation: "Slow vibrations create low-pitched sounds." },
      { text: "Fast vibrations", explanation: "Correct! Fast vibrations create high-pitched sounds." },
      { text: "Loud volume", explanation: "Volume (loudness) is different from pitch - you can have quiet high-pitched sounds." },
      { text: "Heavy objects", explanation: "The weight of an object doesn't directly determine pitch - it's about vibration frequency." },
    ],
    correct: 1,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'What is Sound? | Physics for Kids',
    url: 'https://www.youtube.com/embed/3-xKZKxXuu0',
    thumbnail: '/images/science/s4_secret_sound_journey/sound_physics_thumbnail.jpg',
  },
  {
    title: 'Sound Waves - General Science for Kids',
    url: 'https://www.youtube.com/embed/JdUll9GIXsI',
    thumbnail: '/images/science/s4_secret_sound_journey/sound_waves_thumbnail.jpg',
  }
];

const mythVideos = [
  {
    title: 'What is Sound? | Physics for Kids | SciShow Kids',
    url: 'https://www.youtube.com/embed/3-xKZKxXuu0',
    thumbnail: '/images/science/s4_secret_sound_journey/sound_physics_thumbnail.jpg',
  },
];

const sections = [
  'Warm-Up',
  'Introduction',
  'Myth to Bust',
  'Activities',
  'Wrap-Up',
];
const TOTAL_QUESTIONS = 10;
const TOTAL_ACTIVITIES = 3;

const S4_SecretSoundJourney: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activityTab, setActivityTab] = useState(0);

  // ActivityTabs content for S4
  const activityTabs = [
    {
      label: 'Sound Wave Visualizer',
      content: <SoundWaveVisualizer />,
    },
    {
      label: 'Travel Tracker',
      content: <TravelTracker />,
    },
    {
      label: 'Sound Detective',
      content: <SoundDetective />,
    },
  ];

  const nextSection = () => {
    setSection((s) => Math.min(s + 1, sections.length - 1));
  };
  const prevSection = () => setSection((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-indigo-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-2 sm:px-6">
        <ProgressBarSection sectionLabels={sections} currentSection={section} onSectionChange={setSection} />
        {/* Only show the quiz progress bar in the Warm-Up section */}
        {sections[section] === 'Warm-Up' && (
          <ProgressBarMain current={questionsCompleted} total={TOTAL_QUESTIONS} color="bg-indigo-500" label="questions complete" />
        )}
        {/* Show activities progress bar only in Activities section */}
        {sections[section] === 'Activities' && (
          <ProgressBarMain current={activityTab + 1} total={TOTAL_ACTIVITIES} color="bg-blue-400" label="activities" />
        )}
        <AnimatePresence mode="wait">
          {section === 0 && (
            <SectionWrapper key="warmup" label="Can You Hear That?" icon="🔊">
              <QuizQuestions questions={warmupQuestions} onComplete={nextSection} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <p className="text-lg mb-4 text-center">
                  Sound is energy that travels in waves through air, water, or solids. You hear sound when these waves reach your ears!
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 w-full">
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
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg font-medium">🧠 What do you think sound waves look like? Can we see sound?</p>
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Sound can travel through outer space."
                truth="Space is a vacuum—no air means no sound waves. Sound needs something to travel through!"
                videos={mythVideos}
              />
            </SectionWrapper>
          )}
          {section === 3 && (
            <ActivityTabs tabs={activityTabs} activeTab={activityTab} onTabChange={setActivityTab} />
          )}
          {section === 4 && (
            <SectionWrapper key="wrapup" label="Wrap-Up" icon="✅">
              <WrapUp
                questions={[
                  'What does sound need to travel?',
                  'Which material lets sound travel fastest?',
                  'Can you think of a place where sound doesn\'t travel well?'
                ]}
              >
                <div className="flex gap-2 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded">Air</span>
                  <span className="bg-green-500 text-white px-2 py-1 rounded">Water</span>
                  <span className="bg-yellow-500 text-white px-2 py-1 rounded">Solids</span>
                </div>
                <div className="mb-4">Remember: Sound needs a medium to travel through. It travels fastest through solids, slower in liquids, and slowest in gases!</div>
                <div className="text-lg mb-6 text-center">
                  Great job! Can you explain how sound travels and why we can't hear sounds in space?
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
    </div>
  );
};

export default S4_SecretSoundJourney; 