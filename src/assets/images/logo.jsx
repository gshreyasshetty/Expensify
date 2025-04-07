import React from 'react';

export const LogoSVG = ({ width = 512, height = 512, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 512 512" 
    width={width} 
    height={height}
    className={className}
  >
    <circle cx="256" cy="256" r="240" fill="#5E72E4" />
    <circle cx="256" cy="256" r="210" fill="#ffffff" />
    <circle cx="256" cy="256" r="200" fill="#5E72E4" opacity="0.1" />
    
    <g transform="translate(130, 130) scale(0.5)">
      <rect x="70" y="80" width="250" height="40" rx="10" fill="#5E72E4" />
      <rect x="70" y="180" width="200" height="40" rx="10" fill="#5E72E4" />
      <rect x="70" y="280" width="250" height="40" rx="10" fill="#5E72E4" />
      
      <rect x="70" y="80" width="40" height="240" rx="10" fill="#5E72E4" />
      
      <circle cx="370" cy="200" r="80" fill="#5E72E4" opacity="0.2" />
      <circle cx="370" cy="200" r="70" fill="#5E72E4" opacity="0.3" />
      <circle cx="370" cy="200" r="50" fill="#5E72E4" />
      <text x="370" y="220" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="60" fill="white">$</text>
    </g>
  </svg>
);

export const WelcomeIllustrationSVG = ({ width = 800, height = 600, className }) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 800 600" 
    width={width} 
    height={height}
    className={className}
  >
    <rect x="0" y="0" width="800" height="600" fill="#ffffff" opacity="0.01" />
    
    <circle cx="650" cy="150" r="100" fill="#5E72E4" opacity="0.1" />
    <circle cx="150" cy="450" r="80" fill="#5E72E4" opacity="0.1" />
    
    <polyline points="100,400 200,350 300,370 400,280 500,250 600,200 700,150" 
      stroke="#5E72E4" strokeWidth="8" fill="none" strokeLinecap="round" strokeLinejoin="round" />
    
    <circle cx="100" cy="400" r="10" fill="#5E72E4" />
    <circle cx="200" cy="350" r="10" fill="#5E72E4" />
    <circle cx="300" cy="370" r="10" fill="#5E72E4" />
    <circle cx="400" cy="280" r="10" fill="#5E72E4" />
    <circle cx="500" cy="250" r="10" fill="#5E72E4" />
    <circle cx="600" cy="200" r="10" fill="#5E72E4" />
    <circle cx="700" cy="150" r="10" fill="#5E72E4" />
    
    <g transform="translate(150, 150)">
      <circle cx="0" cy="0" r="40" fill="#FFD700" />
      <circle cx="0" cy="0" r="35" fill="#FFC800" />
      <text x="0" y="15" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="35" fill="white">$</text>
    </g>
    
    <g transform="translate(620, 300)">
      <circle cx="0" cy="0" r="50" fill="#FFD700" />
      <circle cx="0" cy="0" r="45" fill="#FFC800" />
      <text x="0" y="18" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="45" fill="white">$</text>
    </g>
    
    <g transform="translate(350, 180)">
      <circle cx="0" cy="0" r="30" fill="#FFD700" />
      <circle cx="0" cy="0" r="25" fill="#FFC800" />
      <text x="0" y="10" textAnchor="middle" fontFamily="Arial" fontWeight="bold" fontSize="25" fill="white">$</text>
    </g>
    
    <g transform="translate(400, 450)">
      <circle cx="0" cy="-100" r="50" fill="#5E72E4" opacity="0.8" />
      
      <rect x="-40" y="-50" width="80" height="120" rx="20" fill="#5E72E4" opacity="0.8" />
      
      <rect x="-90" y="-30" width="50" height="20" rx="10" fill="#5E72E4" opacity="0.8" />
      <rect x="40" y="-30" width="50" height="20" rx="10" fill="#5E72E4" opacity="0.8" />
      
      <rect x="-80" y="-10" width="160" height="90" rx="5" fill="#ffffff" stroke="#5E72E4" strokeWidth="5" />
      
      <rect x="-60" y="10" width="50" height="10" rx="2" fill="#5E72E4" opacity="0.5" />
      <rect x="10" y="10" width="30" height="10" rx="2" fill="#5E72E4" opacity="0.5" />
      <rect x="-60" y="30" width="120" height="5" rx="2" fill="#5E72E4" opacity="0.3" />
      <rect x="-60" y="45" width="120" height="5" rx="2" fill="#5E72E4" opacity="0.3" />
      <rect x="-60" y="60" width="80" height="5" rx="2" fill="#5E72E4" opacity="0.3" />
    </g>
  </svg>
);

export default LogoSVG;
