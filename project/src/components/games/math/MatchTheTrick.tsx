import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import ConfettiEffect from '../../common/ConfettiEffect';
import SoundPlayer from '../../common/SoundPlayer';

interface Problem {
  id: number;
  equation: string;
  number: number;
  leftFingers: number;
  rightFingers: number;
  answer: number;
}

interface Match {
  problemId: number | null;
  resultId: number | null;
}

const MatchTheTrick: React.FC = () => {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [shuffledResults, setShuffledResults] = useState<Problem[]>([]);
  const [selectedProblem, setSelectedProblem] = useState<number | null>(null);
  const [selectedResult, setSelectedResult] = useState<number | null>(null);
  const [matches, setMatches] = useState<Match[]>([]);
  const [showConfetti, setShowConfetti] = useState(false);
  const [allMatched, setAllMatched] = useState(false);

  // Initialize problems
  useEffect(() => {
    const initialProblems: Problem[] = [
      { id: 1, equation: '9 × 1', number: 1, leftFingers: 0, rightFingers: 9, answer: 9 },
      { id: 2, equation: '9 × 2', number: 2, leftFingers: 1, rightFingers: 8, answer: 18 },
      { id: 3, equation: '9 × 3', number: 3, leftFingers: 2, rightFingers: 7, answer: 27 },
      { id: 4, equation: '9 × 4', number: 4, leftFingers: 3, rightFingers: 6, answer: 36 },
      { id: 5, equation: '9 × 5', number: 5, leftFingers: 4, rightFingers: 5, answer: 45 },
    ];
    
    setProblems(initialProblems);
    
    // Shuffle results
    const shuffled = [...initialProblems].sort(() => Math.random() - 0.5);
    setShuffledResults(shuffled);
  }, []);

  // Check if all problems are matched
  useEffect(() => {
    if (problems.length > 0 && matches.length === problems.length) {
      setAllMatched(true);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 3000);
    }
  }, [matches, problems]);

  const handleProblemClick = (id: number) => {
    // Check if this problem is already matched
    if (matches.some(match => match.problemId === id)) return;
    
    setSelectedProblem(id);
    
    // If a result is already selected, check for a match
    if (selectedResult !== null) {
      checkForMatch(id, selectedResult);
    }
  };

  const handleResultClick = (id: number) => {
    // Check if this result is already matched
    if (matches.some(match => match.resultId === id)) return;
    
    setSelectedResult(id);
    
    // If a problem is already selected, check for a match
    if (selectedProblem !== null) {
      checkForMatch(selectedProblem, id);
    }
  };

  const checkForMatch = (problemId: number, resultId: number) => {
    const problem = problems.find(p => p.id === problemId);
    const result = shuffledResults.find(r => r.id === resultId);
    
    if (problem && result && problem.id === result.id) {
      // It's a match!
      setMatches([...matches, { problemId, resultId }]);
      
      // Play success sound
      new Audio('/audio/correct.mp3').play().catch(e => console.log('Audio play error:', e));
    } else {
      // Not a match, play error sound
      new Audio('/audio/incorrect.mp3').play().catch(e => console.log('Audio play error:', e));
    }
    
    // Reset selections
    setSelectedProblem(null);
    setSelectedResult(null);
  };

  const isMatched = (id: number, type: 'problem' | 'result') => {
    if (type === 'problem') {
      return matches.some(match => match.problemId === id);
    } else {
      return matches.some(match => match.resultId === id);
    }
  };

  const renderFingers = (problem: Problem) => {
    return (
      <div className="flex gap-2">
        {/* Left hand */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const fingerNumber = i + 1;
            const isFolded = fingerNumber === problem.number;
            
            return (
              <div 
                key={`left-${fingerNumber}`}
                className={`w-4 h-10 rounded-t-full ${
                  isFolded ? 'h-5 opacity-40' : ''
                } bg-pink-200`}
              />
            );
          })}
        </div>
        
        {/* Right hand */}
        <div className="flex gap-1">
          {Array.from({ length: 5 }, (_, i) => {
            const fingerNumber = i + 6;
            
            return (
              <div 
                key={`right-${fingerNumber}`}
                className="w-4 h-10 rounded-t-full bg-blue-200"
              />
            );
          })}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg p-6 shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6">Match the Trick</h2>
      
      <div className="mb-6 text-center">
        <div className="text-lg font-medium mb-2">
          Match each multiplication problem to the correct finger position
        </div>
        <div className="text-sm text-gray-600 mb-4">
          Click on a problem, then click on the matching finger position
        </div>
        
        {allMatched && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-green-100 text-green-800 rounded-lg mb-4"
          >
            <div className="flex items-center justify-center gap-2">
              <span className="text-2xl">🏆</span>
              <span className="font-bold">Great job! You've matched all problems correctly!</span>
            </div>
          </motion.div>
        )}
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Problems column */}
        <div>
          <div className="text-lg font-medium mb-4 text-center">Multiplication Problems</div>
          <div className="flex flex-col gap-4">
            {problems.map(problem => {
              const isSelected = selectedProblem === problem.id;
              const isMatchedItem = isMatched(problem.id, 'problem');
              
              return (
                <motion.div
                  key={problem.id}
                  className={`p-4 rounded-lg cursor-pointer border-2 ${
                    isMatchedItem 
                      ? 'bg-green-100 border-green-500' 
                      : isSelected 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-gray-100 border-transparent hover:bg-gray-200'
                  }`}
                  whileHover={!isMatchedItem ? { scale: 1.02 } : {}}
                  whileTap={!isMatchedItem ? { scale: 0.98 } : {}}
                  onClick={() => !isMatchedItem && handleProblemClick(problem.id)}
                >
                  <div className="text-xl font-bold text-center">{problem.equation}</div>
                </motion.div>
              );
            })}
          </div>
        </div>
        
        {/* Results column */}
        <div>
          <div className="text-lg font-medium mb-4 text-center">Finger Positions</div>
          <div className="flex flex-col gap-4">
            {shuffledResults.map(result => {
              const isSelected = selectedResult === result.id;
              const isMatchedItem = isMatched(result.id, 'result');
              
              return (
                <motion.div
                  key={result.id}
                  className={`p-4 rounded-lg cursor-pointer border-2 ${
                    isMatchedItem 
                      ? 'bg-green-100 border-green-500' 
                      : isSelected 
                        ? 'bg-blue-100 border-blue-500' 
                        : 'bg-gray-100 border-transparent hover:bg-gray-200'
                  }`}
                  whileHover={!isMatchedItem ? { scale: 1.02 } : {}}
                  whileTap={!isMatchedItem ? { scale: 0.98 } : {}}
                  onClick={() => !isMatchedItem && handleResultClick(result.id)}
                >
                  <div className="flex flex-col items-center gap-2">
                    {renderFingers(result)}
                    <div className="text-center mt-2">
                      <div className="font-medium">{result.leftFingers} tens + {result.rightFingers} ones</div>
                      <div className="text-xl font-bold">{result.answer}</div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
      
      {showConfetti && <ConfettiEffect />}
    </div>
  );
};

export default MatchTheTrick; 