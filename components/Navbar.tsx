import React, { useState, useEffect, useRef } from 'react';
import { NavItem } from '../types';
import { Rocket, Star, Globe, MessageCircle, Volume2, VolumeX, BrainCircuit, X } from 'lucide-react';
import { soundManager } from '../utils/sound';

interface NavbarProps {
  items: NavItem[];
  quizMode: boolean;
  onQuizToggle: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ items, quizMode, onQuizToggle }) => {
  const [scrolled, setScrolled] = useState(false);
  const [activeId, setActiveId] = useState<string>(items[0].id);
  const [muted, setMuted] = useState(soundManager.isMuted());
  const prevActiveIdRef = useRef<string>(items[0].id);

  useEffect(() => {
    if (quizMode) {
      setScrolled(true);
      return;
    }

    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
      
      // Determine active section
      const sections = items.map(item => document.getElementById(item.id));
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
      let currentSectionId = items[0].id;
      for (const section of sections) {
        if (section && section.offsetTop <= scrollPosition && (section.offsetTop + section.offsetHeight) > scrollPosition) {
          currentSectionId = section.id;
        }
      }

      if (currentSectionId !== activeId) {
        setActiveId(currentSectionId);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [items, activeId, quizMode]);

  // Effect to play sound when active section changes
  useEffect(() => {
    if (!quizMode && activeId !== prevActiveIdRef.current) {
      soundManager.playTransition();
      prevActiveIdRef.current = activeId;
    }
  }, [activeId, quizMode]);

  const scrollToSection = (id: string) => {
    soundManager.playClick();
    if (quizMode) {
      onQuizToggle(); // Exit quiz first
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) element.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  const toggleMute = () => {
    const isNowMuted = soundManager.toggleMute();
    setMuted(isNowMuted);
    if (!isNowMuted) {
        soundManager.playClick();
    }
  };

  const getIcon = (id: string) => {
    switch (id) {
      case 'home': return <Rocket className="w-5 h-5" />;
      case 'planets': return <Globe className="w-5 h-5" />;
      case 'stars': return <Star className="w-5 h-5" />;
      case 'fun-facts': return <MessageCircle className="w-5 h-5" />;
      default: return <Star className="w-5 h-5" />;
    }
  };

  const handleQuizClick = () => {
    soundManager.playClick();
    onQuizToggle();
  };

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-[60] transition-all duration-300 px-6 py-4 ${
        scrolled
          ? 'bg-slate-900/90 backdrop-blur-md shadow-lg border-b border-indigo-500/30'
          : 'bg-transparent py-6'
      }`}
    >
      <div className="max-w-6xl mx-auto flex justify-between items-center">
        <div 
          className="flex items-center gap-2 font-bold text-2xl text-white cursor-pointer" 
          onClick={() => quizMode ? onQuizToggle() : scrollToSection('home')}
        >
          <div className="bg-gradient-to-tr from-indigo-500 to-purple-500 p-2 rounded-lg">
            <Rocket className="w-6 h-6 text-white" />
          </div>
          <span className="hidden sm:block tracking-wide">CosmoKids</span>
        </div>

        <div className="flex items-center gap-4">
            {!quizMode && (
              <ul className="hidden md:flex gap-2 bg-white/5 p-1.5 rounded-full border border-white/10 backdrop-blur-sm">
              {items.map((item) => (
                  <li key={item.id}>
                  <button
                      onClick={() => scrollToSection(item.id)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-full transition-all duration-300 text-sm font-semibold ${
                      activeId === item.id
                          ? 'bg-indigo-600 text-white shadow-[0_0_15px_rgba(99,102,241,0.5)] scale-105'
                          : 'text-slate-300 hover:text-white hover:bg-white/10'
                      }`}
                  >
                      <span>{getIcon(item.id)}</span>
                      {item.label}
                  </button>
                  </li>
              ))}
              </ul>
            )}

            {/* Quiz Toggle Button */}
            <button
              onClick={handleQuizClick}
              className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-all duration-300 border ${
                quizMode 
                  ? 'bg-slate-800 text-white border-slate-600 hover:bg-slate-700' 
                  : 'bg-gradient-to-r from-pink-500 to-rose-500 text-white border-transparent hover:shadow-[0_0_15px_rgba(236,72,153,0.5)] hover:scale-105'
              }`}
            >
              {quizMode ? <X className="w-5 h-5" /> : <BrainCircuit className="w-5 h-5" />}
              <span className="hidden sm:inline">{quizMode ? 'Exit Quiz' : 'Space Quiz'}</span>
            </button>

            <button 
                onClick={toggleMute}
                className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors text-white border border-white/10"
                aria-label={muted ? "Unmute sounds" : "Mute sounds"}
            >
                {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;