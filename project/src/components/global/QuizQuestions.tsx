import React, { useState } from 'react';

export interface QuizOption {
  text: string;
  explanation: string;
}

export interface QuizQuestion {
  question: string;
  options: QuizOption[];
  correct: number;
  image?: string | null;
}

interface QuizQuestionsProps {
  questions: QuizQuestion[];
  onComplete?: () => void;
}

const QuizQuestions: React.FC<QuizQuestionsProps> = ({ questions, onComplete }) => {
  const [index, setIndex] = useState(0);
  const [answered, setAnswered] = useState(false);
  const [selected, setSelected] = useState<number | null>(null);
  const [correct, setCorrect] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  const q = questions[index];

  const handleAnswer = (idx: number) => {
    if (answered || showExplanation) return;
    setSelected(idx);
    setAnswered(true);
    setCorrect(idx === q.correct);
    console.log('Answered:', idx, 'Correct:', idx === q.correct, 'Current index:', index);
    if (idx === q.correct) {
      setTimeout(() => {
        setAnswered(false);
        setSelected(null);
        setCorrect(false);
        if (index === questions.length - 1) {
          console.log('Quiz complete, calling onComplete');
          onComplete && onComplete();
        } else {
          setIndex(index + 1);
          console.log('Advancing to next question, new index:', index + 1);
        }
      }, 900);
    } else {
      setShowExplanation(true);
    }
  };

  const handleCloseExplanation = () => {
    setShowExplanation(false);
    setAnswered(false);
    setSelected(null);
    setCorrect(false);
  };

  return (
    <div className="mb-6">
      <div className="text-xl font-bold text-indigo-700 text-center mb-4">{q.question}</div>
      {q.image && <img src={q.image} alt="" className="mx-auto mb-4 max-h-40" />}
      <div className="grid gap-4">
        {q.options.map((opt, idx) => (
          <div key={idx} className="flex flex-col">
            <button
              onClick={() => handleAnswer(idx)}
              disabled={answered || showExplanation}
              className={`w-full py-3 rounded-xl text-lg font-semibold border-2 transition-all duration-200
                ${answered && selected === idx && idx === q.correct ? 'bg-green-200 border-green-500 text-green-800' : ''}
                ${answered && selected === idx && idx !== q.correct ? 'bg-red-200 border-red-500 text-red-800' : 'bg-white border-gray-200 hover:bg-indigo-50'}
                {(answered && selected !== idx) || showExplanation ? 'opacity-60 pointer-events-none' : ''}`}
            >
              {opt.text}
            </button>
            {showExplanation && selected === idx && idx !== q.correct && (
              <div className={`mt-1 text-sm flex items-center text-red-700`}>
                {opt.explanation}
                <button
                  onClick={handleCloseExplanation}
                  className="ml-2 px-2 py-0.5 rounded bg-gray-200 text-gray-700 text-xs font-bold hover:bg-gray-300"
                  aria-label="Close explanation"
                >
                  ×
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      {answered && (
        <div className={`mt-4 text-lg font-bold ${correct ? 'text-green-600' : 'text-red-600'}`}>{correct ? 'Correct! 🎉' : 'Try again!'}</div>
      )}
    </div>
  );
};

export default QuizQuestions; 