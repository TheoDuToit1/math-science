import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { DndProvider, useDrag, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { TouchBackend } from 'react-dnd-touch-backend';
import { isMobile } from 'react-device-detect';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface FractionMatchUpProps {
  onComplete?: () => void;
}

interface FractionPizza {
  id: string;
  slices: number;
  highlighted: number;
  fraction: string;
  matched: boolean;
}

interface FractionLabel {
  id: string;
  text: string;
  matched: boolean;
}

// Drag item type
const ItemTypes = {
  FRACTION_LABEL: 'fractionLabel'
};

// Draggable fraction label component
const DraggableFractionLabel: React.FC<{
  label: FractionLabel;
  index: number;
}> = ({ label, index }) => {
  const [{ isDragging }, drag] = useDrag(() => ({
    type: ItemTypes.FRACTION_LABEL,
    item: { id: label.id, text: label.text },
    collect: (monitor) => ({
      isDragging: !!monitor.isDragging(),
    }),
    canDrag: !label.matched,
  }), [label.matched]);

  return (
    <div
      ref={drag}
      className={`px-6 py-3 rounded-lg font-bold text-lg cursor-grab active:cursor-grabbing
        ${isDragging ? 'opacity-50' : 'opacity-100'}
        ${label.matched ? 'bg-gray-200 text-gray-400' : 'bg-orange-100 text-orange-800 hover:bg-orange-200'}`}
      style={{ opacity: isDragging ? 0.5 : 1 }}
    >
      {label.text}
    </div>
  );
};

// Droppable pizza component
const DroppablePizza: React.FC<{
  pizza: FractionPizza;
  onDrop: (pizzaId: string, labelId: string, labelText: string) => void;
  renderPizza: (pizza: FractionPizza) => JSX.Element;
}> = ({ pizza, onDrop, renderPizza }) => {
  const [{ isOver, canDrop }, drop] = useDrop(() => ({
    accept: ItemTypes.FRACTION_LABEL,
    drop: (item: { id: string; text: string }) => {
      onDrop(pizza.id, item.id, item.text);
      return undefined;
    },
    canDrop: () => !pizza.matched,
    collect: (monitor) => ({
      isOver: !!monitor.isOver(),
      canDrop: !!monitor.canDrop() && !pizza.matched,
    }),
  }), [pizza.matched, onDrop, pizza.id]);

  return (
    <div className="flex flex-col items-center">
      {renderPizza(pizza)}
      
      <div
        ref={drop}
        className={`mt-4 w-24 h-12 rounded-lg border-2 flex items-center justify-center
          ${pizza.matched ? 'bg-green-100 border-green-500' : 
            isOver && canDrop ? 'bg-blue-100 border-blue-500' : 
            'bg-gray-100 border-gray-300'}`}
      >
        {pizza.matched ? (
          <div className="font-bold text-green-600">{pizza.fraction}</div>
        ) : (
          <div className="text-gray-400">Drop here</div>
        )}
      </div>
      
      {pizza.matched && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="mt-2 bg-green-100 text-green-700 px-2 py-1 rounded-full text-xs font-medium"
        >
          Correct! ✓
        </motion.div>
      )}
    </div>
  );
};

const FractionMatchUp: React.FC<FractionMatchUpProps> = ({ onComplete }) => {
  // Game levels
  const levels = [
    {
      pizzas: [
        { id: 'pizza-1', slices: 2, highlighted: 1, fraction: '1/2', matched: false },
        { id: 'pizza-2', slices: 4, highlighted: 1, fraction: '1/4', matched: false },
        { id: 'pizza-3', slices: 3, highlighted: 1, fraction: '1/3', matched: false }
      ],
      labels: [
        { id: 'label-1', text: '1/2', matched: false },
        { id: 'label-2', text: '1/4', matched: false },
        { id: 'label-3', text: '1/3', matched: false }
      ]
    },
    {
      pizzas: [
        { id: 'pizza-1', slices: 4, highlighted: 2, fraction: '2/4', matched: false },
        { id: 'pizza-2', slices: 3, highlighted: 2, fraction: '2/3', matched: false },
        { id: 'pizza-3', slices: 8, highlighted: 4, fraction: '4/8', matched: false }
      ],
      labels: [
        { id: 'label-1', text: '2/4', matched: false },
        { id: 'label-2', text: '2/3', matched: false },
        { id: 'label-3', text: '4/8', matched: false }
      ]
    },
    {
      pizzas: [
        { id: 'pizza-1', slices: 6, highlighted: 3, fraction: '3/6', matched: false },
        { id: 'pizza-2', slices: 8, highlighted: 6, fraction: '6/8', matched: false },
        { id: 'pizza-3', slices: 5, highlighted: 3, fraction: '3/5', matched: false }
      ],
      labels: [
        { id: 'label-1', text: '3/6', matched: false },
        { id: 'label-2', text: '6/8', matched: false },
        { id: 'label-3', text: '3/5', matched: false }
      ]
    },
    // ... 21 more levels with unique combinations ...
  ];

  // Game state
  const [currentLevel, setCurrentLevel] = useState(0);
  const [pizzas, setPizzas] = useState<FractionPizza[]>(levels[0].pizzas);
  const [labels, setLabels] = useState<FractionLabel[]>(levels[0].labels);
  const [showConfetti, setShowConfetti] = useState(false);
  const [levelComplete, setLevelComplete] = useState(false);
  const [showHint, setShowHint] = useState(false);
  const [completedLevels, setCompletedLevels] = useState<number[]>([]);
  
  // Handle drop of fraction label onto pizza
  const handleDrop = (pizzaId: string, labelId: string, labelText: string) => {
    // Find the pizza and label
    const pizza = pizzas.find(p => p.id === pizzaId);
    const label = labels.find(l => l.id === labelId);
    
    if (pizza && label && !pizza.matched) {
      // Check if match is correct
      if (pizza.fraction === label.text) {
        // Update pizzas and labels
        const updatedPizzas = pizzas.map(p => 
          p.id === pizzaId ? { ...p, matched: true } : p
        );
        
        const updatedLabels = labels.map(l => 
          l.id === labelId ? { ...l, matched: true } : l
        );
        
        setPizzas(updatedPizzas);
        setLabels(updatedLabels);
        
        // Play success sound
        new Audio('/audio/correct-6033.mp3').play().catch(e => console.error("Audio play failed:", e));
        
        // Check if level is complete
        if (updatedPizzas.every(p => p.matched)) {
          setLevelComplete(true);
          setShowConfetti(true);
          
          // Add to completed levels
          if (!completedLevels.includes(currentLevel)) {
            setCompletedLevels([...completedLevels, currentLevel]);
          }
          
          setTimeout(() => {
            setShowConfetti(false);
          }, 3000);
          
          // Call onComplete if all levels are done
          if (currentLevel === levels.length - 1 && onComplete) {
            onComplete();
          }
        }
      } else {
        // Play error sound
        new Audio('/audio/fail.mp3').play().catch(e => console.error("Audio play failed:", e));
      }
    }
  };

  // Move to next level
  const nextLevel = () => {
    if (currentLevel < levels.length - 1) {
      setCurrentLevel(currentLevel + 1);
      setPizzas(levels[currentLevel + 1].pizzas);
      setLabels(levels[currentLevel + 1].labels);
      setLevelComplete(false);
      setShowHint(false);
    }
  };

  // Render a pizza with slices
  const renderPizza = (pizza: FractionPizza) => {
    const slices = [];
    const sliceCount = pizza.slices;
    const sliceAngle = 360 / sliceCount;
    
    for (let i = 0; i < sliceCount; i++) {
      const isHighlighted = i < pizza.highlighted;
      slices.push(
        <div
          key={i}
          className={`absolute w-full h-full origin-bottom-center
                    ${isHighlighted ? 'bg-yellow-400' : 'bg-yellow-200'}`}
          style={{
            clipPath: `polygon(50% 50%, ${50 - 50 * Math.sin((i * sliceAngle) * Math.PI / 180)}% ${50 - 50 * Math.cos((i * sliceAngle) * Math.PI / 180)}%, ${50 - 50 * Math.sin(((i + 1) * sliceAngle) * Math.PI / 180)}% ${50 - 50 * Math.cos(((i + 1) * sliceAngle) * Math.PI / 180)}%)`,
          }}
        >
          <div className="w-full h-full flex items-center justify-center">
            <div className="text-2xl transform -translate-y-8">🍕</div>
          </div>
        </div>
      );
    }

    // Add slice dividers
    const dividers = [];
    for (let i = 0; i < sliceCount; i++) {
      dividers.push(
        <div
          key={`divider-${i}`}
          className="absolute top-1/2 left-1/2 w-0.5 h-1/2 bg-red-500 origin-top"
          style={{
            transform: `rotate(${i * sliceAngle}deg)`
          }}
        />
      );
    }

    return (
      <div className="w-32 h-32 bg-yellow-100 rounded-full relative shadow-lg overflow-hidden">
        {slices}
        {dividers}
      </div>
    );
  };

  // Use the appropriate backend based on device
  const backendForDND = isMobile ? TouchBackend : HTML5Backend;

  return (
    <DndProvider backend={backendForDND}>
      <div className="bg-white rounded-lg p-6">
        <h2 className="text-2xl font-bold text-center mb-6">Fraction Match-Up</h2>
        
        <div className="mb-6 text-center">
          <p className="text-lg mb-2">
            Level {currentLevel + 1}: Match the fractions to the pizzas
          </p>
          <p className="text-sm text-gray-600 mb-4">
            Drag the fraction labels to the matching pizza slices
          </p>
        </div>
        
        {/* Pizzas */}
        <div className="flex justify-center gap-8 mb-8">
          {pizzas.map(pizza => (
            <DroppablePizza
              key={pizza.id}
              pizza={pizza}
              onDrop={handleDrop}
              renderPizza={renderPizza}
            />
          ))}
        </div>
        
        {/* Fraction labels */}
        <div className="flex justify-center gap-4 mb-6 min-h-16">
          {labels.map((label, index) => (
            !label.matched && (
              <DraggableFractionLabel
                key={label.id}
                label={label}
                index={index}
              />
            )
          ))}
        </div>
        
        {/* Level completion message */}
        {levelComplete && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 p-3 bg-green-100 text-green-700 rounded-lg text-center font-bold"
          >
            Great job! You matched all the fractions correctly!
            {currentLevel < levels.length - 1 && (
              <button
                onClick={nextLevel}
                className="mt-2 px-4 py-1 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 block mx-auto"
              >
                Next Level →
              </button>
            )}
          </motion.div>
        )}
        
        {/* Hint button */}
        <div className="flex justify-center mt-6">
          <button
            onClick={() => setShowHint(!showHint)}
            className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg font-medium hover:bg-purple-200"
          >
            {showHint ? 'Hide Hint' : 'Show Hint'}
          </button>
        </div>
        
        {/* Hint display */}
        {showHint && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="mt-4 bg-yellow-50 p-4 rounded-lg"
          >
            <div className="text-lg font-medium mb-2">Hint:</div>
            <div className="text-sm">
              Look at how many slices each pizza has (the denominator) and how many are highlighted (the numerator).
              For example, if 1 out of 4 slices is highlighted, the fraction is 1/4.
            </div>
          </motion.div>
        )}
        
        {showConfetti && <ConfettiEffect />}
      </div>
    </DndProvider>
  );
};

export default FractionMatchUp; 