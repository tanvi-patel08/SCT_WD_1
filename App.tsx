import React, { useEffect, useRef, useState } from 'react';
import Navbar from './components/Navbar';
import Section from './components/Section';
import StarField from './components/StarField';
import Satellite from './components/Satellite';
import Quiz from './components/Quiz';
import ChatBot from './components/ChatBot';
import { NavItem, PlanetData, ConstellationData } from './types';
import { ArrowRight, Star, Info, ChevronDown, Rocket, X, Thermometer, Ruler, MoveRight, Compass, Calendar, VolumeX, Footprints, Gem, Trash2, Scale, Sun, BrainCircuit } from 'lucide-react';
import { soundManager } from './utils/sound';

const navItems: NavItem[] = [
  { label: 'Start', id: 'home' },
  { label: 'Planets', id: 'planets' },
  { label: 'Stars', id: 'stars' },
  { label: 'Fun Facts', id: 'fun-facts' },
];

const planets: PlanetData[] = [
  { 
    name: 'Mercury', 
    color: 'bg-stone-400', 
    size: 'w-24 h-24', 
    description: 'The smallest planet and closest to the Sun.', 
    details: 'Mercury is a small, rocky planet that looks a lot like our Moon. Because it has no air to hold heat, it is super hot during the day and freezing cold at night!',
    facts: ['A year on Mercury is only 88 days long!', 'It has wrinkles called "lobate scarps".', 'It is the fastest planet.'],
    distance: '58 million km',
    temp: '430°C / -180°C'
  },
  { 
    name: 'Venus', 
    color: 'bg-orange-300', 
    size: 'w-28 h-28', 
    description: 'The hottest planet, covered in thick yellow clouds.', 
    details: 'Venus is the brightest object in the sky after the Sun and Moon. It has a super thick atmosphere that traps heat like a blanket, making it hotter than an oven!',
    facts: ['Venus spins backwards compared to Earth.', 'Its day is longer than its year!', 'It has thousands of volcanoes.'],
    distance: '108 million km',
    temp: '465°C'
  },
  { 
    name: 'Earth', 
    color: 'bg-blue-500', 
    size: 'w-32 h-32', 
    description: 'Our home! The only place we know with life.', 
    details: 'Earth is a water world, covered 70% by oceans. It has the perfect temperature for life, plenty of oxygen, and a magnetic shield that protects us from the Sun.',
    facts: ['Earth is not a perfect circle, it bulges at the middle.', 'We have one moon.', 'It is the only planet with liquid water on the surface.'],
    distance: '150 million km',
    temp: '15°C'
  },
  { 
    name: 'Mars', 
    color: 'bg-red-500', 
    size: 'w-28 h-28', 
    description: 'The Red Planet, full of rusty dust and giant volcanoes!', 
    details: 'Mars is red because its soil is full of iron rust. It has the biggest volcano in the solar system, Olympus Mons, which is three times taller than Mt. Everest!',
    facts: ['Mars has two tiny moons: Phobos and Deimos.', 'There might be frozen water underground.', 'Robots are exploring it right now!'],
    distance: '228 million km',
    temp: '-60°C'
  },
  { 
    name: 'Jupiter', 
    color: 'bg-orange-400', 
    size: 'w-48 h-48', 
    description: 'The giant gas king with a big red storm eye.', 
    details: 'Jupiter is the biggest planet of all. It is made of gas and has a storm called the Great Red Spot that has been raging for hundreds of years and is bigger than Earth!',
    facts: ['Jupiter has 95 moons!', 'Its day is only 10 hours long.', 'It protects Earth by pulling in asteroids.'],
    distance: '778 million km',
    temp: '-145°C'
  },
  { 
    name: 'Saturn', 
    color: 'bg-yellow-300', 
    size: 'w-44 h-36', 
    description: 'Famous for its beautiful icy rings that sparkle.', 
    details: 'Saturn is a gas giant like Jupiter, but it is famous for its spectacular rings made of billions of chunks of ice and rock. It is so light it could float in a bathtub!',
    facts: ['Its rings are huge but very thin.', 'It has a moon called Titan with its own atmosphere.', 'Saturn is the farthest planet you can see without a telescope.'],
    distance: '1.4 billion km',
    temp: '-178°C'
  },
  { 
    name: 'Uranus', 
    color: 'bg-cyan-300', 
    size: 'w-36 h-36', 
    description: 'An icy giant that spins on its side.', 
    details: 'Uranus is an "Ice Giant". It is very cold and windy. The weirdest thing about it is that it spins on its side, rolling around the Sun like a ball!',
    facts: ['It is the coldest planet in the solar system.', 'It has 27 moons named after Shakespeare characters.', 'It was the first planet found with a telescope.'],
    distance: '2.9 billion km',
    temp: '-224°C'
  },
  { 
    name: 'Neptune', 
    color: 'bg-blue-600', 
    size: 'w-36 h-36', 
    description: 'The windy, dark blue world furthest from the Sun.', 
    details: 'Neptune is dark, cold, and whipped by supersonic winds. It is the last planet in our solar system and takes 165 Earth years to go around the Sun once!',
    facts: ['Its winds blow up to 1,200 miles per hour.', 'It has a dark storm called the Great Dark Spot.', 'It is 30 times farther from the Sun than Earth.'],
    distance: '4.5 billion km',
    temp: '-214°C'
  }
];

const constellations: ConstellationData[] = [
  {
    name: 'Ursa Major',
    meaning: 'The Great Bear',
    description: 'Also known as the Big Dipper! It looks like a giant spoon in the sky.',
    findingTips: 'Look North! Find the 7 bright stars shaped like a spoon. The two stars at the end of the bowl point straight to the North Star.',
    bestSeason: 'All Year',
    stars: [
      { x: 85, y: 35 }, { x: 85, y: 55 }, { x: 65, y: 55 }, { x: 60, y: 40 }, // Bowl
      { x: 45, y: 45 }, { x: 30, y: 50 }, { x: 10, y: 65 }  // Handle
    ],
    lines: [[0,1], [1,2], [2,3], [3,0], [3,4], [4,5], [5,6]]
  },
  {
    name: 'Orion',
    meaning: 'The Hunter',
    description: 'A mighty hunter! Look for the belt of 3 bright stars in a row.',
    findingTips: 'Look South in the winter evening. Find three bright stars close together in a straight line - that is Orion\'s Belt!',
    bestSeason: 'Winter',
    stars: [
      { x: 30, y: 20 }, { x: 70, y: 20 }, // Shoulders
      { x: 45, y: 50 }, { x: 50, y: 50 }, { x: 55, y: 50 }, // Belt
      { x: 30, y: 80 }, { x: 70, y: 80 } // Feet
    ],
    lines: [[0,2], [2,3], [3,4], [4,1], [2,5], [4,6]]
  },
  {
    name: 'Cassiopeia',
    meaning: 'The Queen',
    description: 'A queen on her throne. It looks like a big "W" or "M".',
    findingTips: 'Look high in the North sky. It is across from the Big Dipper and looks like the letter W.',
    bestSeason: 'All Year',
    stars: [
      { x: 10, y: 30 }, { x: 30, y: 70 }, { x: 50, y: 40 }, { x: 70, y: 70 }, { x: 90, y: 30 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    name: 'Aries',
    meaning: 'The Ram',
    description: 'A brave ram with golden fleece! A simple curved line of stars.',
    findingTips: 'Look for a small crooked line of 3 stars in the Autumn sky, not far from the Pleiades star cluster.',
    bestSeason: 'Autumn',
    stars: [
       { x: 20, y: 60 }, { x: 50, y: 50 }, { x: 70, y: 55 }, { x: 80, y: 65 }
    ],
    lines: [[0,1], [1,2], [2,3]]
  },
  {
    name: 'Taurus',
    meaning: 'The Bull',
    description: 'A strong bull with long horns. The bright red star Aldebaran is its eye.',
    findingTips: 'Find Orion\'s belt, then follow the line up and to the right to find a bright orange-red star (Aldebaran) in a V-shape.',
    bestSeason: 'Winter',
    stars: [
      { x: 50, y: 50 }, { x: 30, y: 40 }, { x: 30, y: 60 }, { x: 70, y: 30 }, { x: 70, y: 70 }
    ],
    lines: [[0,1], [0,2], [0,3], [0,4]] // Simple V with horns
  },
  {
    name: 'Gemini',
    meaning: 'The Twins',
    description: 'Two brothers, Castor and Pollux, standing side by side.',
    findingTips: 'Look high in the Winter sky above Orion. Look for two bright stars of similar brightness close together.',
    bestSeason: 'Winter',
    stars: [
      { x: 30, y: 20 }, { x: 60, y: 20 }, // Heads
      { x: 30, y: 70 }, { x: 60, y: 70 }  // Feet
    ],
    lines: [[0,2], [1,3], [0,1], [2,3]] // Boxy representation
  },
  {
    name: 'Cancer',
    meaning: 'The Crab',
    description: 'A faint crab shape that looks like an upside-down Y.',
    findingTips: 'It is very faint! Look between the bright Twins (Gemini) and the Lion (Leo). You need a very dark sky.',
    bestSeason: 'Spring',
    stars: [
      { x: 50, y: 50 }, { x: 30, y: 70 }, { x: 70, y: 70 }, { x: 50, y: 30 }
    ],
    lines: [[0,1], [0,2], [0,3]]
  },
  {
    name: 'Leo',
    meaning: 'The Lion',
    description: 'Roar! Look for a backwards question mark for his head.',
    findingTips: 'Look South in Spring. Find a shape that looks like a backwards question mark - that is the lion\'s head!',
    bestSeason: 'Spring',
    stars: [
      { x: 70, y: 75 }, { x: 80, y: 55 }, { x: 65, y: 50 }, { x: 55, y: 35 }, { x: 40, y: 25 }, // Sickle
      { x: 30, y: 60 }, { x: 10, y: 55 } // Body/Tail
    ],
    lines: [[0,1], [1,2], [2,3], [3,4], [2,5], [5,6], [6,0]]
  },
  {
    name: 'Virgo',
    meaning: 'The Maiden',
    description: 'The second largest constellation! She holds a spike of grain.',
    findingTips: 'Follow the curve of the Big Dipper\'s handle to "arc to Arcturus" (orange star), then "spike to Spica" (blue star in Virgo).',
    bestSeason: 'Spring',
    stars: [
        { x: 50, y: 20 }, { x: 20, y: 50 }, { x: 80, y: 50 }, { x: 50, y: 80 }
    ],
    lines: [[0,1], [1,3], [3,2], [2,0]] // Diamond simplified
  },
  {
    name: 'Libra',
    meaning: 'The Scales',
    description: 'Used to weigh things. It looks like a lopsided diamond.',
    findingTips: 'Look for a diamond shape in the Summer sky, roughly between the bright star Spica (Virgo) and the red star Antares (Scorpius).',
    bestSeason: 'Summer',
    stars: [
        { x: 50, y: 30 }, { x: 30, y: 60 }, { x: 70, y: 60 }, { x: 50, y: 80 }
    ],
    lines: [[0,1], [1,3], [3,2], [2,0]]
  },
  {
    name: 'Scorpius',
    meaning: 'The Scorpion',
    description: 'A big scorpion with a long curling tail and a stinger!',
    findingTips: 'Look South in Summer. It looks like a big fishhook with a bright red heart (the star Antares).',
    bestSeason: 'Summer',
    stars: [
      { x: 80, y: 20 }, { x: 70, y: 30 }, { x: 60, y: 40 }, { x: 50, y: 50 }, { x: 50, y: 70 }, { x: 60, y: 80 }, { x: 75, y: 80 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4], [4,5], [5,6]]
  },
  {
    name: 'Sagittarius',
    meaning: 'The Archer',
    description: 'It is supposed to be an archer, but it looks exactly like a teapot!',
    findingTips: 'Look South in the Summer, to the left of Scorpius. It looks exactly like a teapot with steam (the Milky Way) coming out!',
    bestSeason: 'Summer',
    stars: [
      { x: 30, y: 50 }, { x: 70, y: 50 }, { x: 50, y: 30 }, { x: 40, y: 70 }, { x: 60, y: 70 }
    ],
    lines: [[0,2], [2,1], [1,4], [4,3], [3,0], [0,2]] // Teapot-ish
  },
  {
    name: 'Capricornus',
    meaning: 'The Sea Goat',
    description: 'A goat with a fish tail. It looks like a big smile!',
    findingTips: 'Look for a shape like a big smile or a bikini bottom in the southern sky during Autumn evenings.',
    bestSeason: 'Autumn',
    stars: [
      { x: 20, y: 30 }, { x: 50, y: 70 }, { x: 80, y: 30 }
    ],
    lines: [[0,1], [1,2], [2,0]]
  },
  {
    name: 'Aquarius',
    meaning: 'The Water Bearer',
    description: 'A person pouring water. Look for a zig-zag splash of stars.',
    findingTips: 'Look for a faint zig-zag line ("the water") in the Autumn sky, above the bright star Fomalhaut.',
    bestSeason: 'Autumn',
    stars: [
      { x: 20, y: 30 }, { x: 35, y: 50 }, { x: 50, y: 30 }, { x: 65, y: 50 }, { x: 80, y: 30 }
    ],
    lines: [[0,1], [1,2], [2,3], [3,4]]
  },
  {
    name: 'Pisces',
    meaning: 'The Fishes',
    description: 'Two fish swimming in different directions, connected by a cord.',
    findingTips: 'Look for a large "V" shape of faint stars in the Autumn sky.',
    bestSeason: 'Autumn',
    stars: [
      { x: 20, y: 30 }, { x: 50, y: 70 }, { x: 80, y: 30 }
    ],
    lines: [[0,1], [1,2]]
  }
];

const funFacts = [
  {
    title: "Space Sound?",
    text: "Space is completely silent! Sound needs air to travel, and space has no air. Astronauts use radios to talk.",
    icon: VolumeX,
    color: "from-purple-600 to-indigo-700",
    textColor: "text-purple-100"
  },
  {
    title: "Super Fast!",
    text: "The ISS travels at 17,500 miles per hour. That means it circles the Earth every 90 minutes!",
    icon: Rocket,
    color: "from-pink-500 to-rose-600",
    textColor: "text-pink-100"
  },
  {
    title: "Forever Footprints",
    text: "Footprints left on the Moon will stay there for millions of years because there is no wind to blow them away.",
    icon: Footprints,
    color: "from-slate-600 to-slate-500",
    textColor: "text-slate-100"
  },
  {
    title: "Diamond Rain",
    text: "On Neptune and Uranus, scientists think it rains real diamonds because of the extreme pressure!",
    icon: Gem,
    color: "from-cyan-500 to-blue-600",
    textColor: "text-cyan-100"
  },
  {
    title: "Blue Sunsets",
    text: "On Mars, sunsets are actually blue! The red dust in the air scatters red light, letting blue light through.",
    icon: Sun,
    color: "from-orange-500 to-red-600",
    textColor: "text-orange-100"
  },
  {
    title: "Space Junk",
    text: "There are over 500,000 pieces of space junk orbiting Earth, including broken satellites and lost tools!",
    icon: Trash2,
    color: "from-green-600 to-emerald-700",
    textColor: "text-green-100"
  },
  {
    title: "Heavy Stars",
    text: "A teaspoon of a Neutron Star weighs 6 billion tons! That's as heavy as Mount Everest.",
    icon: Scale,
    color: "from-yellow-500 to-amber-600",
    textColor: "text-yellow-100"
  },
  {
    title: "Giant Sun",
    text: "The Sun is so massive that you could fit 1.3 million Earths inside it! It makes up 99.8% of the solar system's mass.",
    icon: Sun,
    color: "from-amber-500 to-orange-600",
    textColor: "text-amber-100"
  }
];

// Reusable SVG component for Constellations
const ConstellationSVG: React.FC<{ data: ConstellationData; className?: string }> = ({ data, className }) => (
  <svg className={className} viewBox="0 0 100 100" preserveAspectRatio="xMidYMid meet">
    {/* Lines */}
    {data.lines.map((line, i) => (
      <line
        key={i}
        x1={data.stars[line[0]].x}
        y1={data.stars[line[0]].y}
        x2={data.stars[line[1]].x}
        y2={data.stars[line[1]].y}
        stroke="white"
        strokeWidth="0.5"
        strokeDasharray="2,1"
        className="opacity-40"
      />
    ))}
    {/* Stars */}
    {data.stars.map((star, i) => (
      <circle
        key={i}
        cx={star.x}
        cy={star.y}
        r={2}
        fill="white"
        className="animate-pulse"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </svg>
);

const PlanetSVG: React.FC<{ name: string; className: string }> = ({ name, className }) => {
  switch (name) {
    case 'Mercury':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_10px_rgba(168,162,158,0.5)]`}>
          <defs>
            <radialGradient id="mercuryGradient" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#e5e5e5" />
              <stop offset="50%" stopColor="#a3a3a3" />
              <stop offset="100%" stopColor="#525252" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#mercuryGradient)" />
          {/* Craters */}
          <circle cx="30" cy="35" r="8" fill="#525252" opacity="0.1" />
          <circle cx="75" cy="65" r="10" fill="#525252" opacity="0.1" />
          <circle cx="20" cy="70" r="5" fill="#525252" opacity="0.1" />
          {/* Face: Nervous/Fast */}
          <g transform="translate(50, 50)">
            <circle cx="-12" cy="-4" r="5" fill="white" />
            <circle cx="-12" cy="-4" r="2" fill="#1e293b" />
            <circle cx="12" cy="-4" r="5" fill="white" />
            <circle cx="12" cy="-4" r="2" fill="#1e293b" />
            <path d="M-5,10 Q0,15 5,10" fill="none" stroke="#1e293b" strokeWidth="2" strokeLinecap="round" />
            {/* Sweat drop */}
            <path d="M25,-10 Q28,-5 25,0 Q22,-5 25,-10" fill="#0ea5e9" opacity="0.8" />
          </g>
        </svg>
      );
    case 'Venus':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_15px_rgba(251,146,60,0.5)]`}>
          <defs>
            <radialGradient id="venusGradient" cx="40%" cy="40%" r="70%">
              <stop offset="0%" stopColor="#fed7aa" />
              <stop offset="40%" stopColor="#fb923c" />
              <stop offset="100%" stopColor="#c2410c" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#venusGradient)" />
          {/* Clouds Swirls */}
          <path d="M10,50 Q30,30 50,50 T90,50" fill="none" stroke="#fff" strokeWidth="15" opacity="0.2" filter="blur(4px)" />
          <path d="M10,30 Q40,60 70,30" fill="none" stroke="#fff" strokeWidth="10" opacity="0.2" filter="blur(4px)" />
          {/* Face: Lovely/Hot */}
          <g transform="translate(50, 52)">
             {/* Closed happy eyes with lashes */}
             <path d="M-18,-5 Q-12,-12 -6,-5" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
             <path d="M-18,-5 L-20,-8" stroke="#7c2d12" strokeWidth="2" />
             <path d="M-6,-5 L-4,-8" stroke="#7c2d12" strokeWidth="2" />

             <path d="M6,-5 Q12,-12 18,-5" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
             <path d="M6,-5 L4,-8" stroke="#7c2d12" strokeWidth="2" />
             <path d="M18,-5 L20,-8" stroke="#7c2d12" strokeWidth="2" />

             {/* Mouth */}
             <path d="M-8,10 Q0,18 8,10" fill="none" stroke="#7c2d12" strokeWidth="2.5" strokeLinecap="round" />
             
             {/* Cheeks */}
             <circle cx="-22" cy="5" r="6" fill="#fca5a5" opacity="0.6" />
             <circle cx="22" cy="5" r="6" fill="#fca5a5" opacity="0.6" />
          </g>
        </svg>
      );
    case 'Earth':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_15px_rgba(59,130,246,0.5)]`}>
          <defs>
            <radialGradient id="earthWater" cx="30%" cy="30%" r="70%">
              <stop offset="0%" stopColor="#60a5fa" />
              <stop offset="50%" stopColor="#2563eb" />
              <stop offset="100%" stopColor="#1e3a8a" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#earthWater)" />
          {/* Continents */}
          <path d="M25,25 Q40,10 60,30 T75,55 Q55,75 35,60 T25,25" fill="#22c55e" opacity="0.9" />
          <path d="M70,25 Q80,20 90,35" fill="none" stroke="#22c55e" strokeWidth="6" strokeLinecap="round" opacity="0.9" />
          <path d="M15,65 Q25,75 35,70" fill="none" stroke="#22c55e" strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          {/* Face: Happy/Vibrant */}
          <g transform="translate(50, 50)">
             {/* Eyes */}
             <circle cx="-14" cy="-5" r="7" fill="white" />
             <circle cx="-14" cy="-5" r="3" fill="#1e293b" />
             <circle cx="-12" cy="-7" r="1.5" fill="white" opacity="0.8" />
             
             <circle cx="14" cy="-5" r="7" fill="white" />
             <circle cx="14" cy="-5" r="3" fill="#1e293b" />
             <circle cx="16" cy="-7" r="1.5" fill="white" opacity="0.8" />

             {/* Mouth */}
             <path d="M-10,10 Q0,20 10,10" fill="none" stroke="#1e293b" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'Mars':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_15px_rgba(239,68,68,0.5)]`}>
          <defs>
            <radialGradient id="marsGradient" cx="35%" cy="35%" r="60%">
              <stop offset="0%" stopColor="#fca5a5" />
              <stop offset="50%" stopColor="#ef4444" />
              <stop offset="100%" stopColor="#7f1d1d" />
            </radialGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#marsGradient)" />
          {/* Craters */}
          <circle cx="25" cy="35" r="6" fill="#7f1d1d" opacity="0.2" />
          <circle cx="75" cy="65" r="10" fill="#7f1d1d" opacity="0.2" />
          <circle cx="65" cy="25" r="4" fill="#7f1d1d" opacity="0.2" />
          {/* Face: Determined/Tough */}
          <g transform="translate(50, 50)">
             {/* Eyebrows */}
             <path d="M-18,-12 L-6,-8" stroke="#450a0a" strokeWidth="2.5" strokeLinecap="round" />
             <path d="M18,-12 L6,-8" stroke="#450a0a" strokeWidth="2.5" strokeLinecap="round" />
             
             {/* Eyes */}
             <circle cx="-12" cy="-2" r="5" fill="#450a0a" />
             <circle cx="12" cy="-2" r="5" fill="#450a0a" />
             
             {/* Mouth - Determined zigzag or straight */}
             <path d="M-8,12 L8,12" stroke="#450a0a" strokeWidth="2.5" strokeLinecap="round" />
          </g>
        </svg>
      );
    case 'Jupiter':
      return (
        <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_20px_rgba(234,88,12,0.4)]`}>
           <defs>
            <linearGradient id="jupiterGradient" x1="0" y1="0" x2="1" y2="1" gradientTransform="rotate(-20)">
              <stop offset="0%" stopColor="#ffedd5" />
              <stop offset="20%" stopColor="#fdba74" />
              <stop offset="40%" stopColor="#c2410c" />
              <stop offset="45%" stopColor="#9a3412" />
              <stop offset="60%" stopColor="#fdba74" />
              <stop offset="80%" stopColor="#9a3412" />
              <stop offset="100%" stopColor="#ffedd5" />
            </linearGradient>
          </defs>
          <circle cx="50" cy="50" r="48" fill="url(#jupiterGradient)" />
          {/* Great Red Spot as a blushing cheek or just distinct */}
          <ellipse cx="75" cy="60" rx="12" ry="8" fill="#7f1d1d" opacity="0.6" transform="rotate(-20 75 60)" />
          
          {/* Face: Jolly Giant */}
          <g transform="translate(50, 45)">
             {/* Eyes - Happy Arcs */}
             <path d="M-15,-5 Q-10,-10 -5,-5" fill="none" stroke="#431407" strokeWidth="3" strokeLinecap="round" />
             <path d="M5,-5 Q10,-10 15,-5" fill="none" stroke="#431407" strokeWidth="3" strokeLinecap="round" />
             
             {/* Mouth - Big Laugh */}
             <path d="M-15,10 Q0,25 15,10 Z" fill="#431407" />
             <path d="M-10,12 Q0,18 10,12" fill="#ef4444" opacity="0.8" /> {/* Tongue */}
          </g>
        </svg>
      );
    case 'Saturn':
      return (
        <svg viewBox="0 0 160 100" className={`${className} drop-shadow-[0_0_20px_rgba(253,224,71,0.4)]`}>
          <defs>
             <linearGradient id="saturnBody" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fef08a" />
                <stop offset="100%" stopColor="#eab308" />
             </linearGradient>
             <linearGradient id="ringsGradient" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#854d0e" stopOpacity="0"/>
                <stop offset="25%" stopColor="#ca8a04" stopOpacity="0.7"/>
                <stop offset="50%" stopColor="#fefce8" stopOpacity="0.9"/>
                <stop offset="75%" stopColor="#ca8a04" stopOpacity="0.7"/>
                <stop offset="100%" stopColor="#854d0e" stopOpacity="0"/>
             </linearGradient>
          </defs>
          
          <g transform="translate(80, 50) rotate(15)">
            {/* Back Rings */}
            <ellipse cx="0" cy="0" rx="70" ry="18" fill="none" stroke="url(#ringsGradient)" strokeWidth="18" opacity="0.6" />
            
            {/* Planet Body */}
            <circle cx="0" cy="0" r="28" fill="url(#saturnBody)" />
            
            {/* Face: Chill/Cool */}
            <g transform="translate(0, 0)">
                 {/* Sunglasses or just cool eyes. Let's do simple happy eyes */}
                 <circle cx="-10" cy="-4" r="3" fill="#854d0e" />
                 <circle cx="10" cy="-4" r="3" fill="#854d0e" />
                 <path d="M-5,6 Q0,10 5,6" fill="none" stroke="#854d0e" strokeWidth="1.5" strokeLinecap="round" />
            </g>

            {/* Front Ring Segment */}
             <path d="M -70,2 A 72,20 0 0,0 70,2" fill="none" stroke="url(#ringsGradient)" strokeWidth="18" opacity="0.8" strokeLinecap="round" />
             <path d="M -60,0 A 60,16 0 0,0 60,0" fill="none" stroke="#fff" strokeWidth="1" opacity="0.3" />
          </g>
        </svg>
      );
    case 'Uranus':
        return (
          <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_15px_rgba(34,211,238,0.5)]`}>
            <defs>
              <radialGradient id="uranusGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#a5f3fc" />
                <stop offset="50%" stopColor="#22d3ee" />
                <stop offset="100%" stopColor="#0891b2" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#uranusGradient)" />
            {/* Faint Ring Vertical */}
            <ellipse cx="50" cy="50" rx="10" ry="60" fill="none" stroke="white" strokeWidth="1" opacity="0.3" transform="rotate(10 50 50)" />
            
            {/* Face: Sideways/Silly */}
            <g transform="translate(50, 50) rotate(90)">
                <circle cx="-12" cy="-8" r="5" fill="#164e63" />
                <circle cx="12" cy="-8" r="5" fill="#164e63" />
                <path d="M-8,8 Q0,15 8,8" fill="none" stroke="#164e63" strokeWidth="2.5" strokeLinecap="round" />
            </g>
          </svg>
        );
    case 'Neptune':
        return (
          <svg viewBox="0 0 100 100" className={`${className} drop-shadow-[0_0_15px_rgba(37,99,235,0.5)]`}>
            <defs>
              <radialGradient id="neptuneGradient" cx="30%" cy="30%" r="70%">
                <stop offset="0%" stopColor="#60a5fa" />
                <stop offset="50%" stopColor="#2563eb" />
                <stop offset="100%" stopColor="#1e40af" />
              </radialGradient>
            </defs>
            <circle cx="50" cy="50" r="48" fill="url(#neptuneGradient)" />
            {/* Clouds */}
            <path d="M20,60 Q40,50 60,65" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
            <path d="M30,30 Q60,20 80,35" fill="none" stroke="white" strokeWidth="2" opacity="0.3" />
            
            {/* Face: Windy/Blowing */}
            <g transform="translate(50, 50)">
                 {/* Squinting Eyes */}
                 <path d="M-15,-5 L-5,-8" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                 <path d="M15,-5 L5,-8" stroke="#1e3a8a" strokeWidth="2.5" strokeLinecap="round" />
                 
                 {/* Mouth blowing wind */}
                 <circle cx="0" cy="10" r="4" fill="#1e3a8a" />
                 {/* Wind lines */}
                 <path d="M5,10 L15,8" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
                 <path d="M5,12 L18,14" stroke="#cbd5e1" strokeWidth="1" opacity="0.6" />
            </g>
          </svg>
        );
    default:
      return <div className={`rounded-full ${className} bg-gray-500`} />;
  }
};

const ConstellationCard: React.FC<{ data: ConstellationData; onClick: (data: ConstellationData) => void }> = ({ data, onClick }) => {
  return (
    <div 
      className="min-w-[300px] md:min-w-[400px] bg-slate-900/60 border border-slate-700/50 rounded-3xl p-6 flex-shrink-0 snap-center hover:bg-slate-800/60 transition-colors duration-300 cursor-pointer group"
      onMouseEnter={() => soundManager.playHover()}
      onClick={() => onClick(data)}
    >
      <div className="relative h-48 md:h-60 w-full bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden mb-6 group-hover:border-indigo-500/30 transition-colors">
        <div className="absolute inset-0 p-4">
            <ConstellationSVG data={data} className="w-full h-full" />
        </div>
        <div className="absolute bottom-3 right-3 text-[10px] text-slate-500 font-mono border border-slate-800 px-2 py-0.5 rounded-full">
          Sys: {data.name}
        </div>
        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity">
            <span className="bg-indigo-600 text-white text-xs font-bold px-3 py-1.5 rounded-full">Click to Explore</span>
        </div>
      </div>
      
      <div className="space-y-3">
        <div className="flex justify-between items-start">
          <h3 className="text-2xl font-bold text-white group-hover:text-indigo-300 transition-colors">{data.name}</h3>
          <span className="text-xs font-mono text-indigo-400 bg-indigo-900/30 px-2 py-1 rounded">{data.meaning}</span>
        </div>
        <p className="text-slate-300 leading-relaxed text-sm line-clamp-2">
          {data.description}
        </p>
      </div>
    </div>
  );
};

const ConstellationModal: React.FC<{ constellation: ConstellationData; onClose: () => void }> = ({ constellation, onClose }) => {
  if (!constellation) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
      
      <div className="relative bg-slate-900 border border-indigo-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Visual Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center bg-gradient-to-b from-slate-900 to-indigo-950 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <StarField />
          </div>
          <div className="z-10 w-full h-full p-8 animate-float-slow">
            <ConstellationSVG data={constellation} className="w-full h-full drop-shadow-[0_0_10px_rgba(255,255,255,0.8)]" />
          </div>
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/2 p-8 md:p-10 space-y-8 bg-slate-900">
          
          <div>
            <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 uppercase tracking-wider">
                    {constellation.name}
                </h2>
            </div>
            <p className="text-indigo-400 font-mono text-lg">{constellation.meaning}</p>
          </div>

          <div className="space-y-3">
            <div className="flex items-center gap-2 text-yellow-300 font-bold">
                <Info className="w-5 h-5" />
                <h3>The Myth</h3>
            </div>
            <p className="text-slate-300 leading-relaxed text-lg">
              {constellation.description}
            </p>
          </div>

          <div className="bg-indigo-950/50 rounded-2xl p-6 border border-indigo-500/20 space-y-4">
            <div className="flex items-center gap-2 text-indigo-300 font-bold border-b border-indigo-500/20 pb-2">
                <Compass className="w-5 h-5" />
                <h3>How to Find It</h3>
            </div>
            <p className="text-slate-200 leading-relaxed">
                {constellation.findingTips}
            </p>
            <div className="flex items-center gap-2 text-sm text-slate-400 pt-2">
                <Calendar className="w-4 h-4" />
                <span>Best viewing season: <span className="text-white font-bold">{constellation.bestSeason}</span></span>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

const PlanetModal: React.FC<{ planet: PlanetData; onClose: () => void }> = ({ planet, onClose }) => {
  if (!planet) return null;

  const handleClose = () => {
    soundManager.playClick();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 sm:p-6 animate-fade-in">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-md" onClick={handleClose} />
      
      <div className="relative bg-slate-900 border border-indigo-500/50 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-y-auto flex flex-col md:flex-row shadow-[0_0_50px_rgba(79,70,229,0.3)] animate-scale-up">
        
        {/* Close Button */}
        <button 
          onClick={handleClose}
          className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 rounded-full text-white transition-colors z-10"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Visual Side */}
        <div className="w-full md:w-1/2 p-10 flex flex-col items-center justify-center bg-gradient-to-b from-indigo-950 to-slate-900 relative overflow-hidden">
          <div className="absolute inset-0 opacity-30">
            <StarField />
          </div>
          <div className="z-10 animate-float-slow">
            <PlanetSVG name={planet.name} className="w-64 h-64 md:w-80 md:h-80" />
          </div>
          <h2 className="text-4xl md:text-5xl font-black mt-8 text-transparent bg-clip-text bg-gradient-to-r from-white to-indigo-200 uppercase tracking-wider">
            {planet.name}
          </h2>
        </div>

        {/* Info Side */}
        <div className="w-full md:w-1/2 p-8 md:p-10 space-y-6 bg-slate-900">
          
          <div className="flex gap-4 text-sm font-mono text-indigo-300">
             <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
               <Ruler className="w-4 h-4" />
               {planet.distance}
             </div>
             <div className="flex items-center gap-2 bg-indigo-500/10 px-3 py-1.5 rounded-lg border border-indigo-500/20">
               <Thermometer className="w-4 h-4" />
               {planet.temp}
             </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-2xl font-bold text-white">Mission Briefing</h3>
            <p className="text-slate-300 leading-relaxed text-lg">
              {planet.details}
            </p>
          </div>

          <div className="space-y-4">
            <h3 className="text-xl font-bold text-yellow-400 flex items-center gap-2">
              <Star className="fill-yellow-400 w-5 h-5" />
              Fun Facts
            </h3>
            <ul className="space-y-3">
              {planet.facts.map((fact, i) => (
                <li key={i} className="flex items-start gap-3 text-slate-300">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-300 flex items-center justify-center text-xs font-bold mt-0.5">
                    {i + 1}
                  </span>
                  {fact}
                </li>
              ))}
            </ul>
          </div>

        </div>
      </div>
      
      {/* Inline styles for modal animations */}
      <style>{`
        @keyframes scaleUp {
          from { transform: scale(0.9); opacity: 0; }
          to { transform: scale(1); opacity: 1; }
        }
        @keyframes floatSlow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        .animate-scale-up {
          animation: scaleUp 0.3s ease-out forwards;
        }
        .animate-float-slow {
          animation: floatSlow 4s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

function App() {
  const satelliteRef = useRef<HTMLDivElement>(null);
  const trailRef = useRef<HTMLDivElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastPos = useRef({ x: 0, y: 0 });
  const hasGreetedRef = useRef(false);
  const [loaded, setLoaded] = useState(false);
  const [greeting, setGreeting] = useState(false);
  const [landed, setLanded] = useState(false);
  const [selectedPlanet, setSelectedPlanet] = useState<PlanetData | null>(null);
  const [selectedConstellation, setSelectedConstellation] = useState<ConstellationData | null>(null);
  const [quizMode, setQuizMode] = useState(false);
  const prevLandedRef = useRef(false);

  // Linear interpolation helper
  const lerp = (start: number, end: number, t: number) => start * (1 - t) + end * t;

  useEffect(() => {
    setLoaded(true);
    
    // Initialize lastPos
    if (satelliteRef.current) {
       const rect = satelliteRef.current.getBoundingClientRect();
       lastPos.current = { x: rect.left, y: rect.top };
    }

    const spawnParticle = (x: number, y: number) => {
      if (!trailRef.current) return;
      
      const particle = document.createElement('div');
      const size = Math.random() * 8 + 4; // 4px to 12px
      const colorClass = Math.random() > 0.5 ? 'bg-blue-400' : 'bg-white';
      
      // Randomize position slightly around the center
      const offsetX = (Math.random() - 0.5) * 10;
      const offsetY = (Math.random() - 0.5) * 10;

      particle.className = `absolute rounded-full blur-[1px] particle-trail pointer-events-none ${colorClass}`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.left = `${x + offsetX}px`;
      particle.style.top = `${y + offsetY}px`;
      
      trailRef.current.appendChild(particle);

      // Cleanup
      setTimeout(() => {
        if (particle && particle.parentNode) {
          particle.parentNode.removeChild(particle);
        }
      }, 800);
    };

    const handleScroll = () => {
      // Don't animate satellite during quiz mode as content is hidden
      if (quizMode || !satelliteRef.current || !containerRef.current) return;

      const scrollY = window.scrollY;
      const windowHeight = window.innerHeight;
      const docHeight = document.documentElement.scrollHeight;
      const totalScrollable = docHeight - windowHeight;
      
      // Trigger greeting on first significant scroll
      if (!hasGreetedRef.current && scrollY > 50) {
        hasGreetedRef.current = true;
        setGreeting(true);
      }

      // Calculate progress 0 to 1
      const progress = Math.max(0, Math.min(1, scrollY / totalScrollable));

      // Trigger landing animation at the very end
      const isLanded = progress > 0.96;
      setLanded(isLanded);

      // Play sound only on first landing
      if (isLanded && !prevLandedRef.current) {
        soundManager.playSuccess();
      }
      prevLandedRef.current = isLanded;

      // Define waypoints for the satellite path
      
      const width = window.innerWidth;
      const height = window.innerHeight;

      // Waypoints definition based on scroll progress (0.0 - 1.0)
      let targetX = 0;
      let targetY = 0;
      let targetRotate = 0;
      let targetScale = 1;

      // Logic: Interpolate between stages
      if (progress < 0.33) {
        // Stage 1: Home to Planets (Top Right -> Center Left)
        const localP = progress / 0.33; // 0 to 1 for this section
        targetX = lerp(width * 0.75, width * 0.1, localP);
        targetY = lerp(height * 0.2, height * 0.5, localP);
        targetRotate = lerp(-15, 45, localP);
        targetScale = lerp(1, 1.2, localP);
      } else if (progress < 0.66) {
        // Stage 2: Planets to Stars (Center Left -> Center Right)
        const localP = (progress - 0.33) / 0.33;
        targetX = lerp(width * 0.1, width * 0.8, localP);
        targetY = lerp(height * 0.5, height * 0.4, localP);
        targetRotate = lerp(45, 120, localP);
        targetScale = lerp(1.2, 0.8, localP);
      } else {
        // Stage 3: Stars to Fun Facts (Center Right -> Bottom Center)
        const localP = (progress - 0.66) / 0.34;
        targetX = lerp(width * 0.8, width * 0.5 - 60, localP); // -60 to center width of satellite roughly
        targetY = lerp(height * 0.4, height * 0.7, localP);
        targetRotate = lerp(120, 0, localP);
        targetScale = lerp(0.8, 1.5, localP);
      }

      // Apply transform directly for performance
      satelliteRef.current.style.transform = `translate(${targetX}px, ${targetY}px) rotate(${targetRotate}deg) scale(${targetScale})`;
      
      // Particle Trail Logic
      // Center of satellite is approx 70px offset from top/left based on its 140px size
      const centerX = targetX + 70;
      const centerY = targetY + 70;
      
      const dist = Math.hypot(centerX - lastPos.current.x, centerY - lastPos.current.y);
      
      // Spawn particle every 10px of movement, but only if not landed (to stop trail when stationary)
      if (dist > 10 && progress <= 0.96) {
        spawnParticle(centerX, centerY);
        lastPos.current = { x: centerX, y: centerY };
      }
    };

    window.addEventListener('scroll', handleScroll);
    if (!quizMode) handleScroll(); // Init position

    return () => window.removeEventListener('scroll', handleScroll);
  }, [quizMode]);

  const handleStartJourney = () => {
    soundManager.playClick();
    soundManager.startAmbient();
    document.getElementById('planets')?.scrollIntoView({behavior: 'smooth'});
  };

  const handlePlanetClick = (planet: PlanetData) => {
    soundManager.playOpen();
    setSelectedPlanet(planet);
  };

  const handleConstellationClick = (constellation: ConstellationData) => {
    soundManager.playOpen();
    setSelectedConstellation(constellation);
  }

  const handleQuizToggle = () => {
    if (quizMode) {
      setQuizMode(false);
      // Brief timeout to let rendering settle before scrolling home
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }, 50);
    } else {
      setQuizMode(true);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <div ref={containerRef} className={`relative bg-slate-950 min-h-screen text-slate-100 selection:bg-indigo-500 selection:text-white transition-opacity duration-700 ${loaded ? 'opacity-100' : 'opacity-0'}`}>
      
      {/* Backgrounds */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-900 via-indigo-950 to-black z-0" />
      <StarField />
      
      {/* Particle Trail Layer */}
      <div ref={trailRef} className="fixed inset-0 z-30 pointer-events-none" />
      
      {/* Fixed UI */}
      <Navbar items={navItems} quizMode={quizMode} onQuizToggle={handleQuizToggle} />
      
      {/* Hide satellite during quiz mode */}
      <div className={quizMode ? 'opacity-0 pointer-events-none' : 'opacity-100 transition-opacity duration-500'}>
        <Satellite ref={satelliteRef} greetUser={greeting} landed={landed} />
      </div>
      
      {/* Chat Bot */}
      <ChatBot />

      {/* Interactive Modals */}
      {selectedPlanet && <PlanetModal planet={selectedPlanet} onClose={() => setSelectedPlanet(null)} />}
      {selectedConstellation && <ConstellationModal constellation={selectedConstellation} onClose={() => setSelectedConstellation(null)} />}

      {/* Main Content */}
      <main className="relative z-10">
        
        {quizMode ? (
          <Quiz onExit={handleQuizToggle} />
        ) : (
          <>
            {/* HERO SECTION */}
            <Section id="home" className="flex-col">
              <div className="flex flex-col md:flex-row items-center gap-12">
                <div className="flex-1 text-center md:text-left space-y-6">
                  <div className="inline-block px-4 py-2 bg-indigo-500/20 border border-indigo-400/30 rounded-full text-indigo-300 font-mono text-sm mb-4 animate-bounce">
                    Welcome Future Astronauts! 🚀
                  </div>
                  <h1 className="text-6xl md:text-8xl font-black leading-tight bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Explore the <br /> Universe
                  </h1>
                  <p className="text-xl md:text-2xl text-slate-300 max-w-lg leading-relaxed">
                    Join our friendly satellite on a magical journey through the stars, planets, and galaxies!
                  </p>
                  <div className="pt-8">
                    <button 
                      onClick={handleStartJourney}
                      className="group relative px-8 py-4 bg-white text-indigo-900 font-bold rounded-full text-lg shadow-[0_0_20px_rgba(255,255,255,0.3)] hover:shadow-[0_0_30px_rgba(255,255,255,0.5)] hover:scale-105 transition-all"
                    >
                      Blast Off to the Solar System! 🚀
                      <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </button>
                  </div>
                </div>
                <div className="flex-1 flex justify-center items-center">
                  {/* Placeholder for visual balance, Satellite starts here roughly via JS */}
                </div>
              </div>
              
              <div className="absolute bottom-10 left-1/2 -translate-x-1/2 animate-bounce opacity-50">
                <ChevronDown className="w-8 h-8 text-white" />
              </div>
            </Section>

            {/* PLANETS SECTION */}
            <Section id="planets" title="Our Solar Neighbors" subtitle="Stage 1">
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 pt-10">
                {planets.map((planet) => (
                  <div 
                    key={planet.name} 
                    onClick={() => handlePlanetClick(planet)}
                    className="group relative bg-white/5 border border-white/10 p-6 rounded-3xl backdrop-blur-sm hover:bg-white/10 transition-all duration-300 hover:-translate-y-2 text-center flex flex-col items-center cursor-pointer hover:shadow-[0_0_30px_rgba(99,102,241,0.3)]"
                  >
                    <div className="mb-6 transform transition-transform duration-500 group-hover:scale-110 h-32 flex items-center justify-center">
                      <PlanetSVG name={planet.name} className={planet.size} />
                    </div>
                    <h3 className="text-2xl font-bold mb-3 group-hover:text-indigo-300 transition-colors">{planet.name}</h3>
                    <p className="text-slate-300 leading-relaxed text-sm">{planet.description}</p>
                    <div className="mt-4 text-xs font-bold text-indigo-400 uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to Explore
                    </div>
                    
                    {/* Decorative orbit ring */}
                    <div className="absolute inset-0 border-2 border-dashed border-white/5 rounded-3xl pointer-events-none group-hover:border-indigo-400/30 transition-colors" />
                  </div>
                ))}
              </div>
            </Section>

            {/* STARS SECTION */}
            <Section id="stars" title="Constellation Station" subtitle="Stage 2">
              <div className="w-full space-y-12">
                
                <div className="text-center max-w-2xl mx-auto space-y-6">
                  <h3 className="text-3xl font-bold text-yellow-300 flex items-center justify-center gap-3">
                    <Star className="fill-yellow-300" />
                    Did you know?
                  </h3>
                  <p className="text-lg text-slate-200 leading-loose">
                    Stars are giant balls of hot gas! Some stars form patterns called <span className="text-indigo-300 font-bold">constellations</span>. Ancient people looked up and saw pictures of animals and heroes in the sky.
                  </p>
                  <div className="flex items-center justify-center text-slate-400 text-sm gap-2">
                    <MoveRight className="w-4 h-4 animate-pulse" />
                    Scroll below to discover them!
                  </div>
                </div>

                {/* Constellation Carousel */}
                <div className="flex overflow-x-auto gap-8 pb-12 snap-x snap-mandatory px-4 md:px-0 scrollbar-hide">
                  {constellations.map((constellation) => (
                    <ConstellationCard key={constellation.name} data={constellation} onClick={handleConstellationClick} />
                  ))}
                </div>

              </div>
            </Section>

            {/* FUN FACTS / FOOTER */}
            <Section id="fun-facts" title="Satellite's Data Log" subtitle="Mission Complete!">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full max-w-6xl mb-16">
                {funFacts.map((fact, index) => (
                  <div 
                    key={index} 
                    className={`bg-gradient-to-br ${fact.color} p-8 rounded-3xl shadow-xl transform hover:scale-105 transition-transform flex flex-col justify-between`}
                  >
                  <div className="flex items-start gap-4">
                    <div className="bg-white/20 p-3 rounded-xl flex-shrink-0">
                      <fact.icon className="w-8 h-8 text-white" />
                    </div>
                    <div>
                      <h4 className="text-xl font-bold mb-2 text-white">{fact.title}</h4>
                      <p className={fact.textColor}>{fact.text}</p>
                    </div>
                  </div>
                </div>
                ))}
              </div>

              {/* Quiz CTA */}
              <div className="w-full max-w-4xl mx-auto bg-slate-900/80 border border-indigo-500/50 rounded-3xl p-8 md:p-12 text-center relative overflow-hidden group">
                <div className="absolute inset-0 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 opacity-50 group-hover:opacity-100 transition-opacity" />
                <div className="relative z-10 space-y-6">
                  <h3 className="text-3xl font-black text-white">Think you're a Space Expert?</h3>
                  <p className="text-indigo-200 text-lg">Test your knowledge with our fun space quiz!</p>
                  <button 
                    onClick={() => handleQuizToggle()}
                    className="inline-flex items-center gap-2 px-8 py-4 bg-white text-indigo-900 font-bold rounded-full text-lg shadow-lg hover:scale-105 transition-transform"
                  >
                    <BrainCircuit className="w-6 h-6" />
                    Take the Quiz
                  </button>
                </div>
              </div>

              <footer className="mt-24 pt-8 border-t border-white/10 w-full text-center text-slate-400">
                <p className="mb-4">Thanks for exploring with us!</p>
                <div className="flex justify-center gap-4 text-sm">
                  <a href="#" className="hover:text-indigo-400 transition-colors">Privacy Policy</a>
                  <span>•</span>
                  <a href="#" className="hover:text-indigo-400 transition-colors">Safety for Kids</a>
                  <span>•</span>
                  <a href="#" className="hover:text-indigo-400 transition-colors">Contact</a>
                </div>
                <p className="mt-8 text-xs opacity-50">© 2024 CosmoKids Explorer. Made with Stardust.</p>
              </footer>
            </Section>
          </>
        )}

      </main>
    </div>
  );
}

export default App;