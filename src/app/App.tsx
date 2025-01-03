"use client"
import React, { useState, useEffect } from 'react';
import IframeContainer from '../components/IframeContainer';
import NavigationButtons from '../components/NavigationButtons';
import CornerDetectors from '../components/CornerDetectors';
import { parseUrlParams } from '../utils/urlUtils';
import { Toaster } from "@/components/ui/toaster"
import { useToast } from "@/hooks/use-toast"
import './App.css';

const DEFAULT_MATRIX = [["https://example.com", "https://example.org"], ["https://example.net", "https://example.edu"]];

const App: React.FC = () => {
  const [urlMatrix, setUrlMatrix] = useState<string[][]>(DEFAULT_MATRIX);
  const [currentPosition, setCurrentPosition] = useState({ x: 0, y: 0 });
  const [buttonsVisible, setButtonsVisible] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    const loadInitialMatrix = async () => {
      try {
        const params = parseUrlParams();
        if (params.urlRowIframes) {
          setUrlMatrix(params.urlRowIframes);
        } else {
          const response = await fetch('/initial-matrix.json');
          if (!response.ok) {
            throw new Error('Failed to load initial matrix');
          }
          const text = await response.text();
          try {
            const initialMatrix = JSON.parse(text);
            if (Array.isArray(initialMatrix) && initialMatrix.every(Array.isArray)) {
              setUrlMatrix(initialMatrix);
            } else {
              throw new Error('Invalid matrix structure in JSON');
            }
          } catch (jsonError) {
            console.error('Error parsing JSON:', jsonError);
            throw new Error('Invalid JSON in initial matrix file');
          }
        }
      } catch (err) {
        console.error('Error loading initial matrix:', err);
        
        toast({
          title: "Error",
          description: `Failed to load initial matrix: ${err}. Using default.`,
          variant: "destructive",
        });
        // Fallback to default matrix
        setUrlMatrix(DEFAULT_MATRIX);
      }
    };

    loadInitialMatrix();
  }, [toast]);

  const updatePosition = (x: number, y: number) => {
    setCurrentPosition({ x, y });
  };

  const handleCornerDetection = (position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'top' | 'bottom') => {
    setButtonsVisible(true);
  };

  return (
    <div className="app">
      <IframeContainer urlMatrix={urlMatrix} currentPosition={currentPosition} />
      <NavigationButtons
        matrixSize={{ width: urlMatrix[0].length, height: urlMatrix.length }}
        currentPosition={currentPosition}
        updatePosition={updatePosition}
        urlMatrix={urlMatrix}
        setUrlMatrix={setUrlMatrix}
        buttonsVisible={buttonsVisible}
        setButtonsVisible={setButtonsVisible}
      />
      <CornerDetectors onMouseEnter={handleCornerDetection} />
      <Toaster />
    </div>
  );
};

export default App;

