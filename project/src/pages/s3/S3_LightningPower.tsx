import React, { useState } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import ChargeBuilder from '../../components/games/science/ChargeBuilder';
import StrikePathPuzzle from '../../components/games/science/StrikePathPuzzle';
import LightningSafetyChallenge from '../../components/games/science/LightningSafetyChallenge';
import VideoEmbed from '../../components/common/VideoEmbed';

const warmupQuestions = [
  {
    question: "What do we hear after lightning?",
    options: [
      { text: "Wind", explanation: "Wind is not caused by lightning." },
      { text: "Music", explanation: "Music is not related to lightning." },
      { text: "Thunder", explanation: "Correct! Thunder follows lightning." },
      { text: "Rain", explanation: "Rain may come with storms, but thunder is the sound after lightning." },
    ],
    correct: 2,
  },
  {
    question: "What color is lightning usually?",
    options: [
      { text: "Purple", explanation: "Lightning is rarely purple." },
      { text: "White", explanation: "Correct! Lightning is usually white." },
      { text: "Yellow", explanation: "Lightning can look yellow, but it's mostly white." },
      { text: "Red", explanation: "Red lightning is very rare." },
    ],
    correct: 1,
  },
  {
    question: "What does lightning strike?",
    options: [
      { text: "Ground", explanation: "Lightning can strike the ground." },
      { text: "Trees", explanation: "Lightning can strike trees." },
      { text: "Metal towers", explanation: "Lightning can strike metal towers." },
      { text: "All of the above", explanation: "Correct! Lightning can strike all of these." },
    ],
    correct: 3,
  },
  {
    question: "When is it dangerous to be outside?",
    options: [
      { text: "On a sunny day", explanation: "It's not dangerous unless there's a storm." },
      { text: "During a lightning storm", explanation: "Correct! Lightning storms are dangerous." },
      { text: "When cloudy", explanation: "Clouds alone aren't dangerous." },
      { text: "At sunset", explanation: "Sunset is not dangerous unless there's a storm." },
    ],
    correct: 1,
  },
  {
    question: "What causes lightning?",
    options: [
      { text: "Hot and cold air meeting", explanation: "This can cause storms but doesn't directly cause lightning." },
      { text: "Electrical charges in clouds", explanation: "Correct! Lightning happens when positive and negative charges build up and then discharge." },
      { text: "The sun's rays", explanation: "The sun doesn't directly cause lightning." },
      { text: "Wind blowing fast", explanation: "Wind doesn't create the electrical charges needed for lightning." },
    ],
    correct: 1,
  },
  {
    question: "Why does thunder happen?",
    options: [
      { text: "Clouds bumping together", explanation: "Clouds don't make thunder by bumping together." },
      { text: "Rain hitting the ground", explanation: "Rain doesn't cause the loud sound of thunder." },
      { text: "Air expanding rapidly from heat", explanation: "Correct! Lightning heats the air so quickly it expands explosively, creating the sound of thunder." },
      { text: "Wind blowing through trees", explanation: "Wind in trees makes rustling sounds, not thunder." },
    ],
    correct: 2,
  },
  {
    question: "How hot can lightning get?",
    options: [
      { text: "As hot as an oven", explanation: "Lightning is much, much hotter than an oven." },
      { text: "As hot as a candle", explanation: "Lightning is thousands of times hotter than a candle." },
      { text: "Hotter than the surface of the sun", explanation: "Correct! Lightning can reach temperatures about 5 times hotter than the sun's surface." },
      { text: "About as hot as boiling water", explanation: "Lightning is thousands of times hotter than boiling water." },
    ],
    correct: 2,
  },
  {
    question: "What should you do if you're outside during a lightning storm?",
    options: [
      { text: "Stand under a tree", explanation: "Never stand under trees during lightning - they can attract strikes!" },
      { text: "Lie flat on the ground", explanation: "This used to be recommended but is now considered dangerous as lightning can spread along the ground." },
      { text: "Find a low area away from trees", explanation: "Correct! Stay low but don't lie flat, and stay away from tall objects like trees." },
      { text: "Hold metal objects up high", explanation: "Never hold metal objects during a lightning storm - they can attract lightning!" },
    ],
    correct: 2,
  },
  {
    question: "How far away is lightning if you count 5 seconds between the flash and thunder?",
    options: [
      { text: "5 miles (8 km)", explanation: "Correct! Sound travels about 1 mile every 5 seconds, so 5 seconds means the lightning is about 1 mile away." },
      { text: "1 mile (1.6 km)", explanation: "Sound travels about 1 mile every 5 seconds, so 5 seconds means the lightning is about 1 mile away." },
      { text: "10 miles (16 km)", explanation: "Lightning would be closer than this with a 5-second count." },
      { text: "50 miles (80 km)", explanation: "Lightning would be much closer than this with a 5-second count." },
    ],
    correct: 1,
  },
  {
    question: "What is a lightning rod used for?",
    options: [
      { text: "To attract lightning", explanation: "Lightning rods don't attract lightning - they provide a safe path if lightning strikes." },
      { text: "To prevent lightning", explanation: "Lightning rods don't prevent lightning from occurring." },
      { text: "To safely direct lightning to the ground", explanation: "Correct! Lightning rods provide a safe path for lightning to travel to the ground, protecting buildings." },
      { text: "To measure lightning", explanation: "Lightning rods don't measure lightning - they protect buildings." },
    ],
    correct: 2,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'What Causes Thunder and Lightning?',
    url: 'https://www.youtube.com/embed/fEiVi9TB_RQ',
    thumbnail: '/images/science/s3_lightning_power/thunder_lightning_thumbnail.jpg',
  },
  {
    title: 'Thunder and Lightning | Science for Kids',
    url: 'https://www.youtube.com/embed/nTsrGHzASJ0',
    thumbnail: '/images/science/s3_lightning_power/science_kids_thumbnail.jpg',
  }
];

const mythVideos = [
  {
    title: 'How Does Lightning Strike? | Lightning Explained For Kids | KLT',
    url: 'https://www.youtube.com/embed/2KoEwKYOr80',
    thumbnail: '/images/science/s3_lightning_power/lightning_kids_thumbnail.jpg',
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

const S3_LightningPower: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activityTab, setActivityTab] = useState(0);

  // ActivityTabs content for S3
  const activityTabs = [
    {
      label: 'Charge Builder',
      content: <ChargeBuilder />,
    },
    {
      label: 'Lightning Path Game',
      content: <StrikePathPuzzle />,
    },
    {
      label: 'Safe or Not?',
      content: <LightningSafetyChallenge />,
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
            <SectionWrapper key="warmup" label="Warm-Up Quiz" icon="⚡">
              <QuizQuestions questions={warmupQuestions} onComplete={nextSection} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <div className="w-full flex justify-center mb-4">
                  <iframe
                    src="https://tenor.com/embed/15719441"
                    title="Lightning Lightning Strike GIF"
                    className="rounded-lg shadow-lg"
                    width="320"
                    height="260"
                    frameBorder="0"
                    allowFullScreen
                  ></iframe>
                </div>
                <p className="text-lg mt-4 text-center">"Where did that flash come from?"</p>
                
                {/* Video section */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 w-full">
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
                myth="Lightning never strikes the same place twice."
                truth="Lightning can strike the same place many times."
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
                  'Where is it safe during lightning?',
                  'Why does thunder happen?',
                  'What should you do if you see lightning?'
                ]}
              >
                <div className="flex gap-2 mb-4">
                  <span className="bg-blue-500 text-white px-2 py-1 rounded">Stay indoors</span>
                  <span className="bg-yellow-400 text-white px-2 py-1 rounded">Avoid trees</span>
                  <span className="bg-gray-700 text-white px-2 py-1 rounded">Wait for the storm to pass</span>
                </div>
                <div className="mb-4">Remember: Lightning is powerful, but you can stay safe by following the rules!</div>
                <div className="text-lg mb-6 text-center">
                  Great job! Can you explain what causes thunder and how to stay safe during a storm?
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

export default S3_LightningPower; 