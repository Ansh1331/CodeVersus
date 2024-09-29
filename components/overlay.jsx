import React from 'react';

const CodeEditorOverlay = ({ width = 600, height = 375 }) => {
  // Calculate scale factor based on new dimensions
  const scaleFactor = Math.min(width / 600, height / 375);

  return (
    <div style={{
      width: `${width}px`,
      height: `${height}px`,
      perspective: '1500px',
      transformStyle: 'preserve-3d',
    }}>
      <svg 
        width={width} 
        height={height} 
        viewBox="0 0 600 375" 
        fill="none" 
        xmlns="http://www.w3.org/2000/svg"
        style={{
          transform: `rotateY(-20deg) rotateX(10deg) scale(${scaleFactor})`,
          boxShadow: '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
        }}
      >
        <rect width="600" height="375" rx="15" fill="#1E1E1E" fillOpacity="0.97"/>
        <rect x="20" y="20" width="560" height="45" rx="8" fill="#2D2D2D"/>
        <circle cx="50" cy="42.5" r="9" fill="#FF5F56"/>
        <circle cx="85" cy="42.5" r="9" fill="#FFBD2E"/>
        <circle cx="120" cy="42.5" r="9" fill="#27C93F"/>
        <rect x="35" y="90" width="240" height="20" rx="3" fill="#DEA03C"/>
        <rect x="35" y="125" width="420" height="20" rx="3" fill="#FFFFFF" fillOpacity="0.7"/>
        <rect x="35" y="160" width="360" height="20" rx="3" fill="#FFFFFF" fillOpacity="0.7"/>
        <rect x="35" y="195" width="450" height="20" rx="3" fill="#FFFFFF" fillOpacity="0.7"/>
        <rect x="35" y="230" width="300" height="20" rx="3" fill="#DEA03C"/>
        <rect x="35" y="265" width="390" height="20" rx="3" fill="#FFFFFF" fillOpacity="0.7"/>
        <rect x="35" y="300" width="270" height="20" rx="3" fill="#FFFFFF" fillOpacity="0.7"/>
      </svg>
    </div>
  );
};

export default CodeEditorOverlay;