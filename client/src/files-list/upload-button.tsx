import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import { Alert, Button, Dialog, DialogActions, DialogContent, DialogTitle, LinearProgress } from '@mui/material'; // Assuming Material UI
import IconButton from '@mui/material/IconButton';
import { styled } from '@mui/material/styles';
import { AxiosProgressEvent } from 'axios';
import { ChangeEvent, useState } from 'react';

import { uploadFile } from '../connectors';

const InputFile = styled('input')({
  display: 'none',
});

export default function CSVFileUploadButton({ onSuccess }: { onSuccess: (fileName: string) => void }) {
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  const [error, setError] = useState('');
  const [dialogOpen, setDialogOpen] = useState(false);

  const onUploadProgress = (progressEvent: AxiosProgressEvent) => {
    setUploadProgress(Math.round((progressEvent.loaded * 100) / progressEvent.total));
  };

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files[0];

    if (!file) {
      return;
    }

    setDialogOpen(true);
    setIsUploading(true);

    try {
      const formData = new FormData();
      formData.append('file', file);

      await uploadFile(formData, onUploadProgress);
      onSuccess(file.name.slice(0, -4).replace("-", "_"));
    } catch {
      setError('Failed to upload file');
    } finally {
      setUploadProgress(0);
      setIsUploading(false);
    }
  };

  return (
    <>
      <label htmlFor="contained-button-file">
        <InputFile accept=".csv" type="file" id="contained-button-file" onChange={handleFileChange} />
        <IconButton size="large" color="primary" aria-label="upload picture" component="span">
          <CloudUploadIcon />
        </IconButton>
      </label>

      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Uploading CSV File</DialogTitle>

        <DialogContent>
          {error && <Alert severity="error">{error}</Alert>}
          {isUploading ? (
            <LinearProgress variant="determinate" value={uploadProgress} />
          ) : (
            !error && <Alert severity="success">Upload successful</Alert>
          )}
        </DialogContent>

        {!isUploading && (
          <DialogActions>
            <Button onClick={() => setDialogOpen(false)}>Close</Button>
          </DialogActions>
        )}
      </Dialog>
    </>
  );
}
