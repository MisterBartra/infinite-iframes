import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

interface WebsiteEditPopupProps {
  isOpen: boolean;
  onClose: () => void;
  currentUrl: string;
  onConfirm: (newUrl: string) => void;
}

const WebsiteEditPopup: React.FC<WebsiteEditPopupProps> = ({ isOpen, onClose, currentUrl, onConfirm }) => {
  const [url, setUrl] = useState(currentUrl);

  const handleConfirm = () => {
    onConfirm(url);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Website URL</DialogTitle>
        </DialogHeader>
        <Input
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter website URL"
        />
        <DialogFooter>
          <Button onClick={onClose} variant="outline">Cancel</Button>
          <Button onClick={handleConfirm}>Confirm</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default WebsiteEditPopup;

