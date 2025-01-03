import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Plus, X } from 'lucide-react';
import WebsiteEditPopup from './WebsiteEditPopup';

interface MatrixViewPopupProps {
  isOpen: boolean;
  onClose: () => void;
  urlMatrix: string[][];
  updateUrlMatrix: (newMatrix: string[][]) => void;
}

const MatrixViewPopup: React.FC<MatrixViewPopupProps> = ({ isOpen, onClose, urlMatrix, updateUrlMatrix }) => {
  const [editingCell, setEditingCell] = useState<{ row: number; col: number } | null>(null);
  const [bulkUrls, setBulkUrls] = useState<string>('');

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

  const handleRemoveRow = (rowIndex: number) => {
    const newMatrix = urlMatrix.filter((_, index) => index !== rowIndex);
    updateUrlMatrix(newMatrix);
  };

  const handleRemoveColumn = (colIndex: number) => {
    const newMatrix = urlMatrix.map(row => row.filter((_, index) => index !== colIndex));
    updateUrlMatrix(newMatrix);
  };

  const processBulkUrls = () => {
    const urls = bulkUrls.split('\n').filter(url => url.trim() !== '');
    const newMatrix = [];
    const cols = Math.ceil(Math.sqrt(urls.length));
    
    for (let i = 0; i < urls.length; i += cols) {
      newMatrix.push(urls.slice(i, i + cols));
    }

    // Pad the last row with empty strings if necessary
    if (newMatrix.length > 0) {
      const lastRow = newMatrix[newMatrix.length - 1];
      while (lastRow.length < cols) {
        lastRow.push('');
      }
    }

    updateUrlMatrix(newMatrix);
    setBulkUrls('');
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
        <div className="grid gap-4" style={{ gridTemplateColumns: `repeat(${urlMatrix[0].length + 1}, 1fr)` }}>
          {urlMatrix.map((row, rowIndex) => (
            <React.Fragment key={`row-${rowIndex}`}>
              {row.map((url, colIndex) => (
                <div key={`${rowIndex}-${colIndex}`} className="relative border p-2">
                  <div className="absolute top-0 left-0 bg-gray-200 px-1 text-xs">
                    id#{rowIndex}.{colIndex}
                  </div>
                  <iframe src={url} className="w-full h-24" title={`Preview ${rowIndex}-${colIndex}`} />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="absolute bottom-0 right-0"
                    onClick={() => handleEditCell(rowIndex, colIndex)}
                  >
                    Edit
                  </Button>
                </div>
              ))}
              <Button onClick={() => handleRemoveRow(rowIndex)} className="self-center">
                <X className="h-4 w-4" />
              </Button>
            </React.Fragment>
          ))}
          {urlMatrix[0].map((_, colIndex) => (
            <Button key={`remove-col-${colIndex}`} onClick={() => handleRemoveColumn(colIndex)} className="mt-2">
              <X className="h-4 w-4" />
            </Button>
          ))}
          <Button onClick={handleAddRow} className="mt-2">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button onClick={handleAddColumn} className="mt-4">
          Add Column
        </Button>
        <div className="mt-4">
          <Input
            placeholder="Enter URLs (one per line)"
            value={bulkUrls}
            onChange={(e) => setBulkUrls(e.target.value)}
            multiple
          />
          <Button onClick={processBulkUrls} className="mt-2">
            Process Bulk URLs
          </Button>
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

