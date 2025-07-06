import React, { useEffect, useState } from 'react';

interface ConfettiEffectProps {
  active: boolean;
  duration?: number;
  pieces?: number;
  colors?: string[];
}

const ConfettiEffect: React.FC<ConfettiEffectProps> = ({
  active,
  duration = 5000,
  pieces = 150,
  colors = [
    '#ff0000', '#00ff00', '#0000ff', '#ffff00', '#ff00ff', '#00ffff',
    '#ff8800', '#ff0088', '#8800ff', '#00ff88', '#88ff00', '#0088ff',
    '#ffcc00', '#00ffcc', '#cc00ff', '#ff00cc', '#ccff00', '#00ccff'
  ]
}) => {
  const [isActive, setIsActive] = useState(active);
  const [confetti, setConfetti] = useState<JSX.Element[]>([]);
  const [showEmojis, setShowEmojis] = useState(false);
  
  // Emojis for kids
  const emojis = ['🎉', '🎊', '🌟', '✨', '🏆', '🥇', '🎯', '🚀', '🧠', '👏', '🎈', '🎁'];
  
  // Create confetti pieces
  useEffect(() => {
    if (active && !isActive) {
      setIsActive(true);
      
      // First wave of confetti
      const createConfettiWave = (waveIndex: number = 0) => {
        const newConfetti = Array.from({ length: pieces }).map((_, i) => {
          const size = Math.floor(Math.random() * 12) + 5; // 5-17px
          const colorIndex = Math.floor(Math.random() * colors.length);
          
          // Distribute confetti across the screen with some randomness
          const left = `${Math.random() * 100}%`;
          
          // Start position varies by wave
          const topOffset = waveIndex * -30;
          const top = `${Math.random() * 60 - 60 + topOffset}%`; 
          
          const animationDuration = `${(Math.random() * 3) + 3}s`;
          const animationDelay = `${Math.random() * 0.5 + (waveIndex * 0.3)}s`;
          
          // Random shape: circle, square, triangle, star, or heart
          const shapes = ['circle', 'square', 'triangle', 'star', 'heart'];
          const shapeIndex = Math.floor(Math.random() * shapes.length);
          const shape = shapes[shapeIndex];
          
          // Random rotation
          const rotation = Math.random() * 360;
          const rotationEnd = rotation + Math.random() * 720 - 360;
          
          let style: React.CSSProperties = {
            position: 'absolute',
            backgroundColor: colors[colorIndex],
            width: `${size}px`,
            height: `${size}px`,
            left,
            top,
            opacity: 1,
            animationDuration,
            animationDelay,
            animationFillMode: 'forwards',
            animationTimingFunction: 'ease-out',
            animationName: 'confetti-fall',
            transform: `rotate(${rotation}deg)`,
            zIndex: 1000,
            boxShadow: '0 0 5px rgba(255, 255, 255, 0.3)'
          };
          
          // Apply shape-specific styles
          if (shape === 'circle') {
            style.borderRadius = '50%';
          } else if (shape === 'triangle') {
            return (
              <div 
                key={`${waveIndex}-${i}`} 
                style={{
                  ...style,
                  backgroundColor: 'transparent',
                  width: 0,
                  height: 0,
                  borderLeft: `${size / 2}px solid transparent`,
                  borderRight: `${size / 2}px solid transparent`,
                  borderBottom: `${size}px solid ${colors[colorIndex]}`,
                  boxShadow: 'none'
                }}
              />
            );
          } else if (shape === 'star') {
            return (
              <div
                key={`${waveIndex}-${i}`}
                style={{
                  ...style,
                  backgroundColor: 'transparent',
                  clipPath: 'polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)',
                  background: `linear-gradient(135deg, ${colors[colorIndex]} 0%, ${colors[(colorIndex + 1) % colors.length]} 100%)`,
                }}
              />
            );
          } else if (shape === 'heart') {
            return (
              <div
                key={`${waveIndex}-${i}`}
                style={{
                  ...style,
                  backgroundColor: 'transparent',
                  backgroundImage: `radial-gradient(${colors[colorIndex]} 30%, ${colors[(colorIndex + 2) % colors.length]} 70%)`,
                  clipPath: 'path("M12 21.593c-5.63-5.539-11-10.297-11-14.402 0-3.791 3.068-5.191 5.281-5.191 1.312 0 4.151.501 5.719 4.457 1.59-3.968 4.464-4.447 5.726-4.447 2.54 0 5.274 1.621 5.274 5.181 0 4.069-5.136 8.625-11 14.402z")',
                }}
              />
            );
          }
          
          return <div key={`${waveIndex}-${i}`} style={style} />;
        });
        
        return newConfetti;
      };
      
      // Create multiple waves of confetti
      const allConfetti = [
        ...createConfettiWave(0),
        ...createConfettiWave(1),
        ...createConfettiWave(2)
      ];
      
      setConfetti(allConfetti);
      
      // Show emoji celebration after a short delay
      setTimeout(() => {
        setShowEmojis(true);
      }, 800);
      
      // Cleanup after duration
      if (duration > 0) {
        setTimeout(() => {
          setIsActive(false);
          setShowEmojis(false);
        }, duration);
      }
    } else if (!active && isActive) {
      setIsActive(false);
      setShowEmojis(false);
    }
  }, [active, pieces, colors, duration, isActive, emojis]);

  // Create emoji elements
  const emojiElements = showEmojis ? emojis.map((emoji, index) => {
    const delay = Math.random() * 0.5;
    const size = Math.floor(Math.random() * 20) + 30; // 30-50px
    const left = `${10 + (index * 7)}%`;
    const duration = 1.5 + Math.random() * 1;
    
    return (
      <div
        key={`emoji-${index}`}
        className="emoji-pop"
        style={{
          position: 'absolute',
          fontSize: `${size}px`,
          left,
          top: '50%',
          opacity: 0,
          transform: 'scale(0.2)',
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`,
        }}
      >
        {emoji}
      </div>
    );
  }) : [];

  if (!isActive) return null;

  return (
    <div 
      style={{ 
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        overflow: 'hidden',
        zIndex: 100
      }}
    >
      {confetti}
      {emojiElements}
      
      <style jsx>{`
        @keyframes confetti-fall {
          0% {
            transform: translateY(-10vh) rotate(0deg);
            opacity: 1;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
          }
        }
        
        @keyframes emoji-pop {
          0% {
            transform: translateY(100px) scale(0.2);
            opacity: 0;
          }
          20% {
            transform: translateY(-20px) scale(1.2);
            opacity: 1;
          }
          40% {
            transform: translateY(-40px) scale(1);
            opacity: 1;
          }
          80% {
            transform: translateY(-100px) scale(1);
            opacity: 0.5;
          }
          100% {
            transform: translateY(-120px) scale(0.8);
            opacity: 0;
          }
        }
        
        .emoji-pop {
          animation-name: emoji-pop;
          animation-fill-mode: forwards;
          animation-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </div>
  );
};

export default ConfettiEffect; 