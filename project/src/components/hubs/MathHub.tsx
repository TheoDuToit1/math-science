import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Calculator, Brain, Activity, Filter, Search, SortAsc, Grid3X3, List } from 'lucide-react';

interface MathGame {
  id: string;
  title: string;
  description: string;
  path: string;
  difficulty: string;
  timeEstimate: string;
  popularity: number;
  ageRange: string;
  category: string;
  icon: React.ReactNode;
}

interface MathHubProps {
  games: MathGame[];
}

const MathHub: React.FC<MathHubProps> = ({ games }) => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'popularity' | 'time'>('popularity');

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 95) return <span className="text-yellow-500">🏆</span>;
    if (popularity >= 90) return <span className="text-orange-500">🥇</span>;
    if (popularity >= 85) return <span className="text-blue-500">⭐</span>;
    return <span className="text-purple-500">💎</span>;
  };

  const filterAndSortGames = (games: MathGame[]) => {
    let filtered = games.filter(game => {
      const matchesSearch = searchTerm === '' || 
                          game.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesDifficulty = filterDifficulty === 'all' || game.difficulty === filterDifficulty;
      return matchesSearch && matchesDifficulty;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      } else if (sortBy === 'difficulty') {
        const difficultyOrder = { 'Easy': 1, 'Medium': 2, 'Hard': 3 };
        return difficultyOrder[a.difficulty as keyof typeof difficultyOrder] - difficultyOrder[b.difficulty as keyof typeof difficultyOrder];
      } else if (sortBy === 'popularity') {
        return b.popularity - a.popularity;
      } else if (sortBy === 'time') {
        const getMinutes = (timeStr: string) => parseInt(timeStr.split(' ')[0]);
        return getMinutes(a.timeEstimate) - getMinutes(b.timeEstimate);
      }
      return 0;
    });
  };

  const filteredGames = filterAndSortGames(games);

  const GameCard = ({ game, index }: { game: MathGame, index: number }) => {
    const colorOptions = [
      "from-blue-400 to-indigo-500",
      "from-green-400 to-emerald-500",
      "from-orange-400 to-amber-500",
      "from-pink-400 to-rose-500",
      "from-purple-400 to-violet-500"
    ];
    
    const gradientColor = colorOptions[index % colorOptions.length];
    
    return (
      <Link to={game.path} className="block">
        <div 
          className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 border border-gray-100"
          style={{ animationDelay: `${index * 50}ms` }}
        >
          <div className={`h-40 bg-gradient-to-br ${gradientColor} relative overflow-hidden`}>
            <div className="absolute inset-0 bg-black bg-opacity-10"></div>

            {/* Main icon */}
            <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
              <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
                {game.icon || <Calculator className="w-8 h-8 text-white" />}
              </div>
            </div>
          </div>

          <div className="p-5">
            <div className="flex justify-between items-start mb-2">
              <h3 className="font-bold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">{game.title}</h3>
              {getPopularityIcon(game.popularity)}
            </div>
            
            <p className="text-gray-600 text-sm mb-4 line-clamp-2">{game.description}</p>
            
            <div className="flex flex-wrap gap-2 mt-auto">
              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(game.difficulty)}`}>{game.difficulty}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-blue-100 text-blue-800 border border-blue-200">{game.timeEstimate}</span>
              <span className="text-xs px-2 py-1 rounded-full bg-purple-100 text-purple-800 border border-purple-200">{game.ageRange}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  const GameListItem = ({ game, index }: { game: MathGame, index: number }) => {
    return (
      <Link to={game.path} className="block">
        <div className="bg-white rounded-xl shadow hover:shadow-md transition-all duration-300 p-4 border border-gray-100 hover:border-blue-200">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-lg bg-gradient-to-br from-blue-400 to-indigo-500 flex items-center justify-center`}>
              {game.icon || <Calculator className="w-6 h-6 text-white" />}
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900">{game.title}</h3>
              <p className="text-gray-600 text-sm line-clamp-1">{game.description}</p>
            </div>
            
            <div className="flex flex-col items-end gap-1">
              <span className={`text-xs px-2 py-1 rounded-full border ${getDifficultyColor(game.difficulty)}`}>{game.difficulty}</span>
              <span className="text-xs text-gray-500">{game.timeEstimate}</span>
            </div>
          </div>
        </div>
      </Link>
    );
  };

  return (
    <div>
      {/* Content removed to prevent duplication with App.tsx */}
    </div>
  );
};

export default MathHub; 