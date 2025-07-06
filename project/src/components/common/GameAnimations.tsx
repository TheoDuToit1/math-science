import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useSound } from './SoundPlayer';

// Animation types
export type AnimationType = 
  'correct' | 
  'wrong' | 
  'completion' | 
  'countdown' | 
  'celebrate' | 
  'shake' | 
  'pulse' | 
  'bounce' | 
  'fade' | 
  'transform';

// Context interface
interface AnimationContextType {
  playAnimation: (type: AnimationType, target?: string) => void;
  isAnimating: boolean;
  currentAnimation: AnimationType | null;
  currentTarget: string | null;
}

// Create context
const AnimationContext = createContext<AnimationContextType | undefined>(undefined);

// Provider component
export const AnimationProvider: React.FC<{children: ReactNode}> = ({ children }) => {
  const { playSound } = useSound();
  const [isAnimating, setIsAnimating] = useState(false);
  const [currentAnimation, setCurrentAnimation] = useState<AnimationType | null>(null);
  const [currentTarget, setCurrentTarget] = useState<string | null>(null);

  // Global CSS styles for animations
  useEffect(() => {
    // Create style element for global animations
    const style = document.createElement('style');
    style.id = 'game-animations-global';
    
    // Add global animation keyframes
    style.innerHTML = `
      @keyframes correctDropAnimation {
        0% { transform: scale(1); opacity: 0.7; }
        50% { transform: scale(1.2); opacity: 1; }
        100% { transform: scale(1); opacity: 1; }
      }
      
      @keyframes wrongDropAnimation {
        0%, 100% { transform: translateX(0); }
        20%, 60% { transform: translateX(-5px); }
        40%, 80% { transform: translateX(5px); }
      }
      
      @keyframes rocketLaunchAnimation {
        0% { transform: translateY(0); }
        100% { transform: translateY(-100vh); }
      }
      
      @keyframes pulseAnimation {
        0%, 100% { transform: scale(1); }
        50% { transform: scale(1.05); }
      }
      
      @keyframes fadeInAnimation {
        0% { opacity: 0; }
        100% { opacity: 1; }
      }
      
      @keyframes fadeOutAnimation {
        0% { opacity: 1; }
        100% { opacity: 0; }
      }
      
      .correct-drop {
        animation: correctDropAnimation 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275);
      }
      
      .wrong-drop {
        animation: wrongDropAnimation 0.5s cubic-bezier(0.36, 0.07, 0.19, 0.97);
      }
      
      .rocket-launch {
        animation: rocketLaunchAnimation 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
      }
      
      .pulse-effect {
        animation: pulseAnimation 1s infinite;
      }
      
      .fade-in {
        animation: fadeInAnimation 0.5s ease-in-out forwards;
      }
      
      .fade-out {
        animation: fadeOutAnimation 0.5s ease-in-out forwards;
      }
    `;
    
    // Add style element to head
    document.head.appendChild(style);
    
    // Clean up
    return () => {
      const existingStyle = document.getElementById('game-animations-global');
      if (existingStyle) {
        document.head.removeChild(existingStyle);
      }
    };
  }, []);
  
  // Play animation function
  const playAnimation = useCallback((type: AnimationType, target?: string) => {
    setIsAnimating(true);
    setCurrentAnimation(type);
    setCurrentTarget(target || null);

    // Reset after animation completes
    const animationDurations = {
      correct: 1500,
      wrong: 1000,
      completion: 3000,
      countdown: 3000,
      celebrate: 2000,
      shake: 500,
      pulse: 1000,
      bounce: 1000,
      fade: 1000,
      transform: 2000
    };

    setTimeout(() => {
      setIsAnimating(false);
      setCurrentAnimation(null);
      setCurrentTarget(null);
    }, animationDurations[type] || 1000);
  }, []);

  return (
    <AnimationContext.Provider value={{ 
      playAnimation, 
      isAnimating, 
      currentAnimation, 
      currentTarget 
    }}>
      {children}
      <GlobalAnimationEffects />
    </AnimationContext.Provider>
  );
};

// Hook for using animations
export const useAnimation = () => {
  const context = useContext(AnimationContext);
  if (context === undefined) {
    throw new Error('useAnimation must be used within an AnimationProvider');
  }
  return context;
};

// Global animation effects component
const GlobalAnimationEffects = () => {
  const { isAnimating, currentAnimation, currentTarget } = useAnimation();

  if (!isAnimating || !currentAnimation) {
    return null;
  }

  switch (currentAnimation) {
    case 'correct':
      return <CorrectAnimation target={currentTarget} />;
    case 'wrong':
      return <WrongAnimation target={currentTarget} />;
    case 'completion':
      return <CompletionAnimation target={currentTarget} />;
    case 'celebrate':
      return <CelebrationAnimation target={currentTarget} />;
    default:
      return null;
  }
};

// Specific animation components
const CorrectAnimation = ({ target }: { target: string | null }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-green-500 bg-opacity-10 animate-pulse-quick"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-green-500 text-9xl animate-correct-mark">✓</div>
      </div>
    </div>
  );
};

const WrongAnimation = ({ target }: { target: string | null }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-red-500 bg-opacity-10 animate-pulse-quick"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-red-500 text-9xl animate-wrong-mark">✗</div>
      </div>
    </div>
  );
};

const CompletionAnimation = ({ target }: { target: string | null }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-500 bg-opacity-20 animate-gradient-shift"></div>
      <div className="absolute top-1/4 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <div className="text-yellow-400 text-7xl font-bold animate-float text-center drop-shadow-lg">
          Great Job!
        </div>
      </div>
    </div>
  );
};

const CelebrationAnimation = ({ target }: { target: string | null }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      <div className="confetti-container">
        {Array(20).fill(0).map((_, i) => (
          <div 
            key={i} 
            className="confetti" 
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              backgroundColor: `hsl(${Math.random() * 360}, 80%, 60%)`
            }}
          />
        ))}
      </div>
    </div>
  );
};

// Styles for animations
export const AnimationStyles = () => (
  <style jsx global>{`
    /* Correct mark animation */
    @keyframes correct-mark {
      0% { opacity: 0; transform: scale(0.5); }
      50% { opacity: 1; transform: scale(1.2); }
      100% { opacity: 0; transform: scale(1); }
    }
    .animate-correct-mark {
      animation: correct-mark 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    /* Wrong mark animation */
    @keyframes wrong-mark {
      0% { opacity: 0; transform: scale(0.5) rotate(-45deg); }
      25% { opacity: 1; transform: scale(1.2) rotate(10deg); }
      50% { transform: scale(1.1) rotate(-10deg); }
      75% { transform: scale(1.1) rotate(10deg); }
      100% { opacity: 0; transform: scale(1) rotate(0); }
    }
    .animate-wrong-mark {
      animation: wrong-mark 1s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards;
    }
    
    /* Pulse animation */
    @keyframes pulse-quick {
      0% { opacity: 0; }
      50% { opacity: 1; }
      100% { opacity: 0; }
    }
    .animate-pulse-quick {
      animation: pulse-quick 1s ease-in-out;
    }
    
    /* Floating animation */
    @keyframes float {
      0% { opacity: 0; transform: translateY(20px); }
      20% { opacity: 1; }
      80% { opacity: 1; }
      100% { opacity: 0; transform: translateY(-50px); }
    }
    .animate-float {
      animation: float 3s ease-in-out forwards;
    }
    
    /* Gradient shift animation */
    @keyframes gradient-shift {
      0% { opacity: 0; }
      20% { opacity: 0.3; }
      80% { opacity: 0.3; }
      100% { opacity: 0; }
    }
    .animate-gradient-shift {
      animation: gradient-shift 3s ease-in-out forwards;
    }
    
    /* Confetti animation */
    .confetti-container {
      position: absolute;
      width: 100%;
      height: 100%;
      overflow: hidden;
    }
    .confetti {
      position: absolute;
      width: 10px;
      height: 20px;
      top: -20px;
      animation: confetti-fall 3s linear forwards;
    }
    @keyframes confetti-fall {
      0% {
        transform: translateY(0) rotateZ(0);
        opacity: 1;
      }
      75% {
        opacity: 1;
      }
      100% {
        transform: translateY(100vh) rotateZ(720deg);
        opacity: 0;
      }
    }
    
    /* Rocket animation styles */
    @keyframes rocket-launch {
      0% { transform: translateY(0) scale(1); }
      100% { transform: translateY(-100vh) scale(0.8); }
    }
    .rocket-launch {
      animation: rocket-launch 3s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards;
    }
    
    /* Flame animation */
    @keyframes flame {
      0%, 100% { height: 60px; opacity: 0.9; }
      50% { height: 80px; opacity: 1; }
    }
    .animate-flame {
      animation: flame 0.3s ease-in-out infinite;
    }
    
    /* Transform rocket parts animation */
    @keyframes rocket-part-transform {
      0% {
        opacity: 0;
        filter: brightness(1.5);
        transform: scale(0.95);
      }
      100% {
        opacity: 1;
        filter: brightness(1);
        transform: scale(1);
      }
    }
    .animate-rocket-part {
      animation: rocket-part-transform 1s forwards;
      animation-timing-function: cubic-bezier(0.34, 1.56, 0.64, 1);
    }
  `}</style>
);

export default AnimationProvider; 