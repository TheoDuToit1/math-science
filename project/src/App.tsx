import React, { useState, useEffect } from 'react';
import { Link, Routes, Route, Navigate } from 'react-router-dom';
import { 
  User, Lock, GraduationCap, Calculator, Atom, Eye, EyeOff, CheckCircle,
  Plus, Minus, X, Divide, Target, Zap, Beaker, Microscope, Globe,
  Brain, Trophy, Star, Clock, Users, BookOpen, Play, BarChart3,
  FlaskConical, Dna, Leaf, Lightbulb, Rocket, Mountain, Filter,
  Search, Settings, Bell, Calendar, Download, Share2, TrendingUp,
  Award, Bookmark, Heart, MessageCircle, ChevronDown, Grid3X3,
  List, SortAsc, RefreshCw, PieChart, Activity, Gamepad2,
  Sparkles, Flame, Zap as Lightning, Crown, Medal, Gem, Music,
  Droplet, Code, Pizza
} from 'lucide-react';
import { AnimationProvider } from './components/common/GameAnimations';
import S1RainbowMakerRoutes from './pages/s1';
import ScienceHub from './components/hubs/ScienceHub';
import MathHub from './components/hubs/MathHub';
import S1RainbowMaker from './pages/s1/S1RainbowMaker';
import S2_MoonMagicExplorer from './pages/s2/S2_MoonMagicExplorer';
import S3_LightningPower from './pages/s3/S3_LightningPower';
import S4_SecretSoundJourney from './pages/s4/S4_SecretSoundJourney';
import S5_WaterCycleAdventure from './pages/s5/S5_WaterCycleAdventure';
import M1_NumberMysteries from './pages/m1/M1_NumberMysteries';
import M2_Magic9xFingerTrick from './pages/m2/M2_Magic9xFingerTrick';
import M3_CodeGrid from './pages/m3/M3_CodeGrid';
import M4_PizzaFractions from './pages/m4/M4_PizzaFractions';
import M5_MazeMaster from './pages/m5/M5_MazeMaster';
import FullscreenManager from './components/common/FullscreenManager';

function App() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    subject: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{[key: string]: string}>({});
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    // Initialize login state from localStorage
    const savedLoginState = localStorage.getItem('isLoggedIn');
    const savedSubject = localStorage.getItem('subject');
    
    // If there's a saved subject, update the form data
    if (savedSubject) {
      setFormData(prev => ({ ...prev, subject: savedSubject }));
    }
    
    return savedLoginState === 'true';
  });
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [filterDifficulty, setFilterDifficulty] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState<'name' | 'difficulty' | 'popularity' | 'time'>('popularity');

  // Update localStorage when login state changes
  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn.toString());
  }, [isLoggedIn]);

  const validateForm = () => {
    const newErrors: {[key: string]: string} = {};

    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }

    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 3) {
      newErrors.password = 'Password must be at least 3 characters';
    }

    if (!formData.subject) {
      newErrors.subject = 'Please select a subject';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      if (formData.email === 'savienglish@gmail.com' && formData.password === 'savi') {
        setIsLoggedIn(true);
        // Save the selected subject to localStorage
        localStorage.setItem('subject', formData.subject);
      } else {
        setErrors({ submit: 'Invalid credentials. Please try again.' });
      }
      setIsLoading(false);
    }, 1500);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubjectSelect = (subject: string) => {
    setFormData(prev => ({ ...prev, subject }));
    if (errors.subject) {
      setErrors(prev => ({ ...prev, subject: '' }));
    }
    // Save the selected subject to localStorage immediately
    localStorage.setItem('subject', subject);
  };

  // Handle sign out
  const handleSignOut = () => {
    setIsLoggedIn(false);
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('subject');
  };

  const mathGames = [
    {
      id: 'm1',
      title: 'Number Mysteries & Place Value Power',
      description: 'Explore place value and the power of zero with interactive puzzles and games!',
      path: '/m1',
      difficulty: 'Easy',
      timeEstimate: '15 mins',
      popularity: 88,
      ageRange: '7-9',
      category: 'Numbers',
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: 'm2',
      title: 'Magic 9× Finger Trick',
      description: 'Learn multiplication tricks & patterns using fingers and visuals!',
      path: '/m2',
      difficulty: 'Easy',
      timeEstimate: '15 mins',
      popularity: 85,
      ageRange: '7-9',
      category: 'Multiplication',
      icon: <Calculator className="w-5 h-5" />
    },
    {
      id: 'm3',
      title: 'Code Grid: Pattern Breaker',
      description: 'Learn step-by-step thinking, patterns, and intro to algorithms with coding puzzles!',
      path: '/m3',
      difficulty: 'Medium',
      timeEstimate: '20 mins',
      popularity: 87,
      ageRange: '7-9',
      category: 'Logic',
      icon: <Code className="w-5 h-5" />
    },
    {
      id: 'm4',
      title: 'Pizza Fractions Adventure',
      description: 'Learn about fractions with delicious pizza slices and treasure hunts!',
      path: '/m4',
      difficulty: 'Easy',
      timeEstimate: '15 mins',
      popularity: 90,
      ageRange: '7-9',
      category: 'Fractions',
      icon: <Pizza className="w-5 h-5" />
    },
    {
      id: 'm5',
      title: 'Maze Master Algorithms',
      description: 'Learn about algorithms, step-by-step thinking, and directional commands!',
      path: '/m5',
      difficulty: 'Medium',
      timeEstimate: '20 mins',
      popularity: 88,
      ageRange: '7-9',
      category: 'Logic',
      icon: <Code className="w-5 h-5" />
    }
  ];

  const scienceGames = [
    {
      id: 's1',
      title: 'Rainbow Maker Quest',
      description: 'Learn how rainbows form with fun interactive experiments!',
      path: '/s1',
      difficulty: 'Easy',
      timeEstimate: '10 mins',
      popularity: 92,
      ageRange: '5-12',
      category: 'Physics',
      icon: <Beaker className="w-5 h-5" />
    },
    {
      id: 's2',
      title: 'Moon Magic Explorer',
      description: 'Discover how the Moon shines and learn about moon phases!',
      path: '/s2',
      difficulty: 'Easy',
      timeEstimate: '10 mins',
      popularity: 90,
      ageRange: '5-12',
      category: 'Astronomy',
      icon: <Sparkles className="w-5 h-5" />
    },
    {
      id: 's3',
      title: 'Lightning Power',
      description: 'Unleash the science of lightning with electrifying games and safety challenges!',
      path: '/s3',
      difficulty: 'Medium',
      timeEstimate: '20 mins',
      popularity: 0,
      ageRange: '5-12',
      category: 'Electricity',
      icon: <Zap className="w-5 h-5" />
    },
    {
      id: 's4',
      title: 'Secret Sound Journey',
      description: 'Explore how sound travels through different materials with fun audio games!',
      path: '/s4',
      difficulty: 'Easy',
      timeEstimate: '15 mins',
      popularity: 0,
      ageRange: '5-12',
      category: 'Physics',
      icon: <Music className="w-5 h-5" />
    },
    {
      id: 's5',
      title: 'Water Cycle Adventure',
      description: 'Explore the never-ending journey of water through evaporation, condensation, precipitation, and collection!',
      path: '/s5',
      difficulty: 'Easy',
      timeEstimate: '15 mins',
      popularity: 0,
      ageRange: '5-12',
      category: 'Earth Science',
      icon: <Droplet className="w-5 h-5" />
    }
  ];

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy': return 'bg-green-100 text-green-800 border-green-200';
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'Hard': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPopularityIcon = (popularity: number) => {
    if (popularity >= 95) return <Crown className="w-4 h-4 text-yellow-500" />;
    if (popularity >= 90) return <Medal className="w-4 h-4 text-orange-500" />;
    if (popularity >= 85) return <Star className="w-4 h-4 text-blue-500" />;
    return <Gem className="w-4 h-4 text-purple-500" />;
  };

  const filterAndSortGames = (games: any[]) => {
    let filtered = games.filter(game => {
      const matchesSearch = searchTerm === '' || 
                           game.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });

    return filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.title.localeCompare(b.title);
      }
      return 0;
    });
  };

  const GameCard = ({ game, index }: { game: any, index: number }) => {
    const colorOptions = [
      "from-orange-400 to-yellow-500",
      "from-pink-500 to-red-500",
      "from-purple-500 to-indigo-600",
      "from-blue-400 to-cyan-500",
      "from-green-500 to-teal-600"
    ];
    
    const gradientColor = colorOptions[index % colorOptions.length];
    
    const cardIcons = [Calculator, Calculator, Brain, PieChart, Lightning];
    const CardIcon = cardIcons[index % cardIcons.length];
    
    return (
    <div 
      className="bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden group cursor-pointer transform hover:scale-105 border border-gray-100"
      style={{ animationDelay: `${index * 50}ms` }}
    >
        <div className={`h-40 bg-gradient-to-br ${gradientColor} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-black bg-opacity-10"></div>

        {/* Main icon */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
          <div className="w-16 h-16 bg-white bg-opacity-20 backdrop-blur-sm rounded-2xl flex items-center justify-center">
              <CardIcon className="w-8 h-8 text-white" />
          </div>
        </div>

        {/* Play button */}
        <div className="absolute bottom-3 right-3">
          <div className="w-10 h-10 bg-white bg-opacity-20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-opacity-30 transition-all">
            <Play className="w-5 h-5 text-white ml-0.5" />
          </div>
        </div>
      </div>
      
      <div className="p-6">
          <div className="mb-4">
          <h3 className="text-xl font-bold text-gray-800 group-hover:text-indigo-600 transition-colors leading-tight">
            {game.title}
          </h3>
        </div>

        {/* Action buttons */}
        <div className="flex gap-2">
            <Link to={game.path} className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium text-center">
            Launch Game
            </Link>
        </div>
      </div>
    </div>
  );
  };

  const GameListItem = ({ game, index }: { game: any, index: number }) => {
    const colorOptions = [
      "from-orange-400 to-yellow-500",
      "from-pink-500 to-red-500",
      "from-purple-500 to-indigo-600",
      "from-blue-400 to-cyan-500",
      "from-green-500 to-teal-600"
    ];
    const gradientColor = colorOptions[index % colorOptions.length];
    
    const cardIcons = [Calculator, Calculator, Brain, PieChart, Lightning];
    const CardIcon = cardIcons[index % cardIcons.length];
    
    return (
    <div 
      className="bg-white rounded-xl shadow-md hover:shadow-lg transition-all duration-200 p-6 border border-gray-100"
      style={{ animationDelay: `${index * 30}ms` }}
    >
      <div className="flex items-center gap-6">
          <div className={`w-16 h-16 bg-gradient-to-br ${gradientColor} rounded-xl flex items-center justify-center flex-shrink-0`}>
            <CardIcon className="w-8 h-8 text-white" />
        </div>
        
        <div className="flex-1 min-w-0">
            <h3 className="text-lg font-bold text-gray-800 truncate">{game.title}</h3>
        </div>
        
        <div className="flex items-center gap-2 flex-shrink-0">
            <Link to={game.path} className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
            Launch
            </Link>
        </div>
      </div>
    </div>
  );
  };

  // Main app content
  if (isLoggedIn) {
    const redirectPath = formData.subject === 'Science' ? '/science' : '/math';
    const games = formData.subject === 'Science' ? scienceGames : mathGames;
    const filteredGames = filterAndSortGames(games);
    
    return (
      <AnimationProvider>
        <FullscreenManager>
          <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <header className="bg-white shadow">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                  <div className="flex">
                    <div className="flex-shrink-0 flex items-center">
                      {formData.subject === 'Science' ? (
                        <Atom className="h-8 w-8 text-purple-600" />
                      ) : (
                        <Calculator className="h-8 w-8 text-blue-600" />
                      )}
                      <span className="ml-2 text-xl font-bold">
                        {formData.subject} Games
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center">
                    <button
                      onClick={handleSignOut}
                      className="ml-3 inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-gray-700 bg-gray-100 hover:bg-gray-200"
                    >
                      Sign Out
                    </button>
                  </div>
                </div>
              </div>
            </header>

            {/* Main content */}
            <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
              {/* Subject hub pages */}
              {formData.subject === 'Science' && window.location.pathname === '/science' && <ScienceHub />}
              {formData.subject === 'Math' && window.location.pathname === '/math' && <MathHub />}

              {/* Game list header */}
              <div className="px-4 sm:px-0 mb-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <h2 className="text-2xl font-bold text-gray-900 mb-4 md:mb-0">
                    {formData.subject} Learning Games
                  </h2>
                  
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* View toggle */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setViewMode('grid')}
                        className={`p-2 rounded ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        <Grid3X3 className="h-5 w-5" />
                      </button>
                      <button
                        onClick={() => setViewMode('list')}
                        className={`p-2 rounded ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-gray-400 hover:text-gray-500'}`}
                      >
                        <List className="h-5 w-5" />
                      </button>
                    </div>
                    
                    {/* Difficulty filter */}
                    <div className="relative inline-block text-left">
                      <select
                        value={filterDifficulty}
                        onChange={(e) => setFilterDifficulty(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="all">All Difficulties</option>
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    
                    {/* Sort by */}
                    <div className="relative inline-block text-left">
                      <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value as any)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        <option value="popularity">Most Popular</option>
                        <option value="name">Name (A-Z)</option>
                        <option value="difficulty">Difficulty</option>
                        <option value="time">Time (Shortest)</option>
                      </select>
                    </div>

                    {/* Search */}
                    <div className="relative flex-grow maxw-xs">
                      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-4 w-4 text-gray-400" />
                      </div>
                      <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
                        placeholder="Search games..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Games Grid/List View */}
              {filteredGames.length > 0 ? (
                <div className={`${viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' : 'space-y-4'}`}>
                  {filteredGames.map((game, index) => (
                    viewMode === 'grid' ? 
                      <GameCard key={game.id} game={game} index={index} /> : 
                      <GameListItem key={game.id} game={game} index={index} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-16">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 mb-4">
                    <Search className="h-8 w-8 text-gray-400" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900 mb-1">No games found</h3>
                  <p className="text-gray-500">Try adjusting your search or filter criteria</p>
                </div>
              )}
            </main>
            
            {/* Routes for our application */}
            <Routes>
              <Route path="/" element={<Navigate to={redirectPath} />} />
              <Route path="/science" element={null} />
              <Route path="/math" element={null} />
              <Route path="/s1" element={<S1RainbowMaker />} />
              <Route path="/s2" element={<S2_MoonMagicExplorer />} />
              <Route path="/s3" element={<S3_LightningPower />} />
              <Route path="/s4" element={<S4_SecretSoundJourney />} />
              <Route path="/s5" element={<S5_WaterCycleAdventure />} />
              <Route path="/m1" element={<M1_NumberMysteries />} />
              <Route path="/m2" element={<M2_Magic9xFingerTrick />} />
              <Route path="/m3" element={<M3_CodeGrid />} />
              <Route path="/m4" element={<M4_PizzaFractions />} />
              <Route path="/m5" element={<M5_MazeMaster />} />
            </Routes>
          </div>
        </FullscreenManager>
      </AnimationProvider>
    );
  } else {
    // Login screen
    return (
      <FullscreenManager>
        <div className="min-h-screen bg-gradient-to-b from-blue-50 to-indigo-100 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-md w-full space-y-8 bg-white p-8 rounded-xl shadow-lg">
            <div className="text-center">
              <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center">
                <GraduationCap className="h-10 w-10 text-white" />
              </div>
              <h2 className="mt-6 text-3xl font-extrabold text-gray-900">Learning Platform</h2>
              <p className="mt-2 text-sm text-gray-600">
                Sign in to access interactive educational games
              </p>
            </div>
            
            <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
              <div className="rounded-md shadow-sm -space-y-px">
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email address</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="email"
                        name="email"
                      type="email"
                        autoComplete="email"
                        required
                        className={`appearance-none block w-full pl-10 pr-3 py-2 border ${errors.email ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="you@example.com"
                      value={formData.email}
                      onChange={handleInputChange}
                      />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                </div>

                <div className="mb-4">
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        id="password"
                      name="password"
                        type={showPassword ? "text" : "password"}
                        autoComplete="current-password"
                        required
                        className={`appearance-none block w-full pl-10 pr-10 py-2 border ${errors.password ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                        placeholder="Password"
                      value={formData.password}
                      onChange={handleInputChange}
                    />
                      <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                          className="text-gray-400 hover:text-gray-500 focus:outline-none"
                        >
                          {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                    </button>
                      </div>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Subject</label>
                <div className="grid grid-cols-2 gap-4">
                  <button
                    type="button"
                    className={`flex items-center justify-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      formData.subject === 'Math' 
                        ? 'bg-blue-50 border-blue-500 text-blue-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSubjectSelect('Math')}
                  >
                    <Calculator className={`h-5 w-5 ${formData.subject === 'Math' ? 'text-blue-500' : 'text-gray-500'} mr-2`} />
                    Mathematics
                  </button>
                  <button
                    type="button"
                    className={`flex items-center justify-center px-4 py-3 border rounded-md shadow-sm text-sm font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                      formData.subject === 'Science' 
                        ? 'bg-purple-50 border-purple-500 text-purple-700' 
                        : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleSubjectSelect('Science')}
                  >
                    <Atom className={`h-5 w-5 ${formData.subject === 'Science' ? 'text-purple-500' : 'text-gray-500'} mr-2`} />
                    Science
                  </button>
                </div>
                {errors.subject && <p className="mt-1 text-sm text-red-600">{errors.subject}</p>}
              </div>

              {errors.submit && (
                <div className="bg-red-50 border-l-4 border-red-400 p-4 mb-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <X className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                      <p className="text-sm text-red-700">
                        {errors.submit}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              <div>
              <button
                type="submit"
                disabled={isLoading}
                  className={`group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${isLoading ? 'opacity-70 cursor-not-allowed' : ''}`}
              >
                {isLoading ? (
                    <span className="flex items-center">
                      <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      Signing in...
                    </span>
                  ) : (
                    "Sign in"
                )}
              </button>
              </div>
              
              <div className="text-center text-xs text-gray-500 mt-4">
                <p>Demo credentials: savienglish@gmail.com / savi</p>
              </div>
            </form>
          </div>
        </div>
      </FullscreenManager>
    );
  }
}

export default App;