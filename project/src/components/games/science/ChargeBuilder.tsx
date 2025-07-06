import React, { useState, useCallback } from 'react';
import { useDrop, useDrag, DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { motion, AnimatePresence } from 'framer-motion';
import { playSoundEffect } from '../../common/SoundPlayer';

const CHARGE_NEG = 'neg';
const CHARGE_POS = 'pos';

const negCharges = Array(3).fill(null).map((_, i) => ({ id: `neg-${i}` }));
const posCharges = Array(3).fill(null).map((_, i) => ({ id: `pos-${i}` }));

const cloudImg = '/images/science/s3_lightning_power/storm-cloud.png';
const groundImg = '/images/science/s3_lightning_power/ground.jpg';

function Charge({ type, id, isPlaced }: { type: string; id: string; isPlaced: boolean }) {
  const [{ isDragging }, drag] = useDrag(() => ({
    type,
    item: { id, type },
    canDrag: !isPlaced,
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  }), [isPlaced]);

  const style = {
    opacity: isDragging || isPlaced ? 0.5 : 1,
    cursor: isPlaced ? 'default' : 'grab',
    filter: isPlaced ? 'grayscale(60%)' : 'none',
    animation: !isPlaced ? 'pulse 1.2s infinite' : 'none',
  };

  return (
    <div ref={drag} style={style} className={`flex items-center justify-center w-12 h-12 rounded-full shadow-lg text-2xl font-bold select-none ${type === CHARGE_NEG ? 'bg-black text-white' : 'bg-yellow-300 text-yellow-900 border-2 border-yellow-500'}`}
      title={type === CHARGE_NEG ? 'Drag me to the cloud' : 'Drag me to the ground'}>
      {type === CHARGE_NEG ? '–' : '+'}
    </div>
  );
}

function DropZone({ accept, onDrop, children, highlight, label }: any) {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept,
    drop: onDrop,
    collect: (monitor) => ({
      isOver: monitor.isOver(),
      canDrop: monitor.canDrop(),
    }),
  }), [onDrop]);

  return (
    <div ref={drop} className={`relative flex flex-col items-center justify-center ${highlight ? 'ring-4 ring-yellow-400' : ''}`}
      style={{ minHeight: 100, minWidth: 180, transition: 'box-shadow 0.2s' }}>
      {children}
      {label && <div className="absolute bottom-0 left-1/2 -translate-x-1/2 text-xs bg-white bg-opacity-70 px-2 py-0.5 rounded shadow mt-1">{label}</div>}
      {isOver && canDrop && <div className="absolute inset-0 bg-yellow-100 bg-opacity-40 rounded-lg pointer-events-none" />}
    </div>
  );
}

// Generate a random lightning path with branches
const generateLightningPath = (startX: number, startY: number, endX: number, endY: number) => {
  const segments = 12;
  const segmentLength = (endY - startY) / segments;
  const maxOffset = 30;
  
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

const LightningBolt = ({ isVisible }: { isVisible: boolean }) => {
  const [paths, setPaths] = useState<string[]>([]);
  const [flashOpacity, setFlashOpacity] = useState(0);
  
  React.useEffect(() => {
    if (isVisible) {
      // Generate multiple lightning paths for a more dynamic effect
      const mainPath = generateLightningPath(0, 0, 0, 160);
      const secondaryPath = generateLightningPath(5, 0, 5, 160);
      const tertiaryPath = generateLightningPath(-5, 0, -5, 160);
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
        const newMainPath = generateLightningPath(0, 0, 0, 160);
        const newSecondaryPath = generateLightningPath(5, 0, 5, 160);
        const newTertiaryPath = generateLightningPath(-5, 0, -5, 160);
        setPaths([newMainPath, newSecondaryPath, newTertiaryPath]);
      }, 800);
      
      return () => clearInterval(interval);
    }
  }, [isVisible]);

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
        className="absolute left-1/2 top-32 -translate-x-1/2 z-20" 
        width="60" 
        height="160" 
        viewBox="-30 0 60 160"
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

const ChargeBuilderCore: React.FC = () => {
  const [placedNeg, setPlacedNeg] = useState<string[]>([]);
  const [placedPos, setPlacedPos] = useState<string[]>([]);
  const [showLightning, setShowLightning] = useState(false);
  const [showCelebration, setShowCelebration] = useState(false);

  const handleDropCloud = useCallback((item: { id: string }) => {
    if (!placedNeg.includes(item.id) && placedNeg.length < 3) {
      setPlacedNeg((prev) => [...prev, item.id]);
      playSoundEffect('correct-6033');
    }
  }, [placedNeg]);

  const handleDropGround = useCallback((item: { id: string }) => {
    if (!placedPos.includes(item.id) && placedPos.length < 3) {
      setPlacedPos((prev) => [...prev, item.id]);
      playSoundEffect('correct-6033');
    }
  }, [placedPos]);

  React.useEffect(() => {
    if (placedNeg.length === 3 && placedPos.length === 3 && !showLightning) {
      setTimeout(() => {
        setShowLightning(true);
        setTimeout(() => {
          setShowCelebration(true);
        }, 1200);
      }, 500);
    }
  }, [placedNeg, placedPos, showLightning]);

  return (
    <div className="w-full max-w-xl mx-auto flex flex-col items-center relative min-h-[420px]">
      {/* Cloud Drop Zone with glow effect when charged */}
      <motion.div
        animate={placedNeg.length === 3 ? { 
          boxShadow: ['0 0 0px rgba(250, 204, 21, 0)', '0 0 20px rgba(250, 204, 21, 0.7)', '0 0 0px rgba(250, 204, 21, 0)'],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="rounded-full"
      >
      <DropZone accept={CHARGE_NEG} onDrop={handleDropCloud} highlight={placedNeg.length < 3} label="Cloud">
        <img src={cloudImg} alt="Cloud" className="w-48 h-32 object-contain opacity-90 mb-2" />
        <div className="flex gap-2 absolute top-8 left-1/2 -translate-x-1/2">
          {negCharges.map((c, i) => placedNeg.includes(c.id) && (
              <motion.div 
                key={c.id} 
                className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-lg font-bold border-2 border-white"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >–</motion.div>
          ))}
        </div>
      </DropZone>
      </motion.div>

      {/* Lightning animation */}
      <LightningBolt isVisible={showLightning} />

      {/* Draggable Charges */}
      <div className="flex w-full justify-between items-center mt-4 mb-4 px-4">
        <div className="flex gap-2">
          {negCharges.map((c) => (
            <Charge key={c.id} type={CHARGE_NEG} id={c.id} isPlaced={placedNeg.includes(c.id) || showLightning} />
          ))}
        </div>
        <div className="flex gap-2">
          {posCharges.map((c) => (
            <Charge key={c.id} type={CHARGE_POS} id={c.id} isPlaced={placedPos.includes(c.id) || showLightning} />
          ))}
        </div>
      </div>

      {/* Ground Drop Zone with glow effect when charged */}
      <motion.div
        animate={placedPos.length === 3 ? { 
          boxShadow: ['0 0 0px rgba(250, 204, 21, 0)', '0 0 20px rgba(250, 204, 21, 0.7)', '0 0 0px rgba(250, 204, 21, 0)'],
        } : {}}
        transition={{ duration: 2, repeat: Infinity }}
        className="rounded-full w-full"
      >
      <DropZone accept={CHARGE_POS} onDrop={handleDropGround} highlight={placedPos.length < 3} label="Ground">
        <img src={groundImg} alt="Ground" className="w-full h-20 object-cover rounded-b-xl opacity-95" />
        <div className="flex gap-2 absolute bottom-4 left-1/2 -translate-x-1/2">
          {posCharges.map((c, i) => placedPos.includes(c.id) && (
              <motion.div 
                key={c.id} 
                className="w-8 h-8 bg-yellow-300 text-yellow-900 rounded-full flex items-center justify-center text-lg font-bold border-2 border-yellow-500"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: "spring", damping: 10 }}
              >+</motion.div>
          ))}
        </div>
      </DropZone>
      </motion.div>

      {/* Feedback and Celebration */}
      <AnimatePresence>
        {showCelebration ? (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 text-center text-xl font-bold text-indigo-700 bg-indigo-100 px-4 py-2 rounded-lg shadow-md"
          >
            ⚡ Zap! Lightning happens when charges connect!
          </motion.div>
        ) : (
          <motion.div 
            className="mt-4 text-center text-lg font-semibold text-indigo-700"
            animate={{ 
              opacity: [0.7, 1, 0.7],
              scale: [1, 1.02, 1]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Build the charge! Fill the cloud and ground.
          </motion.div>
        )}
      </AnimatePresence>

      {/* CSS for pulse and lightning animation */}
      <style>{`
        @keyframes pulse {
          0% { box-shadow: 0 0 0 0 #fef08a66; }
          70% { box-shadow: 0 0 0 10px #fef08a22; }
          100% { box-shadow: 0 0 0 0 #fef08a00; }
        }
      `}</style>
    </div>
  );
};

const ChargeBuilder: React.FC = () => (
  <DndProvider backend={HTML5Backend}>
    <ChargeBuilderCore />
  </DndProvider>
);

export default ChargeBuilder; 