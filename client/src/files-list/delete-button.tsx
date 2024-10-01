import DeleteIcon from "@mui/icons-material/Delete";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import { useState } from "react";

import { deleteFile } from "../connectors";

export default function DeleteButton({ selectedFile, onDelete }) {
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [error, setError] = useState("");

  const handleDelete = async () => {
    if (onDelete) {
      try {
        await deleteFile(selectedFile);
        onDelete(selectedFile);
      } catch {
        setError(`Failed to delete ${selectedFile}.csv`);
      }
    }
  };

  return (
    <>
      <IconButton
        onClick={(e) => {
          setIsDeleteDialogOpen(true);
          e.stopPropagation();
        }}
      >
        <DeleteIcon />
      </IconButton>
      <Dialog
        open={isDeleteDialogOpen}
        onClose={() => setIsDeleteDialogOpen(false)}
      >
        <DialogTitle>Delete File</DialogTitle>

        <DialogContent>
          {error ? (
            <Alert severity="error">{error}</Alert>
          ) : (
            <Alert severity="warning">{`Are you sure you want to delete file "${selectedFile}.csv"?`}</Alert>
          )}
        </DialogContent>

        <DialogActions>
          <Button variant="contained" color="error" onClick={handleDelete}>
            Delete
          </Button>
          <Button onClick={() => setIsDeleteDialogOpen(false)}>Cancel</Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
