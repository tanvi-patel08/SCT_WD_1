import React, { useState } from 'react';
import { CheckCircle2, XCircle, Trophy, RefreshCw, Home, BrainCircuit, ArrowRight } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface QuizProps {
  onExit: () => void;
}

const questions = [
  {
    question: "Which planet is the closest to the Sun?",
    options: ["Venus", "Mercury", "Mars", "Earth"],
    correct: 1,
    explanation: "Mercury is the smallest planet and the closest one to the Sun!"
  },
  {
    question: "Can you hear sound in space?",
    options: ["Yes, but it's quiet", "Only loud explosions", "No, space is silent", "Yes, like underwater"],
    correct: 2,
    explanation: "Space is a vacuum with no air, so sound waves have nothing to travel through!"
  },
  {
    question: "Which planet spins backwards compared to Earth?",
    options: ["Jupiter", "Saturn", "Venus", "Neptune"],
    correct: 2,
    explanation: "Venus is the only planet that spins in the opposite direction to most other planets."
  },
  {
    question: "What is the 'Great Red Spot' on Jupiter?",
    options: ["A giant volcano", "A storm bigger than Earth", "A large crater", "A lake of red water"],
    correct: 1,
    explanation: "It's a giant storm that has been raging for hundreds of years and is bigger than our entire planet!"
  },
  {
    question: "How long is a year on Mercury?",
    options: ["365 days", "88 days", "24 hours", "10 years"],
    correct: 1,
    explanation: "Mercury goes around the Sun very fast, so its year is only 88 Earth days long."
  },
  {
    question: "Which planet is known as the 'Red Planet'?",
    options: ["Mars", "Jupiter", "Venus", "Saturn"],
    correct: 0,
    explanation: "Mars looks red because its soil is full of iron rust!"
  },
  {
    question: "What does the constellation 'Ursa Major' look like?",
    options: ["A Hunter", "A Crab", "A Great Bear (Big Dipper)", "A Lion"],
    correct: 2,
    explanation: "Ursa Major means 'Great Bear', and it contains the famous Big Dipper shape."
  },
  {
    question: "How fast does the International Space Station (ISS) travel?",
    options: ["500 mph", "1,000 mph", "17,500 mph", "1 million mph"],
    correct: 2,
    explanation: "It travels at 17,500 miles per hour, circling Earth every 90 minutes!"
  }
];

const Quiz: React.FC<QuizProps> = ({ onExit }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [score, setScore] = useState(0);
  const [completed, setCompleted] = useState(false);

  const handleOptionClick = (index: number) => {
    if (showExplanation) return;
    
    setSelectedOption(index);
    setShowExplanation(true);
    
    if (index === questions[currentIndex].correct) {
      setScore(s => s + 1);
      soundManager.playSuccess();
    } else {
      soundManager.playClick(); // Or a generic 'wrong' sound if available
    }
  };

  const handleNext = () => {
    soundManager.playClick();
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setSelectedOption(null);
      setShowExplanation(false);
    } else {
      setCompleted(true);
      soundManager.playSuccess();
    }
  };

  const handleRestart = () => {
    soundManager.playClick();
    setCurrentIndex(0);
    setSelectedOption(null);
    setShowExplanation(false);
    setScore(0);
    setCompleted(false);
  };

  if (completed) {
    return (
      <div className="min-h-screen pt-24 pb-12 px-4 flex items-center justify-center animate-fade-in">
        <div className="bg-slate-900/80 backdrop-blur-md border border-indigo-500/30 p-8 md:p-12 rounded-3xl max-w-2xl w-full text-center shadow-[0_0_50px_rgba(79,70,229,0.2)]">
          <div className="flex justify-center mb-6">
            <div className="bg-yellow-500/20 p-6 rounded-full animate-bounce">
              <Trophy className="w-16 h-16 text-yellow-400" />
            </div>
          </div>
          <h2 className="text-4xl font-black text-white mb-4">Mission Accomplished!</h2>
          <p className="text-slate-300 text-xl mb-8">
            You scored <span className="text-indigo-400 font-bold text-2xl">{score}</span> out of <span className="text-white font-bold text-2xl">{questions.length}</span>!
          </p>
          
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <button 
              onClick={handleRestart}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-full font-bold transition-all hover:scale-105"
            >
              <RefreshCw className="w-5 h-5" />
              Try Again
            </button>
            <button 
              onClick={onExit}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-700 hover:bg-slate-600 text-white rounded-full font-bold transition-all hover:scale-105"
            >
              <Home className="w-5 h-5" />
              Return to Base
            </button>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];

  return (
    <div className="min-h-screen pt-24 pb-12 px-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-3xl">
        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-slate-400 text-sm mb-2 font-mono">
            <span>Question {currentIndex + 1} / {questions.length}</span>
            <span>Score: {score}</span>
          </div>
          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 transition-all duration-500 ease-out"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>
        </div>

        {/* Question Card */}
        <div className="bg-slate-900/80 backdrop-blur-md border border-slate-700 rounded-3xl p-6 md:p-10 shadow-xl">
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-8 leading-tight">
            {currentQ.question}
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {currentQ.options.map((option, idx) => {
              let btnClass = "bg-slate-800/50 hover:bg-slate-700 border-slate-600";
              let icon = null;

              if (showExplanation) {
                if (idx === currentQ.correct) {
                  btnClass = "bg-green-500/20 border-green-500 text-green-100";
                  icon = <CheckCircle2 className="w-5 h-5 text-green-400" />;
                } else if (idx === selectedOption) {
                  btnClass = "bg-red-500/20 border-red-500 text-red-100";
                  icon = <XCircle className="w-5 h-5 text-red-400" />;
                } else {
                  btnClass = "bg-slate-800/50 opacity-50 border-transparent";
                }
              } else if (selectedOption === idx) {
                btnClass = "bg-indigo-600 border-indigo-500 text-white";
              }

              return (
                <button
                  key={idx}
                  onClick={() => handleOptionClick(idx)}
                  disabled={showExplanation}
                  className={`relative p-4 rounded-xl border-2 text-left font-semibold transition-all duration-200 flex items-center justify-between ${btnClass}`}
                >
                  <span>{option}</span>
                  {icon}
                </button>
              );
            })}
          </div>

          {/* Explanation Footer */}
          {showExplanation && (
            <div className="mt-8 animate-fade-in">
              <div className={`p-4 rounded-xl mb-6 ${selectedOption === currentQ.correct ? 'bg-green-500/10 border border-green-500/20' : 'bg-indigo-500/10 border border-indigo-500/20'}`}>
                <h4 className="font-bold mb-1 flex items-center gap-2">
                  <BrainCircuit className="w-5 h-5" />
                  Did you know?
                </h4>
                <p className="text-slate-300">{currentQ.explanation}</p>
              </div>
              
              <div className="flex justify-end">
                <button
                  onClick={handleNext}
                  className="flex items-center gap-2 px-8 py-3 bg-white text-indigo-900 font-bold rounded-full hover:scale-105 transition-transform shadow-lg"
                >
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Inline styles for simple animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fade-in {
          animation: fadeIn 0.4s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Quiz;