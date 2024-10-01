import RefreshIcon from '@mui/icons-material/Refresh';
import TableChartIcon from '@mui/icons-material/TableChart';
import {
  Alert,
  Box,
  Divider,
  Grid2,
  IconButton,
  LinearProgress,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';

import { fetchFiles, ICSVFiles } from '../connectors';
import DeleteButton from './delete-button';
import CSVFileUploadButton from './upload-button';

export interface ISelectFile {
  selectedFile: string | null;
  selectFile: (file: string | null) => void;
}

export default function FileList({ selectedFile, selectFile }: ISelectFile) {
  const [items, setItems] = useState<ICSVFiles[]>([]);
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const [error, setError] = useState('');

  const fetchData = async () => {
    try {
      const data = await fetchFiles();
      setItems(data);
    } catch {
      setError('Failed to fetch files from server');
    } finally {
      setIsLoading(false); // Set loading state to false regardless of success or failure
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = () => {
    setIsLoading(true);
    setError('');
    fetchData();
  };

  const onFileDeleted = (file: string) => {
    setItems(items.filter(item => item.fileName !== file));
    selectFile(null);
  };

  const onUploadSuccess = (newFile: string) => {
    setItems([...items, { fileName: newFile }]);
  };

  return (
    <Grid2 spacing={2} width="360px" justifyContent="center">
      <Grid2 marginBottom="4px" display="flex" flexDirection="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" padding="10px" sx={{ justifyContent: 'center' }}>
          Uploaded files{' '}
        </Typography>

        <Stack alignItems="center" direction="row">
          <IconButton onClick={onRefresh}>
            <RefreshIcon />
          </IconButton>
          <CSVFileUploadButton onSuccess={onUploadSuccess} />
        </Stack>
      </Grid2>

      <Divider />

      <Box sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
        {isLoading ? (
          <Box margin="5px">
            <LinearProgress></LinearProgress>;
          </Box>
        ) : error ? (
          <Alert severity="error">{error}</Alert>
        ) : !items.length ? (
          <Alert severity="info">No files uploaded</Alert>
        ) : (
          <nav>
            <List>
              {items.map(file => (
                <ListItemButton
                  key={file.fileName}
                  selected={selectedFile === file.fileName}
                  onClick={e => {
                    selectFile(file.fileName);
                    e.stopPropagation();
                  }}
                >
                  <ListItemIcon>
                    <TableChartIcon sx={{ color: 'green' }} />
                  </ListItemIcon>

                  <ListItemText
                    sx={{ overflow: 'hidden', textOverflow: 'ellipsis' }}
                    primary={`${file.fileName}.csv`}
                  />
                  <DeleteButton selectedFile={file.fileName} onDelete={onFileDeleted} />
                </ListItemButton>
              ))}
            </List>
          </nav>
        )}
      </Box>
    </Grid2>
  );
}
