import React, { useState } from 'react';

// Stormy Sam avatar placeholder (could be replaced with an SVG or image later)
const StormySam = ({ mood }: { mood: 'neutral' | 'happy' | 'sad' | 'cheer' }) => {
  let face = '☁️⚡';
  if (mood === 'happy' || mood === 'cheer') face = '😃☁️⚡';
  if (mood === 'sad') face = '😢☁️⚡';
  return (
    <div className="flex flex-col items-center">
      <span className="text-5xl animate-bounce">{face}</span>
      <span className="text-xs font-bold text-blue-700">Stormy Sam</span>
    </div>
  );
};

// Level and question data
const levels = [
  {
    id: 1,
    name: 'At Home',
    icon: '🏠',
    bg: 'from-blue-50 to-yellow-50',
    questions: [
      {
        id: 1,
        text: 'Family inside house away from windows',
        image: '🏠👨‍👩‍👧‍👦',
        correct: 'safe',
        explanation: 'Staying indoors and away from windows is safe during lightning.',
        environment: 'home',
      },
      {
        id: 2,
        text: 'Watching TV during a storm',
        image: '📺🌩️',
        correct: 'unsafe',
        explanation: 'Electronics can conduct electricity. Unplug and avoid using them during storms.',
        environment: 'home',
      },
      {
        id: 3,
        text: 'Taking a shower during lightning',
        image: '🚿⚡',
        correct: 'unsafe',
        explanation: 'Water pipes can carry lightning. Avoid showers during storms.',
        environment: 'home',
      },
    ],
  },
  {
    id: 2,
    name: 'Outdoors',
    icon: '🌳',
    bg: 'from-green-50 to-blue-100',
    questions: [
      {
        id: 4,
        text: 'Hiding under a tree during storm',
        image: '🌳🌩️',
        correct: 'unsafe',
        explanation: 'Trees attract lightning. Stay indoors instead!',
        environment: 'outdoors',
      },
      {
        id: 5,
        text: 'Playing in an open field during thunder',
        image: '🏃‍♂️🌩️',
        correct: 'unsafe',
        explanation: 'Open fields are dangerous. Find shelter indoors.',
        environment: 'outdoors',
      },
      {
        id: 6,
        text: 'Going inside when you hear thunder',
        image: '🏃‍♂️➡️🏠',
        correct: 'safe',
        explanation: 'Going inside is the safest choice during a storm.',
        environment: 'outdoors',
      },
    ],
  },
  {
    id: 3,
    name: 'Strange Places',
    icon: '🚗',
    bg: 'from-purple-50 to-yellow-100',
    questions: [
      {
        id: 7,
        text: 'Someone inside a car during storm',
        image: '🚗🌩️',
        correct: 'safe',
        explanation: 'Cars are safe because they act as a Faraday cage.',
        environment: 'strange',
      },
      {
        id: 8,
        text: 'Person swimming in pool during thunder',
        image: '🏊‍♂️🌩️',
        correct: 'unsafe',
        explanation: 'Water conducts electricity. Get out of pools during storms.',
        environment: 'strange',
      },
      {
        id: 9,
        text: 'Kid flying kite during lightning',
        image: '🪁🌩️',
        correct: 'unsafe',
        explanation: 'Kites can attract lightning. Never fly kites in storms.',
        environment: 'strange',
      },
    ],
  },
];

const badges = [
  { level: 1, name: 'Lightning Learner', icon: '⭐' },
  { level: 2, name: 'Storm Smart', icon: '🌩️' },
  { level: 3, name: 'Safety Pro', icon: '🧠' },
];

const soundFX = {
  pop: () => { try { new Audio('/audio/pop.mp3').play(); } catch {} },
  ding: () => { try { new Audio('/audio/correct.mp3').play(); } catch {} },
  thunder: () => { try { new Audio('/audio/fail.mp3').play(); } catch {} },
};

const LightningSafetyHeroQuest: React.FC = () => {
  const [currentLevel, setCurrentLevel] = useState(0); // 0-based
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [unlockedLevels, setUnlockedLevels] = useState([true, false, false]);
  const [earnedBadges, setEarnedBadges] = useState([] as number[]);
  const [mode, setMode] = useState<'visual' | 'reading'>('visual');
  const [narratorText, setNarratorText] = useState("Let's test your lightning knowledge!");
  const [narratorMood, setNarratorMood] = useState<'neutral' | 'happy' | 'sad' | 'cheer'>('neutral');
  const [selected, setSelected] = useState<string | null>(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [explanation, setExplanation] = useState<string | null>(null);
  const [levelScore, setLevelScore] = useState(0);
  const [showBadge, setShowBadge] = useState(false);
  const [finished, setFinished] = useState(false);
  const [soundOn, setSoundOn] = useState(true);

  const level = levels[currentLevel];
  const question = level.questions[currentQuestion];

  // Level map UI
  const renderLevelMap = () => (
    <div className="flex justify-center items-center gap-6 mb-4">
      {levels.map((lvl, i) => (
        <div key={lvl.id} className="flex flex-col items-center">
          <div className={`text-3xl ${unlockedLevels[i] ? '' : 'opacity-40'}`}>{lvl.icon}</div>
          <div className="text-xs font-bold text-indigo-700">{lvl.name}</div>
          {!unlockedLevels[i] && <span className="text-lg text-gray-400 -mt-6">🔒</span>}
        </div>
      ))}
    </div>
  );

  // Narrator
  const renderNarrator = () => (
    <div className="flex items-center gap-2 mb-4">
      <StormySam mood={narratorMood} />
      <div className="bg-white border border-blue-200 rounded-xl px-4 py-2 shadow text-blue-800 font-semibold text-base animate-bounce-speech min-w-[180px] text-center">
        {narratorText}
      </div>
    </div>
  );

  // Mode toggle
  const renderModeToggle = () => (
    <div className="flex gap-2 mb-4">
      <button
        className={`px-3 py-1 rounded-full font-bold border-2 ${mode === 'visual' ? 'bg-yellow-200 border-yellow-500 text-yellow-900' : 'bg-white border-gray-300 text-gray-700'}`}
        onClick={() => setMode('visual')}
      >
        Visual Mode
      </button>
      <button
        className={`px-3 py-1 rounded-full font-bold border-2 ${mode === 'reading' ? 'bg-blue-200 border-blue-500 text-blue-900' : 'bg-white border-gray-300 text-gray-700'}`}
        onClick={() => setMode('reading')}
      >
        Reading Mode
      </button>
      <button
        className={`ml-4 px-3 py-1 rounded-full font-bold border-2 ${soundOn ? 'bg-green-200 border-green-500 text-green-900' : 'bg-white border-gray-300 text-gray-700'}`}
        onClick={() => setSoundOn(s => !s)}
      >
        {soundOn ? '🔊 Sound On' : '🔇 Sound Off'}
      </button>
    </div>
  );

  // Handle answer selection
  const handleAnswer = (ans: string) => {
    if (selected) return;
    setSelected(ans);
    const isCorrect = ans === question.correct;
    setShowFeedback(true);
    setFeedback(isCorrect ? '🎉👍 Great job! That\'s the safe choice.' : '⚠️🌩️ Oops! That\'s not safe during lightning!');
    setExplanation(question.explanation);
    setNarratorMood(isCorrect ? 'happy' : 'sad');
    setNarratorText(isCorrect ? 'Nice work!' : 'Let\'s try to be safer!');
    if (soundOn) {
      if (isCorrect) soundFX.ding(); else soundFX.thunder();
    }
    if (isCorrect) setLevelScore(s => s + 1);
  };

  // Next question or level
  const handleNext = () => {
    if (currentQuestion < level.questions.length - 1) {
      setCurrentQuestion(q => q + 1);
      setSelected(null);
      setShowFeedback(false);
      setFeedback(null);
      setExplanation(null);
      setNarratorMood('neutral');
      setNarratorText('Keep going!');
    } else {
      // Level complete
      setShowBadge(true);
      setNarratorMood('cheer');
      setNarratorText('Level complete! You earned a badge!');
      setEarnedBadges(b => [...b, level.id]);
      // Unlock next level if any
      if (currentLevel < levels.length - 1) {
        setTimeout(() => {
          setUnlockedLevels(arr => arr.map((v, i) => i <= currentLevel + 1 ? true : v));
        }, 1200);
      }
    }
  };

  // Start next level
  const handleNextLevel = () => {
    setCurrentLevel(l => l + 1);
    setCurrentQuestion(0);
    setLevelScore(0);
    setSelected(null);
    setShowFeedback(false);
    setFeedback(null);
    setExplanation(null);
    setShowBadge(false);
    setNarratorMood('neutral');
    setNarratorText('New level! Let\'s test your lightning knowledge!');
  };

  // Replay level
  const handleReplayLevel = () => {
    setCurrentQuestion(0);
    setLevelScore(0);
    setSelected(null);
    setShowFeedback(false);
    setFeedback(null);
    setExplanation(null);
    setShowBadge(false);
    setNarratorMood('neutral');
    setNarratorText('Try again! You can do it!');
  };

  // Final screen
  const handleFinish = () => {
    setFinished(true);
    setNarratorMood('cheer');
    setNarratorText('You\'re a Lightning Safety Hero!');
  };

  // Replay all
  const handleReplayAll = () => {
    setCurrentLevel(0);
    setCurrentQuestion(0);
    setUnlockedLevels([true, false, false]);
    setEarnedBadges([]);
    setLevelScore(0);
    setSelected(null);
    setShowFeedback(false);
    setFeedback(null);
    setExplanation(null);
    setShowBadge(false);
    setNarratorMood('neutral');
    setNarratorText('Let\'s test your lightning knowledge!');
    setFinished(false);
  };

  // Main game UI
  return (
    <div className={`w-full max-w-lg mx-auto bg-gradient-to-b ${level.bg} rounded-xl shadow-lg p-6 flex flex-col items-center`}>
      <div className="text-xl font-extrabold text-indigo-700 mb-2">Lightning Safety Hero Quest</div>
      {renderLevelMap()}
      {renderNarrator()}
      {renderModeToggle()}
      {/* Game flow */}
      {!finished ? (
        showBadge ? (
          <div className="flex flex-col items-center mt-8">
            <div className="text-4xl mb-2 animate-bounce">{badges[currentLevel].icon}</div>
            <div className="text-lg font-bold mb-2">You earned the <span className="text-indigo-700">{badges[currentLevel].name}</span> badge!</div>
            <button
              className="mt-2 px-6 py-2 bg-indigo-500 text-white rounded-full font-bold text-lg shadow"
              onClick={currentLevel === levels.length - 1 ? handleFinish : handleNextLevel}
            >
              {currentLevel === levels.length - 1 ? 'Finish Quest' : 'Next Level ▶'}
            </button>
            <button
              className="mt-2 px-4 py-1 bg-yellow-200 text-yellow-900 rounded font-bold border border-yellow-400"
              onClick={handleReplayLevel}
            >
              Replay Level
            </button>
          </div>
        ) : (
          <>
            {/* Progress dots */}
            <div className="flex gap-1 mb-4">
              {level.questions.map((_, i) => (
                <span key={i} className={`w-3 h-3 rounded-full ${i === currentQuestion ? 'bg-yellow-400' : 'bg-gray-300'}`}></span>
              ))}
            </div>
            {/* Question UI */}
            {unlockedLevels[currentLevel] && !showBadge && !finished && (
              <div className="w-full flex flex-col items-center justify-center min-h-[180px] bg-white bg-opacity-80 rounded-xl shadow-inner p-4 mb-2">
                <div className="text-base font-semibold mb-2 text-center">
                  {mode === 'visual' ? question.image : question.text}
                </div>
                <div className="flex gap-6 mb-2">
                  <button
                    className={`px-6 py-2 rounded-full font-bold text-lg border-2 transition-all duration-200 ${selected === 'safe' ? 'bg-green-200 border-green-500 text-green-800' : 'bg-white border-gray-200 hover:bg-green-50'}`}
                    onClick={() => { handleAnswer('safe'); if (soundOn) soundFX.pop(); }}
                    disabled={!!selected}
                  >
                    Safe
                  </button>
                  <button
                    className={`px-6 py-2 rounded-full font-bold text-lg border-2 transition-all duration-200 ${selected === 'unsafe' ? 'bg-red-200 border-red-500 text-red-800' : 'bg-white border-gray-200 hover:bg-red-50'}`}
                    onClick={() => { handleAnswer('unsafe'); if (soundOn) soundFX.pop(); }}
                    disabled={!!selected}
                  >
                    Unsafe
                  </button>
                </div>
                {/* Feedback */}
                <div className={`min-h-[32px] text-xl font-bold mb-1 transition-opacity duration-500 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}>{feedback}</div>
                <div className={`min-h-[24px] text-base text-gray-700 mb-1 transition-opacity duration-500 ${showFeedback ? 'opacity-100' : 'opacity-0'}`}>{explanation}</div>
                {/* Next button */}
                {selected && (
                  <button className="mt-2 px-4 py-2 bg-indigo-500 text-white rounded font-bold" onClick={handleNext}>
                    {currentQuestion === level.questions.length - 1 ? 'Finish Level' : 'Next ▶'}
                  </button>
                )}
              </div>
            )}
            {/* Badges earned so far */}
            <div className="mt-4 flex gap-4">
              {badges.map(b => (
                <div key={b.level} className={`flex flex-col items-center ${earnedBadges.includes(b.level) ? '' : 'opacity-30'}`}>
                  <span className="text-2xl">{b.icon}</span>
                  <span className="text-xs font-bold">{b.name}</span>
                </div>
              ))}
            </div>
          </>
        )
      ) : (
        <div className="flex flex-col items-center mt-8">
          <div className="text-3xl mb-4">🏆 You're a Lightning Safety Hero!</div>
          <div className="flex gap-4 mb-4">
            {badges.map(b => (
              <div key={b.level} className="flex flex-col items-center">
                <span className="text-3xl">{b.icon}</span>
                <span className="text-xs font-bold">{b.name}</span>
              </div>
            ))}
          </div>
          <button className="mt-4 px-6 py-2 bg-yellow-400 text-white rounded-full font-bold text-lg shadow" onClick={handleReplayAll}>
            Play Again
          </button>
          {/* Certificate download button placeholder */}
          <button className="mt-2 px-6 py-2 bg-indigo-500 text-white rounded-full font-bold text-lg shadow opacity-70 cursor-not-allowed" disabled>
            Download Certificate (coming soon)
          </button>
        </div>
      )}
    </div>
  );
};

export default LightningSafetyHeroQuest; 