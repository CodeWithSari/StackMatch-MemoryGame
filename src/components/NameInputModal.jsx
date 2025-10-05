import React, { useState } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from "@mui/material";

function NameInputModal({ open, onClose, onSave }) {
  const [playerName, setPlayerName] = useState("");

  const handleSave = () => {
    if (playerName.trim()) {
      onSave(playerName);
      setPlayerName("");
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>🎉 New High Score!</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin="dense"
          label="Enter your name"
          fullWidth
          value={playerName}
          onChange={(e) => setPlayerName(e.target.value)}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">Cancel</Button>
        <Button onClick={handleSave} variant="contained" color="primary">Save</Button>
      </DialogActions>
    </Dialog>
  );
}

export default NameInputModal;
