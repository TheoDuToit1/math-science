import React, { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { playSoundEffect } from '../../common/SoundPlayer';

const MATERIALS = [
  { name: 'Copper Wire', icon: '🔌', isConductor: true },
  { name: 'Water', icon: '💧', isConductor: true },
  { name: 'Metal Pole', icon: '🧲', isConductor: true },
  { name: 'Wood', icon: '🪵', isConductor: false },
  { name: 'Plastic', icon: '🧴', isConductor: false },
  { name: 'Rubber', icon: '🧤', isConductor: false },
];

const CONDUCTORS = MATERIALS.filter(m => m.isConductor);
const INSULATORS = MATERIALS.filter(m => !m.isConductor);

function shuffleArray(arr) {
  return arr.map(a => [Math.random(), a]).sort((a, b) => a[0] - b[0]).map(a => a[1]);
}

function generateColumnsAndLabels() {
  const winningCol = shuffleArray([...CONDUCTORS]);
  const otherCols = [0, 1].map(() => shuffleArray(MATERIALS).slice(0, 3));
  // Pair columns with labels
  const base = [
    { col: winningCol, label: 'A' },
    { col: otherCols[0], label: 'B' },
    { col: otherCols[1], label: 'C' },
  ];
  const shuffled = shuffleArray(base);
  return {
    columns: shuffled.map(x => x.col),
    labels: shuffled.map(x => x.label),
  };
}

const cloudImg = '/images/science/s3_lightning_power/storm-cloud.png';
const groundImg = '/images/science/s3_lightning_power/ground.jpg';

const COLUMN_LABELS = ['A', 'B', 'C'];
const COLUMN_COLORS = ['from-blue-300 to-blue-100', 'from-purple-300 to-purple-100', 'from-yellow-200 to-yellow-50'];
const TOTAL_MINIGAMES = 5;
const TRIES_PER_MINIGAME = 7;

const tips = [
  'Copper, water, and metal are great conductors!',
  'Wood, plastic, and rubber block electricity.',
  'Lightning always chooses the easiest path!',
  'Try to find a column with all conductors!',
];

// Generate a random lightning path with branches
const generateLightningPath = (startX: number, startY: number, endX: number, endY: number, maxOffset: number = 30) => {
  const segments = 12;
  const segmentLength = (endY - startY) / segments;
  
  let path = `M ${startX} ${startY} `;
  let currentX = startX;
  let currentY = startY;
  
  // Main lightning bolt
  for (let i = 0; i < segments; i++) {
    const nextY = currentY + segmentLength;
    const nextX = currentX + (Math.random() * maxOffset * 2 - maxOffset);
    path += `L ${nextX} ${nextY} `;
    
    // Add branches with 30% probability
    if (Math.random() < 0.3 && i > 0 && i < segments - 2) {
      const branchLength = segmentLength * (0.3 + Math.random() * 0.7);
      const branchX = nextX + (Math.random() * maxOffset * 1.5 - maxOffset * 0.75);
      const branchY = nextY + branchLength;
      path += `M ${nextX} ${nextY} L ${branchX} ${branchY} M ${nextX} ${nextY} `;
    }
    
    currentX = nextX;
    currentY = nextY;
  }
  
  return path;
};

const LightningBolt = ({ isVisible, selectedColumn }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  
  // Calculate column offset based on which column was selected
  const columnOffset = useMemo(() => {
    if (selectedColumn === 0) return -80;
    if (selectedColumn === 2) return 80;
    return 0;
  }, [selectedColumn]);
  
  useEffect(() => {
    if (isVisible) {
      // Generate multiple lightning paths for a more dynamic effect
      const mainPath = generateLightningPath(columnOffset, 0, columnOffset, 240);
      const secondaryPath = generateLightningPath(columnOffset + 5, 0, columnOffset + 5, 240);
      const tertiaryPath = generateLightningPath(columnOffset - 5, 0, columnOffset - 5, 240);
      setPaths([mainPath, secondaryPath, tertiaryPath]);
      
      // Create flash effect
      setFlashOpacity(0.7);
      setTimeout(() => setFlashOpacity(0), 100);
      setTimeout(() => {
        setFlashOpacity(0.5);
        setTimeout(() => setFlashOpacity(0), 100);
      }, 300);
      
      // Play thunder sound
      playSoundEffect('fail'); // Using fail sound as thunder
      
      // Regenerate paths every 800ms for animation effect
      const interval = setInterval(() => {
        const newMainPath = generateLightningPath(columnOffset, 0, columnOffset, 240);
        const newSecondaryPath = generateLightningPath(columnOffset + 5, 0, columnOffset + 5, 240);
        const newTertiaryPath = generateLightningPath(columnOffset - 5, 0, columnOffset - 5, 240);
        setPaths([newMainPath, newSecondaryPath, newTertiaryPath]);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isVisible, columnOffset]);

  if (!isVisible) return null;
  
  return (
    <>
      {/* Screen flash effect */}
      <div 
        className="fixed inset-0 bg-white pointer-events-none z-50 transition-opacity duration-100"
        style={{ opacity: flashOpacity }}
      />
      
      {/* Lightning SVG */}
      <svg 
        className="absolute left-1/2 top-40 -translate-x-1/2 z-20" 
        width="240" 
        height="240" 
        viewBox="-120 0 240 240"
      >
        {paths.map((path, index) => (
          <motion.path
            key={index}
            d={path}
            stroke={index === 0 ? "#ffffff" : "#fef9c3"}
            strokeWidth={index === 0 ? 4 : 2}
            fill="none"
            strokeLinecap="round"
            strokeLinejoin="round"
            filter={`drop-shadow(0 0 ${8 - index * 2}px #fef08a)`}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={{ 
              pathLength: [0, 1, 1, 0.8, 1], 
              opacity: [0, 1, 0.8, 1, 0.9] 
            }}
            transition={{ 
              duration: 0.8, 
              ease: "easeInOut",
              repeat: Infinity,
              repeatType: "loop"
            }}
          />
        ))}
        
        {/* Glow effect */}
        <defs>
          <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
            <feGaussianBlur stdDeviation="4" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
      </svg>
    </>
  );
};

const StrikePathPuzzle: React.FC = () => {
  const [miniGame, setMiniGame] = useState(0); // 0-based index
  const [{ columns, labels }, setColumnsAndLabels] = useState(() => generateColumnsAndLabels());
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<'success' | 'fail' | null>(null);
  const [tries, setTries] = useState(0);
  const [animating, setAnimating] = useState(false);
  const [tip, setTip] = useState('Help me find the fastest path to the ground!');
  const [completed, setCompleted] = useState(false);

  const handleColumnClick = (colIdx: number) => {
    if (tries >= TRIES_PER_MINIGAME || animating || completed) return;
    setSelected(colIdx);
    setAnimating(true);
    setTimeout(() => {
      const isPath = columns[colIdx].every((mat) => mat.isConductor);
      if (isPath) {
        setResult('success');
        playSoundEffect('correct-6033');
        setTip('⚡ ZAP! Lightning found its path!');
        setTimeout(() => {
          advanceMiniGame();
        }, 2000); // Longer delay to see the animation
      } else {
        setResult('fail');
        playSoundEffect('fail');
        setTries((t) => t + 1);
        setTip(tips[Math.floor(Math.random() * tips.length)]);
        if (tries + 1 >= TRIES_PER_MINIGAME) {
          setTimeout(() => {
            advanceMiniGame();
          }, 1200);
        } else {
          setTimeout(() => {
            setAnimating(false);
            setSelected(null);
          }, 1200);
        }
      }
    }, 900);
  };

  function advanceMiniGame() {
    if (miniGame + 1 < TOTAL_MINIGAMES) {
      setMiniGame(m => m + 1);
      setColumnsAndLabels(generateColumnsAndLabels());
      setSelected(null);
      setResult(null);
      setTries(0);
      setTip('Help me find the fastest path to the ground!');
      setAnimating(false);
    } else {
      setCompleted(true);
      setTip('🎉 You completed all the lightning path puzzles!');
    }
  }

  const isDisabled = tries >= TRIES_PER_MINIGAME || result === 'success' || completed;

  return (
    <div className="w-full max-w-2xl mx-auto flex flex-col items-center relative min-h-[520px] rounded-xl overflow-hidden" style={{ background: 'linear-gradient(180deg, #e0e7ff 0%, #f3e8ff 60%, #fef9c3 100%)' }}>
      {/* Progress Indicator */}
      <div className="absolute left-4 top-4 flex items-center gap-2 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow text-indigo-700 font-bold text-base">
        <span>Mini-game:</span>
        <span className="text-xl">{Math.min(miniGame + 1, TOTAL_MINIGAMES)}/{TOTAL_MINIGAMES}</span>
        <span className="text-yellow-400">⚡</span>
      </div>
      {/* Animated Cloud & Speech Bubble */}
      <div className="flex flex-col items-center mt-6 mb-2 relative">
        <motion.img 
          src={cloudImg} 
          alt="Cloud" 
          className="w-32 h-20 object-contain opacity-90"
          animate={{ 
            y: [0, -12, 0],
            filter: result === 'success' ? "brightness(1.2) drop-shadow(0 0 8px #fde047)" : "brightness(1)"
          }}
          transition={{ 
            y: { duration: 3, repeat: Infinity, repeatType: "reverse" },
            filter: { duration: 0.3, repeat: result === 'success' ? Infinity : 0, repeatType: "reverse" }
          }}
        />
        <AnimatePresence mode="wait">
          <motion.div 
            key={tip}
            className="absolute left-1/2 -translate-x-1/2 top-0 -mt-10"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-white bg-opacity-90 border border-indigo-200 rounded-xl px-4 py-2 shadow text-indigo-700 font-semibold text-base min-w-[220px] text-center">
              {tip}
            </div>
          </motion.div>
        </AnimatePresence>
        <motion.div 
          className="text-3xl mt-2"
          animate={{ y: [0, -8, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🌩️
        </motion.div>
      </div>
      {/* Zig-zag path background */}
      <svg width="100%" height="60" className="absolute top-32 left-0 z-0" style={{ pointerEvents: 'none' }}>
        <polyline points="90,10 180,40 270,10 360,40" fill="none" stroke="#facc15" strokeWidth="4" strokeDasharray="8 8" opacity="0.3" />
      </svg>
      {/* Columns in arc */}
      <div className="flex flex-row justify-center gap-8 mb-2 z-10 w-full mt-8 sm:mt-4">
        {columns.map((col, colIdx) => (
          <motion.button
            key={colIdx}
            className={`flex flex-col items-center gap-2 px-2 py-1 rounded-2xl border-4 shadow-lg transition-all duration-300 bg-gradient-to-b ${COLUMN_COLORS[colIdx]}
              ${isDisabled ? 'opacity-60 cursor-not-allowed' : 'hover:scale-105 hover:ring-4 hover:ring-yellow-200'}
              ${selected === colIdx && animating ? 'ring-8 ring-yellow-400 scale-110' : ''}
              ${result === 'fail' && selected === colIdx ? 'animate-shake' : ''}`}
            onClick={() => handleColumnClick(colIdx)}
            disabled={isDisabled}
            style={{ minWidth: 90 }}
            aria-label={`Column ${labels[colIdx]}`}
            whileHover={!isDisabled ? { scale: 1.05 } : {}}
            animate={
              result === 'success' && selected === colIdx 
                ? { 
                    boxShadow: ['0 0 0px rgba(250, 204, 21, 0)', '0 0 20px rgba(250, 204, 21, 0.7)', '0 0 0px rgba(250, 204, 21, 0)'],
                  } 
                : {}
            }
            transition={{ duration: 1, repeat: result === 'success' && selected === colIdx ? Infinity : 0 }}
          >
            <div className="flex items-center gap-1 text-lg font-extrabold text-indigo-700 mb-1">
              <span className="text-2xl">{labels[colIdx]}</span>
              <span className="text-yellow-400 text-xl">⚡</span>
            </div>
            {col.map((mat, i) => (
              <motion.div 
                key={i} 
                className={`flex flex-col items-center justify-center w-16 h-14 rounded-xl shadow-lg text-lg font-semibold border-2 mb-1 transition-all duration-200
                  ${mat.isConductor ? 'border-yellow-400 bg-yellow-50' : 'border-gray-300 bg-gray-50'}
                  ${result === 'fail' && selected === colIdx ? 'bg-red-200 border-red-400 animate-fail' : ''}`}
                animate={
                  mat.isConductor 
                    ? { boxShadow: ['0 0 0px rgba(250, 204, 21, 0)', '0 0 8px rgba(250, 204, 21, 0.6)', '0 0 0px rgba(250, 204, 21, 0)'] }
                    : {}
                }
                transition={{ duration: 2, repeat: Infinity }}
              >
                <motion.span 
                  className="text-3xl mb-0.5"
                  animate={{ y: [0, -6, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  {mat.icon}
                </motion.span>
                <span className="text-xs font-bold text-gray-700">{mat.name}</span>
              </motion.div>
            ))}
          </motion.button>
        ))}
      </div>
      {/* Lightning animation */}
      <LightningBolt isVisible={result === 'success'} selectedColumn={selected} />
      {/* Ground */}
      <div className="flex flex-col items-center mt-4 mb-2 relative">
        <motion.img 
          src={groundImg} 
          alt="Ground" 
          className="w-full h-14 object-cover rounded-b-xl opacity-95"
          animate={{ 
            filter: result === 'success' ? "brightness(1.2) drop-shadow(0 0 12px #facc15)" : "brightness(1)"
          }}
          transition={{ duration: 0.3, repeat: result === 'success' ? Infinity : 0, repeatType: "reverse" }}
        />
        <motion.div 
          className="text-3xl mt-1"
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          🌍
        </motion.div>
      </div>
      {/* Tries left */}
      <div className="absolute right-4 top-4 flex items-center gap-2 bg-white bg-opacity-80 rounded-full px-3 py-1 shadow text-indigo-700 font-bold text-base">
        <span>Tries left:</span>
        <span className="text-xl">{completed ? 0 : TRIES_PER_MINIGAME - tries}</span>
        <span className="text-yellow-400">🔋</span>
      </div>
      {/* Feedback */}
      <AnimatePresence mode="wait">
        <motion.div 
          key={`${result}-${completed}`}
          className="mt-2 text-center text-lg font-semibold text-indigo-700 bg-white bg-opacity-70 px-4 py-2 rounded-full shadow-md"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3 }}
        >
          {completed && '🎉 You completed all the lightning path puzzles!'}
          {!completed && result === 'success' && '⚡ ZAP! Lightning found its path!'}
          {!completed && result === 'fail' && tries < TRIES_PER_MINIGAME && '⚠️ Lightning fizzled! Try another path.'}
          {!completed && tries >= TRIES_PER_MINIGAME && result !== 'success' && 'Try Again Later!'}
          {!completed && !result && 'Choose a column to build a lightning path!'}
        </motion.div>
      </AnimatePresence>
      {/* CSS for animations */}
      <style>{`
        @keyframes shake {
          0% { transform: translateX(0); }
          20% { transform: translateX(-8px); }
          40% { transform: translateX(8px); }
          60% { transform: translateX(-8px); }
          80% { transform: translateX(8px); }
          100% { transform: translateX(0); }
        }
        .animate-shake {
          animation: shake 0.4s;
        }
        @keyframes fail-flash {
          0% { background: #fecaca; }
          100% { background: inherit; }
        }
        .animate-fail {
          animation: fail-flash 0.7s;
        }
      `}</style>
    </div>
  );
};

export default StrikePathPuzzle; 