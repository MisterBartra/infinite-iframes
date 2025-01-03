import React, { useState, useEffect } from 'react';
import LoadingIndicator from './LoadingIndicator';

interface IframeContainerProps {
  urlMatrix: string[][];
  currentPosition: { x: number; y: number };
}

const IframeContainer: React.FC<IframeContainerProps> = ({ urlMatrix, currentPosition }) => {
  const [loadingStates, setLoadingStates] = useState<boolean[][]>([]);

  useEffect(() => {
    // Initialize loading states when urlMatrix changes
    if (Array.isArray(urlMatrix) && urlMatrix.every(Array.isArray)) {
      setLoadingStates(urlMatrix.map(row => row.map(() => true)));
    } else {
      console.error('Invalid urlMatrix structure:', urlMatrix);
      setLoadingStates([]);
    }
  }, [urlMatrix]);

  const handleIframeLoad = (rowIndex: number, colIndex: number) => {
    setLoadingStates(prev => {
      const newStates = [...prev];
      if (newStates[rowIndex]) {
        newStates[rowIndex][colIndex] = false;
      }
      return newStates;
    });
  };

  if (!Array.isArray(urlMatrix) || !urlMatrix.every(Array.isArray)) {
    return <div>Error: Invalid URL matrix structure</div>;
  }

  return (
    <div
      className="iframe-container"
      style={{
        transform: `translate(${-currentPosition.x * 100}vw, ${-currentPosition.y * 100}vh)`,
        width: `${urlMatrix[0].length * 100}vw`,
        height: `${urlMatrix.length * 100}vh`,
      }}
    >
      {urlMatrix.map((row, rowIndex) =>
        row.map((url, colIndex) => (
          <div key={`iframe-wrapper-${rowIndex}-${colIndex}`} className="iframe-wrapper">
            {loadingStates[rowIndex]?.[colIndex] && <LoadingIndicator />}
            <iframe
              title={`RowFrameCol#${rowIndex}-${colIndex}`}
              src={url || 'about:blank'}
              frameBorder="0"
              scrolling="yes"
              onLoad={() => handleIframeLoad(rowIndex, colIndex)}
              style={{ opacity: loadingStates[rowIndex]?.[colIndex] ? 0 : 1 }}
            />
          </div>
        ))
      )}
    </div>
  );
};

export default IframeContainer;

