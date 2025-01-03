import React, { useState, useEffect, useCallback, useRef } from 'react';
import { ChevronLeft, ChevronRight, ChevronUp, ChevronDown, Eye, EyeOff, Save, Upload, Grid, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useToast } from "@/hooks/use-toast"
import MatrixViewPopup from './MatrixViewPopup';

interface NavigationButtonsProps {
  matrixSize: { width: number; height: number };
  currentPosition: { x: number; y: number };
  updatePosition: (x: number, y: number) => void;
  urlMatrix: string[][];
  setUrlMatrix: (matrix: string[][]) => void;
  buttonsVisible: boolean;
  setButtonsVisible: (visible: boolean) => void;
}

type ButtonPosition = {
  x: number | string;
  y: number | string;
};

type ButtonPositions = {
  [key: string]: ButtonPosition;
};

const NavigationButtons: React.FC<NavigationButtonsProps> = ({
  matrixSize,
  currentPosition,
  updatePosition,
  urlMatrix,
  setUrlMatrix,
  buttonsVisible,
  setButtonsVisible,
}) => {
  const [buttonPositions, setButtonPositions] = useState<ButtonPositions>({
    left: { x: 30, y: '50%' },
    right: { x: 'calc(100% - 70px)', y: '50%' },
    up: { x: '50%', y: 30 },
    down: { x: '50%', y: 'calc(100% - 70px)' },
    toggle: { x: 'calc(100% - 70px)', y: 'calc(100% - 70px)' },
    matrixView: { x: 30, y: 30 },
    settings: { x: 30, y: 'calc(100% - 70px)' },
    save: { x: 80, y: 'calc(100% - 70px)' },
    load: { x: 130, y: 'calc(100% - 70px)' },
  });
  const { toast } = useToast()
  const [matrixViewOpen, setMatrixViewOpen] = useState(false);
  const [settingsVisible, setSettingsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const move = useCallback((dx: number, dy: number) => {
    const newX = (currentPosition.x + dx + matrixSize.width) % matrixSize.width;
    const newY = (currentPosition.y + dy + matrixSize.height) % matrixSize.height;
    updatePosition(newX, newY);
  }, [currentPosition, matrixSize, updatePosition]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'ArrowLeft': move(-1, 0); break;
        case 'ArrowRight': move(1, 0); break;
        case 'ArrowUp': move(0, -1); break;
        case 'ArrowDown': move(0, 1); break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [move]);

  useEffect(() => {
    if (buttonsVisible) {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
      timeoutRef.current = setTimeout(() => {
        setButtonPositions(prev => ({
          ...prev,
          left: { ...prev.left, x: -40 },
          right: { ...prev.right, x: 'calc(100% + 40px)' },
          up: { ...prev.up, y: -40 },
          down: { ...prev.down, y: 'calc(100% + 40px)' },
          toggle: { ...prev.toggle, x: 'calc(100% + 40px)', y: 'calc(100% + 40px)' },
          matrixView: { ...prev.matrixView, x: -40, y: -40 },
          settings: { ...prev.settings, x: -40, y: 'calc(100% + 40px)' },
          save: { ...prev.save, x: -40, y: 'calc(100% + 40px)' },
          load: { ...prev.load, x: -40, y: 'calc(100% + 40px)' },
        }));
        setButtonsVisible(false);
      }, 5000);
    }
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [buttonsVisible, setButtonsVisible]);

  const handleMouseEnter = (position: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight' | 'left' | 'right' | 'top' | 'bottom') => {
    setButtonsVisible(true);
    setButtonPositions(prev => {
      const newPositions = { ...prev };
      switch (position) {
        case 'topLeft':
          newPositions.matrixView = { x: 30, y: 30 };
          newPositions.up = { ...prev.up, y: 30 };
          newPositions.left = { ...prev.left, x: 30 };
          break;
        case 'topRight':
          newPositions.up = { ...prev.up, y: 30 };
          newPositions.right = { ...prev.right, x: 'calc(100% - 70px)' };
          break;
        case 'bottomLeft':
          newPositions.left = { ...prev.left, x: 30 };
          newPositions.down = { ...prev.down, y: 'calc(100% - 70px)' };
          newPositions.settings = { x: 30, y: 'calc(100% - 70px)' };
          newPositions.save = { x: 80, y: 'calc(100% - 70px)' };
          newPositions.load = { x: 130, y: 'calc(100% - 70px)' };
          break;
        case 'bottomRight':
          newPositions.right = { ...prev.right, x: 'calc(100% - 70px)' };
          newPositions.down = { ...prev.down, y: 'calc(100% - 70px)' };
          newPositions.toggle = { x: 'calc(100% - 70px)', y: 'calc(100% - 70px)' };
          break;
        case 'left':
          newPositions.left = { ...prev.left, x: 30 };
          break;
        case 'right':
          newPositions.right = { ...prev.right, x: 'calc(100% - 70px)' };
          break;
        case 'top':
          newPositions.up = { ...prev.up, y: 30 };
          break;
        case 'bottom':
          newPositions.down = { ...prev.down, y: 'calc(100% - 70px)' };
          break;
      }
      return newPositions;
    });
  };

  const saveMatrix = () => {
    localStorage.setItem('urlMatrix', JSON.stringify(urlMatrix));
    toast({
      title: "Matrix Saved",
      description: "Your URL matrix has been saved to local storage.",
    })
  };

  const loadMatrix = () => {
    const savedMatrix = localStorage.getItem('urlMatrix');
    if (savedMatrix) {
      setUrlMatrix(JSON.parse(savedMatrix));
      toast({
        title: "Matrix Loaded",
        description: "Your URL matrix has been loaded from local storage.",
      })
    } else {
      toast({
        title: "No Saved Matrix",
        description: "There is no saved URL matrix in local storage.",
        variant: "destructive",
      })
    }
  };

  const toggleSettings = () => {
    setSettingsVisible(!settingsVisible);
    if (!settingsVisible) {
      setButtonPositions(prev => ({
        ...prev,
        save: { x: 80, y: 'calc(100% - 70px)' },
        load: { x: 130, y: 'calc(100% - 70px)' },
      }));
    } else {
      setButtonPositions(prev => ({
        ...prev,
        save: { x: -40, y: 'calc(100% + 40px)' },
        load: { x: -40, y: 'calc(100% + 40px)' },
      }));
    }
  };

  const renderButton = (key: string, icon: React.ReactNode, onClick: () => void, tooltip: string) => (
    <Button
      className={`nav-button ${key}`}
      onClick={onClick}
      variant="outline"
      size="icon"
      style={{
        position: 'fixed',
        left: buttonPositions[key].x,
        top: buttonPositions[key].y,
        transform: key === 'left' || key === 'right' ? 'translateY(-50%)' : 
                   key === 'up' || key === 'down' ? 'translateX(-50%)' : 'none',
        transition: 'all 0.5s ease-in-out',
        opacity: buttonsVisible ? 1 : 0,
        pointerEvents: buttonsVisible ? 'auto' : 'none',
      }}
      title={tooltip}
      onMouseEnter={() => {
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
      }}
      onMouseLeave={() => {
        timeoutRef.current = setTimeout(() => setButtonsVisible(false), 5000);
      }}
    >
      {icon}
    </Button>
  );

  return (
    <>
      {matrixSize.width > 1 && (
        <>
          {renderButton('left', <ChevronLeft className="h-4 w-4" />, () => move(-1, 0), "Move Left")}
          {renderButton('right', <ChevronRight className="h-4 w-4" />, () => move(1, 0), "Move Right")}
        </>
      )}
      {matrixSize.height > 1 && (
        <>
          {renderButton('up', <ChevronUp className="h-4 w-4" />, () => move(0, -1), "Move Up")}
          {renderButton('down', <ChevronDown className="h-4 w-4" />, () => move(0, 1), "Move Down")}
        </>
      )}
      {renderButton('toggle', buttonsVisible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />, () => setButtonsVisible(!buttonsVisible), "Toggle Buttons")}
      {renderButton('matrixView', <Grid className="h-4 w-4" />, () => setMatrixViewOpen(true), "Matrix View")}
      {renderButton('settings', <Settings className="h-4 w-4" />, toggleSettings, "Settings")}
      {settingsVisible && (
        <>
          {renderButton('save', <Save className="h-4 w-4" />, saveMatrix, "Save Matrix")}
          {renderButton('load', <Upload className="h-4 w-4" />, loadMatrix, "Load Matrix")}
        </>
      )}
      <MatrixViewPopup
        isOpen={matrixViewOpen}
        onClose={() => setMatrixViewOpen(false)}
        urlMatrix={urlMatrix}
        updateUrlMatrix={setUrlMatrix}
      />
    </>
  );
};

export default NavigationButtons;

