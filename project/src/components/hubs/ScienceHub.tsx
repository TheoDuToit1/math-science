import React from 'react';
import { 
  FaSearch, FaChevronDown, FaTh, FaList, FaGlobeAmericas, FaRunning,
  FaPaw, FaCloudRain, FaLightbulb, FaBookOpen, FaUserFriends, 
  FaChartLine, FaStar, FaBell, FaCog, FaSignOutAlt, FaTrophy
} from 'react-icons/fa';
import GameCard from '../common/GameCard';

// Define a custom IconProps type that matches how we're using the icons
type IconProps = {
  className?: string;
  size?: number;
};

const StatCard = ({ icon, color, value, title, subtitle, trend }) => (
  <div className="bg-white p-6 rounded-xl shadow-md flex items-center justify-between">
    <div className="flex items-center">
      <div className={`w-16 h-16 flex items-center justify-center rounded-xl mr-5 ${color}`}>
        {icon}
      </div>
      <div>
        <p className="text-3xl font-bold text-gray-800">{value}</p>
        <p className="text-gray-600">{title}</p>
        <p className="text-gray-400 text-sm">{subtitle}</p>
      </div>
    </div>
    <div className="text-green-500 font-semibold flex items-center">
      {React.createElement(FaChartLine, { className: "mr-1" })}
      {trend}
    </div>
  </div>
);

const scienceGames = [
  {
    id: 's1',
    title: 'Rainbow Maker Quest',
    description: 'Discover how rainbows form with hands-on puzzles and science fun!',
    icon: '🌈',
    gradient: 'bg-gradient-to-tr from-yellow-400 to-pink-500',
    difficulty: 'Easy',
    mastery: 85,
    category: 'Light & Color',
    rating: 4.8,
    tags: ['Rainbows', 'Light', 'Color'],
    moreTags: 2,
    players: '1-4',
    time: '15 min',
    ageRange: '7-10',
    path: '/s1',
  },
  {
    id: 's2',
    title: 'Moon Magic Explorer',
    description: 'Explore moon phases and orbits with interactive games and quizzes.',
    icon: '🌙',
    gradient: 'bg-gradient-to-tr from-pink-500 to-red-400',
    difficulty: 'Medium',
    mastery: 78,
    category: 'Space',
    rating: 4.7,
    tags: ['Moon', 'Phases', 'Orbit'],
    moreTags: 1,
    players: '1-4',
    time: '20 min',
    ageRange: '7-10',
    path: '/s2',
  },
  {
    id: 's3',
    title: 'Lightning Power',
    description: 'Unleash the science of lightning with electrifying games and safety challenges!',
    icon: '⚡',
    gradient: 'bg-gradient-to-tr from-blue-400 to-indigo-500',
    difficulty: 'Medium',
    mastery: 0,
    category: 'Electricity',
    rating: 4.6,
    tags: ['Lightning', 'Electricity', 'Safety'],
    moreTags: 1,
    players: '1-4',
    time: '20 min',
    ageRange: '7-10',
    path: '/s3',
  },
];

const ScienceHub = () => {
  return (
    <div>
      {/* Content removed to prevent duplication with App.tsx */}
    </div>
  );
};

export default ScienceHub; 
 
 
 