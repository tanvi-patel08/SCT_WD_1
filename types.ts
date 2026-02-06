export interface NavItem {
  label: string;
  id: string;
}

export interface SatellitePosition {
  x: number; // Percentage 0-100
  y: number; // Percentage 0-100 relative to viewport
  rotate: number; // Degrees
  scale: number;
}

export interface PlanetData {
  name: string;
  color: string;
  size: string;
  description: string;
  details: string;
  facts: string[];
  distance: string; // e.g. "57 million km"
  temp: string; // e.g. "-100°C"
}

export interface ConstellationData {
  name: string;
  meaning: string;
  description: string;
  findingTips: string;
  bestSeason: string;
  stars: { x: number; y: number }[]; // 0-100 coordinates
  lines: number[][]; // Indices of stars to connect [start, end]
}