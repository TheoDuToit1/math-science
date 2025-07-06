import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Material {
  id: string;
  name: string;
  speed: number; // relative speed 1-10
  color: string;
}

const TravelTracker: React.FC = () => {
  const [selectedMaterial, setSelectedMaterial] = useState<string | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [showResult, setShowResult] = useState(false);

  const materials: Material[] = [
    { id: 'air', name: 'Air', speed: 3, color: 'bg-blue-100' },
    { id: 'water', name: 'Water', speed: 6, color: 'bg-blue-400' },
    { id: 'metal', name: 'Metal', speed: 10, color: 'bg-gray-400' },
  ];

  const handleMaterialClick = (materialId: string) => {
    if (isAnimating) return;
    
    setSelectedMaterial(materialId);
    setIsAnimating(true);
    setShowResult(false);
    
    // Play bell sound
    const audio = new Audio('/audio/correct.mp3');
    audio.play();
    
    // Show result after animation completes
    setTimeout(() => {
      setIsAnimating(false);
      setShowResult(true);
    }, 2000);
  };

  const getMaterial = (id: string | null) => {
    return materials.find(m => m.id === id) || materials[0];
  };

  const getSpeedLabel = (speed: number) => {
    if (speed <= 3) return 'Slowest!';
    if (speed <= 7) return 'In the middle!';
    return 'Fastest!';
  };

  const getAnimationDuration = (speed: number) => {
    // Convert speed (1-10) to duration (2-0.5 seconds)
    return 2 - (speed / 10) * 1.5;
  };

  return (
    <div className="p-4 bg-white rounded-lg shadow">
      <h3 className="text-xl font-bold text-center mb-4">Sound Travel Tracker</h3>
      
      <div className="mb-6">
        <p className="text-center mb-4">Tap on each material to see how fast sound travels through it!</p>
      </div>

      <div className="relative h-64 mb-8 bg-gray-100 rounded-lg overflow-hidden">
        {/* Bell and sound wave animation */}
        <div className="absolute left-4 top-1/2 transform -translate-y-1/2">
          <img 
            src="/images/science/s4_secret_sound_journey/bell.png" 
            alt="Bell" 
            className="w-16 h-16 object-contain"
          />
        </div>
        
        {/* Material visualization */}
        <div className={`absolute inset-0 ${selectedMaterial ? getMaterial(selectedMaterial).color : 'bg-transparent'} opacity-40`}></div>
        
        {/* Sound wave animation */}
        {isAnimating && (
          <>
            <motion.div
              className="absolute left-20 top-1/2 w-4 h-4 bg-indigo-600 rounded-full"
              initial={{ x: 0, opacity: 1, scale: 0.5 }}
              animate={{ 
                x: 240,
                opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                scale: [0.5, 1, 1.5, 2, 2.5, 3]
              }}
              transition={{ 
                duration: getAnimationDuration(getMaterial(selectedMaterial).speed),
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute left-20 top-1/2 w-4 h-4 bg-indigo-600 rounded-full"
              initial={{ x: 0, opacity: 1, scale: 0.5 }}
              animate={{ 
                x: 240,
                opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                scale: [0.5, 1, 1.5, 2, 2.5, 3]
              }}
              transition={{ 
                duration: getAnimationDuration(getMaterial(selectedMaterial).speed),
                delay: 0.3,
                ease: "linear"
              }}
            />
            <motion.div
              className="absolute left-20 top-1/2 w-4 h-4 bg-indigo-600 rounded-full"
              initial={{ x: 0, opacity: 1, scale: 0.5 }}
              animate={{ 
                x: 240,
                opacity: [1, 0.8, 0.6, 0.4, 0.2, 0],
                scale: [0.5, 1, 1.5, 2, 2.5, 3]
              }}
              transition={{ 
                duration: getAnimationDuration(getMaterial(selectedMaterial).speed),
                delay: 0.6,
                ease: "linear"
              }}
            />
          </>
        )}
        
        {/* Ear on the right side */}
        <div className="absolute right-4 top-1/2 transform -translate-y-1/2 text-4xl">
          👂
        </div>
        
        {/* Speed meter */}
        {showResult && selectedMaterial && (
          <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 w-3/4">
            <div className="h-6 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-blue-300 to-blue-600 rounded-full"
                style={{ width: `${getMaterial(selectedMaterial).speed * 10}%` }}
              ></div>
            </div>
            <div className="mt-2 text-center font-bold">
              {getSpeedLabel(getMaterial(selectedMaterial).speed)}
            </div>
          </div>
        )}
      </div>

      {/* Material selection buttons */}
      <div className="grid grid-cols-3 gap-4">
        {materials.map(material => (
          <button
            key={material.id}
            className={`p-4 rounded-lg font-semibold transition-colors ${
              selectedMaterial === material.id 
                ? `${material.color} border-2 border-blue-600`
                : `${material.color} hover:opacity-80`
            }`}
            onClick={() => handleMaterialClick(material.id)}
            disabled={isAnimating}
          >
            {material.name}
          </button>
        ))}
      </div>
      
      {/* Learning note */}
      <div className="mt-6 p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
        <p className="font-medium">Sound travels fastest in solids, slower in liquids, and slowest in gases!</p>
      </div>
    </div>
  );
};

export default TravelTracker; 