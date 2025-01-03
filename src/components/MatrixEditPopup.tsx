import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Plus } from 'lucide-react';
import WebsiteEditPopup from './WebsiteEditPopup';

interface MatrixViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  urlMatrix: string[][];
  updateUrlMatrix: (newMatrix: string[][]) => void;
}

const MatrixViewPopup: React.FC<MatrixViewPopupProps> = ({ isOpen, onClose, urlMatrix, updateUrlMatrix }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);

  const handleAddRow = () => {
    updateUrlMatrix([...urlMatrix, new Array(urlMatrix[0]?.length || 0).fill('')]);
  };

  const handleAddColumn = () => {
    updateUrlMatrix(urlMatrix.map(row => [...row, '']));
  };

  const handleEditCell = (row: number, col: number) => {
    setEditingCell({ row, col });
  };

  const handleUpdateCell = (newUrl: string) => {
    if (editingCell) {
      const newMatrix = urlMatrix.map((row, rowIndex) =>
        row.map((cell, colIndex) =>
          rowIndex === editingCell.row && colIndex === editingCell.col ? newUrl : cell
        )
      );
      updateUrlMatrix(newMatrix);
      setEditingCell(null);
    }
  };

  if (!urlMatrix || urlMatrix.length === 0 || urlMatrix[0].length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Matrix View</DialogTitle>
          </DialogHeader>
          <p>No matrix data available.</p>
          <Button onClick={handleAddRow}>Add Row</Button>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[80vw]">
        <DialogHeader>
          <DialogTitle>Matrix View</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${urlMatrix[0].length}, 1fr)` }}>
          {urlMatrix.map((row, rowIndex) =>
            row.map((url, colIndex) => (
              <div key={`${rowIndex}-${colIndex}`} className="relative border p-2">
                <iframe src={url} className="w-full h-24" title={`Preview ${rowIndex}-${colIndex}`} />
                <Button
                  size="sm"
                  variant="ghost"
                  className="absolute top-0 left-0"
                  onClick={() => handleEditCell(rowIndex, colIndex)}
                >
                  ▲
                </Button>
              </div>
            ))
          )}
          {urlMatrix[0].map((_, colIndex) => (
            <Button key={`add-row-${colIndex}`} onClick={handleAddRow} className="mt-2">
              <Plus className="h-4 w-4" />
            </Button>
          ))}
          {urlMatrix.map((_, rowIndex) => (
            <Button key={`add-col-${rowIndex}`} onClick={handleAddColumn} className="ml-2">
              <Plus className="h-4 w-4" />
            </Button>
          ))}
        </div>
      </DialogContent>
      {editingCell && (
        <WebsiteEditPopup
          isOpen={true}
          onClose={() => setEditingCell(null)}
          currentUrl={urlMatrix[editingCell.row][editingCell.col]}
          onConfirm={handleUpdateCell}
        />
      )}
    </Dialog>
  );
};

export default MatrixViewPopup;

