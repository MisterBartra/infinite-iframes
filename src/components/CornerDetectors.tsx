import React from 'react';

interface CornerDetectorsProps {
  onMouseEnter: (position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'top' | 'bottom') => void;
}

const CornerDetectors: React.FC<CornerDetectorsProps> = ({ onMouseEnter }) => {
  const detectorStyle: React.CSSProperties = {
    position: 'fixed',
    zIndex: 1000,
    background: 'rgba(255, 0, 0, 0.1)', // Slightly visible red for debugging
  };

  const cornerSize = 100;
  const edgeThickness = 20;

  return (
    <>
      {/* Corner detectors */}
      <div
        style={{ ...detectorStyle, top: 0, left: 0, width: cornerSize, height: cornerSize }}
        onMouseEnter={() => onMouseEnter('topLeft')}
      />
      <div
        style={{ ...detectorStyle, top: 0, right: 0, width: cornerSize, height: cornerSize }}
        onMouseEnter={() => onMouseEnter('topRight')}
      />
      <div
        style={{ ...detectorStyle, bottom: 0, left: 0, width: cornerSize, height: cornerSize }}
        onMouseEnter={() => onMouseEnter('bottomLeft')}
      />
      <div
        style={{ ...detectorStyle, bottom: 0, right: 0, width: cornerSize, height: cornerSize }}
        onMouseEnter={() => onMouseEnter('bottomRight')}
      />

      {/* Edge detectors */}
      <div
        style={{ ...detectorStyle, top: cornerSize, left: 0, width: edgeThickness, height: `calc(100% - ${2 * cornerSize}px)` }}
        onMouseEnter={() => onMouseEnter('left')}
      />
      <div
        style={{ ...detectorStyle, top: cornerSize, right: 0, width: edgeThickness, height: `calc(100% - ${2 * cornerSize}px)` }}
        onMouseEnter={() => onMouseEnter('right')}
      />
      <div
        style={{ ...detectorStyle, top: 0, left: cornerSize, width: `calc(100% - ${2 * cornerSize}px)`, height: edgeThickness }}
        onMouseEnter={() => onMouseEnter('top')}
      />
      <div
        style={{ ...detectorStyle, bottom: 0, left: cornerSize, width: `calc(100% - ${2 * cornerSize}px)`, height: edgeThickness }}
        onMouseEnter={() => onMouseEnter('bottom')}
      />
    </>
  );
};

export default CornerDetectors;

