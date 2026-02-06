import React, { forwardRef, useEffect, useState } from 'react';

interface SatelliteProps {
  greetUser?: boolean;
  landed?: boolean;
}

const Satellite = forwardRef<HTMLDivElement, SatelliteProps>(({ greetUser, landed }, ref) => {
  const [isGreeting, setIsGreeting] = useState(false);

  useEffect(() => {
    if (greetUser) {
      setIsGreeting(true);
      const timer = setTimeout(() => setIsGreeting(false), 1500); // 1.5s flash duration
      return () => clearTimeout(timer);
    }
  }, [greetUser]);

  return (
    <div
      ref={ref}
      className="fixed z-50 pointer-events-none transition-transform duration-75 ease-linear will-change-transform"
      style={{ 
        width: '140px', 
        height: '140px',
        // Initial position off-screen or handled by layout effect
        top: 0,
        left: 0,
      }}
    >
      <svg 
        viewBox="0 0 200 200" 
        xmlns="http://www.w3.org/2000/svg" 
        className={`w-full h-full transition-all duration-700 ${landed ? 'landing-active' : 'drop-shadow-[0_0_20px_rgba(59,130,246,0.6)]'}`}
      >
        <defs>
          <linearGradient id="bodyGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#f1f5f9" />
            <stop offset="50%" stopColor="#cbd5e1" />
            <stop offset="100%" stopColor="#94a3b8" />
          </linearGradient>
          <linearGradient id="panelGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#3b82f6" />
            <stop offset="100%" stopColor="#1e3a8a" />
          </linearGradient>
          <linearGradient id="flameGradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#fef08a" stopOpacity="0.9" />
            <stop offset="40%" stopColor="#f59e0b" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#ef4444" stopOpacity="0" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
            <feMerge>
              <feMergeNode in="coloredBlur"/>
              <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Thruster Flame (Animated) - Fades out when landed */}
        <g transform="translate(100, 145)" style={{ opacity: landed ? 0.1 : 1, transition: 'opacity 1s ease' }}>
           <path d="M-12,0 Q0,45 12,0" fill="url(#flameGradient)" className="animate-pulse origin-top">
             <animate attributeName="d" values="M-12,0 Q0,45 12,0; M-10,0 Q0,65 10,0; M-12,0 Q0,45 12,0" dur="0.15s" repeatCount="indefinite" />
           </path>
        </g>

        {/* Left Solar Panel */}
        <g transform="translate(10, 70)">
            <rect x="0" y="0" width="65" height="50" rx="4" fill="url(#panelGradient)" stroke="#172554" strokeWidth="2" />
            <line x1="21" y1="0" x2="21" y2="50" stroke="#172554" strokeWidth="1" opacity="0.4" />
            <line x1="42" y1="0" x2="42" y2="50" stroke="#172554" strokeWidth="1" opacity="0.4" />
            <line x1="0" y1="25" x2="65" y2="25" stroke="#172554" strokeWidth="1" opacity="0.4" />
        </g>
        
        {/* Right Solar Panel */}
        <g transform="translate(125, 70)">
            <rect x="0" y="0" width="65" height="50" rx="4" fill="url(#panelGradient)" stroke="#172554" strokeWidth="2" />
            <line x1="21" y1="0" x2="21" y2="50" stroke="#172554" strokeWidth="1" opacity="0.4" />
            <line x1="42" y1="0" x2="42" y2="50" stroke="#172554" strokeWidth="1" opacity="0.4" />
            <line x1="0" y1="25" x2="65" y2="25" stroke="#172554" strokeWidth="1" opacity="0.4" />
        </g>

        {/* Panel Connectors */}
        <line x1="75" y1="95" x2="10" y2="95" stroke="#475569" strokeWidth="6" />
        <line x1="125" y1="95" x2="190" y2="95" stroke="#475569" strokeWidth="6" />

        {/* Main Body */}
        <g filter="url(#glow)">
          <rect x="70" y="55" width="60" height="90" rx="15" fill="url(#bodyGradient)" stroke="#334155" strokeWidth="3" />
          
          {/* Body Detail Lines */}
          <line x1="70" y1="80" x2="130" y2="80" stroke="#334155" strokeWidth="1" opacity="0.3" />
          <line x1="70" y1="120" x2="130" y2="120" stroke="#334155" strokeWidth="1" opacity="0.3" />
          
          {/* Main Camera Lens/Eye - Interactive */}
          <circle cx="100" cy="75" r="16" fill="#0f172a" stroke="#334155" strokeWidth="2" />
          <circle 
            cx="100" 
            cy="75" 
            r="10" 
            fill={isGreeting ? "#facc15" : (landed ? "#22c55e" : "#0ea5e9")} 
            className={`transition-all duration-300 ${!isGreeting && !landed ? 'animate-pulse' : ''}`}
            style={{ filter: isGreeting ? 'drop-shadow(0 0 8px #facc15)' : (landed ? 'drop-shadow(0 0 5px #22c55e)' : 'none') }}
          />
          <circle cx="104" cy="71" r="3" fill="white" opacity={isGreeting ? 1 : 0.9} />
          
          {/* Status Lights - Turn green when landed */}
          <circle cx="80" cy="135" r="3" fill="#22c55e" />
          <circle cx="90" cy="135" r="3" fill={landed ? "#22c55e" : "#ef4444"} className={landed ? "" : "animate-ping"} style={{ animationDuration: '3s' }}/>
          <circle cx="90" cy="135" r="3" fill={landed ? "#22c55e" : "#ef4444"} />
        </g>

        {/* Antenna System */}
        <line x1="100" y1="55" x2="100" y2="25" stroke="#64748b" strokeWidth="4" />
        <circle cx="100" cy="25" r="5" fill="#94a3b8" stroke="#475569" strokeWidth="1" />
        {/* Antenna Dish/Signal */}
        <path d="M85,25 Q100,10 115,25" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        <path d="M90,32 Q100,22 110,32" fill="none" stroke="#64748b" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
        
      </svg>
    </div>
  );
});

Satellite.displayName = 'Satellite';

export default Satellite;