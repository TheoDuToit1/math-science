import React, { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';

interface SequenceStep {
  id: string;
  text: string;
  image?: string;
  correctPosition: number;
}

interface SequenceBuilderProps {
  onComplete?: () => void;
}

const SequenceBuilder: React.FC<SequenceBuilderProps> = ({ onComplete }) => {
  // Define the different sequences
  const sequences = [
    {
      title: "Morning Routine Algorithm",
      description: "Put these morning activities in the correct order",
      steps: [
        { id: "step-1", text: "Wake up", image: "🛌", correctPosition: 0 },
        { id: "step-2", text: "Brush teeth", image: "🪥", correctPosition: 2 },
        { id: "step-3", text: "Get dressed", image: "👕", correctPosition: 3 },
        { id: "step-4", text: "Eat breakfast", image: "🥣", correctPosition: 1 },
      ]
    },
    {
      title: "Making a Sandwich Algorithm",
      description: "Arrange these steps to make a sandwich correctly",
      steps: [
        { id: "step-1", text: "Get bread slices", image: "🍞", correctPosition: 0 },
        { id: "step-2", text: "Add peanut butter", image: "🥜", correctPosition: 1 },
        { id: "step-3", text: "Add jelly", image: "🍓", correctPosition: 2 },
        { id: "step-4", text: "Put slices together", image: "🥪", correctPosition: 3 },
        { id: "step-5", text: "Cut sandwich", image: "🔪", correctPosition: 4 },
      ]
    },
    {
      title: "Planting a Seed Algorithm",
      description: "Arrange these steps to plant a seed correctly",
      steps: [
        { id: "step-1", text: "Dig a hole", image: "🕳️", correctPosition: 0 },
        { id: "step-2", text: "Place seed in hole", image: "🌱", correctPosition: 1 },
        { id: "step-3", text: "Cover with soil", image: "🌰", correctPosition: 2 },
        { id: "step-4", text: "Water the seed", image: "💧", correctPosition: 3 },
        { id: "step-5", text: "Place in sunlight", image: "☀️", correctPosition: 4 },
      ]
    }
  ];

  // State
  const [currentSequenceIndex, setCurrentSequenceIndex] = useState(0);
  const [steps, setSteps] = useState<SequenceStep[]>([]);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allComplete, setAllComplete] = useState(false);
  const [feedbackMessages, setFeedbackMessages] = useState<string[]>([]);
  const [draggedStep, setDraggedStep] = useState<SequenceStep | null>(null);
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  // Initialize steps in random order
  useEffect(() => {
    const currentSequence = sequences[currentSequenceIndex];
    const shuffledSteps = [...currentSequence.steps].sort(() => Math.random() - 0.5);
    setSteps(shuffledSteps);
    setIsCorrect(false);
    setShowFeedback(false);
    setFeedbackMessages([]);
  }, [currentSequenceIndex]);

  // Handle drag start
  const handleDragStart = useCallback((e: React.DragEvent, step: SequenceStep, index: number) => {
    setDraggedStep(step);
    setDraggedIndex(index);
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '0.4';
    }
    e.dataTransfer.setData('text/plain', step.id);
    
    // Play sound
    try {
      new Audio('/audio/click.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }, []);

  // Handle drag over
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
  }, []);

  // Handle drag end
  const handleDragEnd = useCallback((e: React.DragEvent) => {
    if (e.currentTarget instanceof HTMLElement) {
      e.currentTarget.style.opacity = '1';
    }
    setDraggedStep(null);
    setDraggedIndex(null);
  }, []);

  // Handle drop
  const handleDrop = useCallback((e: React.DragEvent, targetIndex: number) => {
    e.preventDefault();
    
    if (draggedIndex === null) return;
    
    const items = Array.from(steps);
    const [reorderedItem] = items.splice(draggedIndex, 1);
    items.splice(targetIndex, 0, reorderedItem);
    
    setSteps(items);
    setDraggedIndex(null);
    setDraggedStep(null);
    
    // Play sound
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  }, [steps, draggedIndex]);

  // Check if the sequence is correct
  const checkSequence = () => {
    let isSequenceCorrect = true;
    const messages: string[] = [];
    
    steps.forEach((step, index) => {
      if (step.correctPosition !== index) {
        isSequenceCorrect = false;
        messages.push(`Step ${index + 1} is not in the right place!`);
      } else {
        messages.push(`Step ${index + 1} is correct!`);
      }
    });
    
    setIsCorrect(isSequenceCorrect);
    setShowFeedback(true);
    setFeedbackMessages(messages);
    
    if (isSequenceCorrect) {
      setShowConfetti(true);
      
      // Play success sound
      try {
        new Audio('/audio/correct.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
      
      setTimeout(() => {
        setShowConfetti(false);
        
        // If this is the last sequence, mark all as complete
        if (currentSequenceIndex === sequences.length - 1) {
          setAllComplete(true);
          if (onComplete) {
            onComplete();
          }
        }
      }, 3000);
    } else {
      // Play incorrect sound
      try {
        new Audio('/audio/incorrect.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
  };

  // Move to the next sequence
  const nextSequence = () => {
    if (currentSequenceIndex < sequences.length - 1) {
      setCurrentSequenceIndex(currentSequenceIndex + 1);
      
      // Play level up sound
      try {
        new Audio('/audio/cheer.mp3').play();
      } catch (e) {
        console.error('Failed to play sound:', e);
      }
    }
  };

  // Reset the current sequence
  const resetSequence = () => {
    const currentSequence = sequences[currentSequenceIndex];
    const shuffledSteps = [...currentSequence.steps].sort(() => Math.random() - 0.5);
    setSteps(shuffledSteps);
    setIsCorrect(false);
    setShowFeedback(false);
    setFeedbackMessages([]);
    
    // Play reset sound
    try {
      new Audio('/audio/pop.mp3').play();
    } catch (e) {
      console.error('Failed to play sound:', e);
    }
  };

  return (
    <div className="bg-white rounded-lg p-6">
      <div className="mb-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-bold">Sequence Builder</h2>
          <div className="text-sm font-medium bg-blue-100 text-blue-800 px-3 py-1 rounded-full">
            {currentSequenceIndex + 1} of {sequences.length}
          </div>
        </div>
        <p className="text-gray-600 mt-1">
          Drag and drop the steps to create the correct algorithm.
        </p>
      </div>
      
      <div className="mb-6">
        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
          <h3 className="font-bold text-lg mb-2">{sequences[currentSequenceIndex].title}</h3>
          <p>{sequences[currentSequenceIndex].description}</p>
        </div>
      </div>
      
      <div className="space-y-2 mb-6">
        {steps.map((step, index) => (
          <div
            key={step.id}
            draggable
            onDragStart={(e) => handleDragStart(e, step, index)}
            onDragEnd={handleDragEnd}
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, index)}
            className={`
              bg-white border-2 p-3 rounded-lg flex items-center cursor-grab active:cursor-grabbing
              ${showFeedback && step.correctPosition === index 
                ? 'border-green-500 bg-green-50' 
                : showFeedback 
                ? 'border-red-500 bg-red-50' 
                : 'border-gray-200 hover:border-blue-300'}
            `}
          >
            <div className="flex items-center justify-center w-10 h-10 bg-blue-100 rounded-full mr-3 text-xl">
              {step.image}
            </div>
            <div className="flex-1">
              <div className="font-medium">{step.text}</div>
              {showFeedback && (
                <div className={`text-sm mt-1 ${step.correctPosition === index ? 'text-green-600' : 'text-red-600'}`}>
                  {step.correctPosition === index 
                    ? 'Correct position!' 
                    : `Should be step ${step.correctPosition + 1}`}
                </div>
              )}
            </div>
            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center font-bold text-gray-600">
              {index + 1}
            </div>
          </div>
        ))}
      </div>
      
      <div className="flex gap-3">
        <button
          onClick={checkSequence}
          disabled={showFeedback && isCorrect}
          className={`
            flex-1 px-4 py-2 rounded-md font-medium
            ${showFeedback && isCorrect
              ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
              : 'bg-blue-600 text-white hover:bg-blue-700'}
          `}
        >
          Check Sequence
        </button>
        
        {showFeedback && isCorrect && currentSequenceIndex < sequences.length - 1 && (
          <button
            onClick={nextSequence}
            className="flex-1 px-4 py-2 bg-green-600 text-white rounded-md font-medium hover:bg-green-700"
          >
            Next Sequence
          </button>
        )}
        
        {!isCorrect && (
          <button
            onClick={resetSequence}
            className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md font-medium hover:bg-gray-300"
          >
            Reset
          </button>
        )}
      </div>
      
      {/* Feedback */}
      {showFeedback && (
        <div className={`mt-4 p-4 rounded-md ${isCorrect ? 'bg-green-100' : 'bg-red-100'}`}>
          <div className={`font-bold mb-2 ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
            {isCorrect 
              ? "Great job! Your algorithm is correct!" 
              : "Not quite right. Try again!"}
          </div>
          {allComplete && isCorrect && (
            <div className="text-green-700 font-medium">
              Amazing! You've completed all the sequence challenges!
            </div>
          )}
        </div>
      )}
      
      {/* Audio feedback message */}
      {showFeedback && isCorrect && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-4 p-3 bg-blue-50 rounded-md"
        >
          <div className="font-medium mb-1">Step by Step:</div>
          <div className="grid grid-cols-1 gap-2">
            {steps.map((step, index) => (
              <div key={index} className="flex items-center">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mr-2 text-blue-800 font-bold text-sm">
                  {index + 1}
                </div>
                <div className="text-sm">{step.text}</div>
              </div>
            ))}
          </div>
        </motion.div>
      )}
      
      {/* Confetti effect */}
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default SequenceBuilder; 