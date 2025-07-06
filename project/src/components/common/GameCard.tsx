import { Link } from 'react-router-dom';
import { 
  FaStar, FaUsers, FaClock, FaBookmark, FaShareAlt, FaPlay, 
  FaFlagCheckered, FaGem, FaTrophy 
} from 'react-icons/fa';

interface GameCardProps {
  game: any;
  key?: string;
}

const GameCard = ({ game }: GameCardProps) => {
  const difficultyColors = {
    Easy: 'bg-green-100 text-green-800',
    Medium: 'bg-yellow-100 text-yellow-800',
    Hard: 'bg-red-100 text-red-800',
  };
  
  const difficultyBorderColors = {
    Easy: 'border-green-500',
    Medium: 'border-yellow-500',
    Hard: 'border-red-500',
  };

  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:-translate-y-2 transition-transform duration-300 group">
      <div className={`relative p-4 text-white ${game.gradient} h-48 flex flex-col justify-between`}>
        <div className="flex justify-between items-start z-10">
          <div className={`flex items-center px-3 py-1 text-sm font-semibold rounded-full ${difficultyColors[game.difficulty]}`}>
            {game.difficulty}
          </div>
          <div className="flex items-center bg-black bg-opacity-20 rounded-full p-2 text-sm">
            <FaGem className="text-yellow-300 mr-2" />
            <span className="font-bold">{game.mastery}%</span>
          </div>
        </div>

        <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-white text-6xl opacity-20 group-hover:opacity-30 transition-opacity duration-300">{game.icon}</div>
        </div>

        <div className="flex justify-between items-end z-10">
            <span className="px-3 py-1 text-sm font-semibold rounded-full bg-black bg-opacity-20">{game.category}</span>
            <div className="w-10 h-10 flex items-center justify-center bg-white bg-opacity-25 rounded-full cursor-pointer group-hover:bg-opacity-40 transition-all duration-300">
                <FaPlay className="text-white text-lg" />
            </div>
        </div>
      </div>
      <div className="p-5">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold text-gray-800">{game.title}</h3>
          <div className="flex items-center">
            <FaStar className="text-yellow-400 mr-1" />
            <span className="font-semibold text-gray-700">{game.rating}</span>
          </div>
        </div>
        <p className="text-gray-600 my-2 text-sm h-10">{game.description}</p>
        <div className="flex flex-wrap gap-2 my-3">
          {game.tags.map(tag => (
            <span key={tag} className="px-3 py-1 text-xs font-semibold text-gray-700 bg-gray-200 rounded-full">{tag}</span>
          ))}
          { game.moreTags && <span className="px-3 py-1 text-xs font-semibold text-gray-500 bg-gray-100 rounded-full">+{game.moreTags} more</span> }
        </div>
        <div className="flex justify-between items-center text-gray-500 text-sm my-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center"><FaUsers className="mr-1" /> {game.players}</div>
            <div className="flex items-center"><FaClock className="mr-1" /> {game.time}</div>
            <span>Ages {game.ageRange}</span>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link to={game.path} className="flex-grow text-center bg-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-indigo-700 transition-colors">
            Launch Game
          </Link>
          <button className="p-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><FaBookmark /></button>
          <button className="p-3 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"><FaShareAlt /></button>
        </div>
      </div>
    </div>
  );
};

export default GameCard; 
 
 
 