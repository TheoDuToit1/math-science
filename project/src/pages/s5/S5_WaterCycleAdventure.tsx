import React, { useState } from 'react';
import SectionWrapper from '../../components/common/SectionWrapper';
import { motion, AnimatePresence } from 'framer-motion';
import ActivityTabs from '../../components/global/ActivityTabs';
import ProgressBarSection from '../../components/global/ProgressBarSection';
import ProgressBarMain from '../../components/global/ProgressBarMain';
import { QuizQuestions, MythBuster, WrapUp } from '../../components/global';
import CycleBuilder from '../../components/games/science/CycleBuilder';
import WeatherWatch from '../../components/games/science/WeatherWatch';
import WaterCycleSpinner from '../../components/games/science/WaterCycleSpinner';
import VideoEmbed from '../../components/common/VideoEmbed';

const warmupQuestions = [
  {
    question: "Where does rain come from?",
    options: [
      { text: "Oceans", explanation: "Rain comes from clouds, not directly from oceans." },
      { text: "Clouds", explanation: "Correct! Rain falls from clouds." },
      { text: "Rivers", explanation: "Rain comes from clouds, not from rivers." },
    ],
    correct: 1,
  },
  {
    question: "What turns water into vapor?",
    options: [
      { text: "Freezing", explanation: "Freezing turns water into ice, not vapor." },
      { text: "Evaporation", explanation: "Correct! Evaporation turns water into vapor." },
      { text: "Condensation", explanation: "Condensation turns vapor into liquid water, not the other way around." },
    ],
    correct: 1,
  },
  {
    question: "What is the process of water falling to Earth called?",
    options: [
      { text: "Collection", explanation: "Collection refers to water gathering in oceans, lakes, and rivers." },
      { text: "Precipitation", explanation: "Correct! Precipitation is when water falls from clouds as rain, snow, or hail." },
      { text: "Infiltration", explanation: "Infiltration is when water soaks into the ground." },
    ],
    correct: 1,
  },
  {
    question: "What powers the water cycle?",
    options: [
      { text: "Wind", explanation: "Wind helps move clouds but doesn't power the water cycle." },
      { text: "The Sun", explanation: "Correct! The Sun's heat energy powers evaporation, which drives the water cycle." },
      { text: "Gravity", explanation: "Gravity helps precipitation fall down but doesn't power the entire cycle." },
      { text: "Plants", explanation: "Plants participate in the water cycle through transpiration but don't power it." },
    ],
    correct: 1,
  },
  {
    question: "What is condensation in the water cycle?",
    options: [
      { text: "Water turning into ice", explanation: "Water turning into ice is called freezing, not condensation." },
      { text: "Water vapor turning into liquid water", explanation: "Correct! Condensation happens when water vapor cools and turns back into liquid water." },
      { text: "Water soaking into the ground", explanation: "Water soaking into the ground is called infiltration or percolation." },
      { text: "Water flowing in rivers", explanation: "Water flowing in rivers is part of collection or runoff, not condensation." },
    ],
    correct: 1,
  },
  {
    question: "Which is NOT a form of precipitation?",
    options: [
      { text: "Rain", explanation: "Rain is a form of precipitation." },
      { text: "Snow", explanation: "Snow is a form of precipitation." },
      { text: "Fog", explanation: "Correct! Fog is a form of condensation near the ground, not precipitation." },
      { text: "Hail", explanation: "Hail is a form of precipitation." },
    ],
    correct: 2,
  },
  {
    question: "What happens to most rainwater after it falls?",
    options: [
      { text: "It disappears forever", explanation: "Water doesn't disappear - it continues in the water cycle." },
      { text: "It all goes into plants", explanation: "While some water is absorbed by plants, not all rainwater goes into plants." },
      { text: "It collects in oceans, lakes, rivers, or soaks into the ground", explanation: "Correct! Rainwater collects in bodies of water or soaks into the ground." },
      { text: "It turns into clouds immediately", explanation: "Rainwater doesn't turn back into clouds immediately." },
    ],
    correct: 2,
  },
  {
    question: "What is transpiration?",
    options: [
      { text: "When water falls as rain", explanation: "Water falling as rain is precipitation, not transpiration." },
      { text: "When water evaporates from plants", explanation: "Correct! Transpiration is when plants release water vapor through their leaves." },
      { text: "When water freezes in clouds", explanation: "Water freezing in clouds is part of precipitation formation, not transpiration." },
      { text: "When rivers flow to the ocean", explanation: "Rivers flowing to the ocean is part of collection or runoff, not transpiration." },
    ],
    correct: 1,
  },
  {
    question: "Why do clouds look white?",
    options: [
      { text: "They're made of snow", explanation: "Clouds aren't made of snow - they're made of tiny water droplets or ice crystals." },
      { text: "They reflect all colors of light together", explanation: "Correct! Clouds appear white because the water droplets scatter all colors of light equally." },
      { text: "They're painted by airplanes", explanation: "Clouds aren't painted - they form naturally in the atmosphere." },
      { text: "They're made of cotton", explanation: "Clouds aren't made of cotton - they're made of water droplets or ice crystals." },
    ],
    correct: 1,
  },
  {
    question: "About how much of Earth's surface is covered by water?",
    options: [
      { text: "About 25% (one quarter)", explanation: "Earth has much more water coverage than 25%." },
      { text: "About 50% (half)", explanation: "Earth has more water coverage than 50%." },
      { text: "About 70% (almost three quarters)", explanation: "Correct! About 70% of Earth's surface is covered by water." },
      { text: "About 90% (almost all)", explanation: "Earth has significant land area - water covers about 70%, not 90%." },
    ],
    correct: 2,
  },
];

// Videos for the introduction section
const introVideos = [
  {
    title: 'The Water Cycle for Kids',
    url: 'https://www.youtube.com/embed/TD3XSIE4ymo',
    thumbnail: '/images/science/s5_water_cycle_adventure/water_cycle_kids_thumbnail.jpg',
  },
  {
    title: 'The Water Cycle! Science For Kids',
    url: 'https://www.youtube.com/embed/46NNUXgP55k',
    thumbnail: '/images/science/s5_water_cycle_adventure/science_kids_thumbnail.jpg',
  }
];

const mythVideos = [
  {
    title: 'The Water Cycle | The Dr. Binocs Show',
    url: 'https://www.youtube.com/embed/ncORPosDrjI',
    thumbnail: '/images/science/s5_water_cycle_adventure/dr_binocs_thumbnail.jpg',
  },
];

const sectionLabels = [
  'Warm-Up',
  'Introduction',
  'Myth to Bust',
  'Activities',
  'Wrap-Up',
];
const TOTAL_QUESTIONS = 10;
const TOTAL_ACTIVITIES = 3;

const S5_WaterCycleAdventure: React.FC = () => {
  const [section, setSection] = useState(0);
  const [questionsCompleted, setQuestionsCompleted] = useState(0);
  const [activityTab, setActivityTab] = useState(0);
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null);

  // ActivityTabs content for S5
  const activityTabs = [
    {
      label: 'Cycle Builder',
      content: <CycleBuilder />,
    },
    {
      label: 'Weather Watch',
      content: <WeatherWatch />,
    },
    {
      label: 'Cycle Spinner',
      content: <WaterCycleSpinner />,
    },
  ];

  const nextSection = () => {
    setSection((s) => Math.min(s + 1, sectionLabels.length - 1));
  };
  const prevSection = () => setSection((s) => Math.max(s - 1, 0));

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-green-100 flex flex-col items-center py-6">
      <div className="w-full max-w-4xl px-2 sm:px-6">
        <ProgressBarSection sectionLabels={sectionLabels} currentSection={section} />
        {/* Only show the quiz progress bar in the Warm-Up section */}
        {sectionLabels[section] === 'Warm-Up' && (
          <ProgressBarMain current={questionsCompleted} total={TOTAL_QUESTIONS} color="bg-blue-500" label="questions complete" />
        )}
        {/* Show activities progress bar only in Activities section */}
        {sectionLabels[section] === 'Activities' && (
          <ProgressBarMain current={activityTab + 1} total={TOTAL_ACTIVITIES} color="bg-blue-400" label="activities" />
        )}
        <AnimatePresence mode="wait">
          {section === 0 && (
            <SectionWrapper key="warmup" label="Ready for a Rainy Day?" icon="🌧️">
              <QuizQuestions questions={warmupQuestions} onComplete={nextSection} />
            </SectionWrapper>
          )}
          {section === 1 && (
            <SectionWrapper label="Introduction" icon="🎬">
              <div className="flex flex-col items-center">
                <p className="text-lg mt-4 text-center mb-6">
                  Water is always on the move! It travels in a never-ending cycle—from oceans to clouds to rain and back again.
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
                
                <div className="flex justify-center gap-4 mb-6">
                  <img
                    src="/images/science/s5_water_cycle_adventure/evaporation.png"
                    alt="Evaporation"
                    className="w-24 h-24 object-cover rounded-lg shadow cursor-zoom-in"
                    onClick={() => setFullscreenImage('/images/science/s5_water_cycle_adventure/evaporation.png')}
                  />
                  <img
                    src="/images/science/s5_water_cycle_adventure/condensation.jpg"
                    alt="Condensation"
                    className="w-24 h-24 object-cover rounded-lg shadow cursor-zoom-in"
                    onClick={() => setFullscreenImage('/images/science/s5_water_cycle_adventure/condensation.jpg')}
                  />
                  <img
                    src="/images/science/s5_water_cycle_adventure/drop.png"
                    alt="Precipitation"
                    className="w-24 h-24 object-cover rounded-lg shadow cursor-zoom-in"
                    onClick={() => setFullscreenImage('/images/science/s5_water_cycle_adventure/drop.png')}
                  />
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-500">
                  <p className="text-lg font-medium">🧠 Can you name all 3 main parts of the water cycle?</p>
                </div>
              </div>
            </SectionWrapper>
          )}
          {section === 2 && (
            <SectionWrapper label="Myth to Bust" icon="🔍">
              <MythBuster
                myth="Water just disappears when it dries up."
                truth="It doesn't disappear—it becomes water vapor and moves into the air through evaporation!"
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
                'Where does water go after it rains?',
                'Why is the sun important in the water cycle?',
                'Can you explain the cycle in your own words?'
              ]}
            >
              <div className="flex gap-2 mb-4">
                <span className="bg-blue-500 text-white px-2 py-1 rounded">Evaporation</span>
                <span className="bg-cyan-500 text-white px-2 py-1 rounded">Condensation</span>
                <span className="bg-indigo-500 text-white px-2 py-1 rounded">Precipitation</span>
                <span className="bg-green-500 text-white px-2 py-1 rounded">Collection</span>
              </div>
              <div className="mb-4">Remember: Water is always moving in a cycle, never disappearing!</div>
              <div className="text-lg mb-6 text-center">
                Great job! Can you explain how the water cycle works and why it's important?
              </div>
            </WrapUp>
            </SectionWrapper>
          )}
        </AnimatePresence>
        <div className="flex gap-4 mt-8">
          {section > 0 && (
            <button className="px-4 py-2 bg-gray-200 rounded font-bold" onClick={prevSection}>Back</button>
          )}
          {section < sectionLabels.length - 1 && (
            <button className="px-4 py-2 bg-blue-500 text-white rounded font-bold" onClick={nextSection}>Next</button>
          )}
        </div>
      </div>
      
      {/* Fullscreen image modal */}
      {fullscreenImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
          onClick={() => setFullscreenImage(null)}
        >
          <div className="relative max-w-4xl max-h-full">
            <img 
              src={fullscreenImage} 
              alt="Enlarged view" 
              className="max-w-full max-h-[90vh] object-contain"
            />
            <button 
              className="absolute top-2 right-2 bg-white rounded-full w-8 h-8 flex items-center justify-center text-xl"
              onClick={() => setFullscreenImage(null)}
            >
              ×
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default S5_WaterCycleAdventure; 