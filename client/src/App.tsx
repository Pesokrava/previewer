import { FindInPage } from '@mui/icons-material';
import { Box, Divider, Grid2, Stack, Typography } from '@mui/material';
import { useState } from 'react';

import FileList from './files-list';
import Header from './header';
import SpecificFileComponent from './specific-file';

export default function App() {
  const [selectedFile, setFile] = useState<string | null>(null);

  return (
    <Box sx={{ width: '100%', height: '90%' }}>
      <header>
        <Header></Header>
      </header>

      <Grid2
        display="flex"
        padding="2px"
        margin="5px"
        flexDirection="row"
        flexGrow={1}
        spacing={2}
        height="100%"
        border="1px solid"
        borderRadius="10px"
      >
        <Grid2 size={10} minWidth="300px" flexShrink={0} flexGrow={0}>
          <FileList selectedFile={selectedFile} selectFile={setFile} />
        </Grid2>

        <Divider orientation="vertical" />

        <Grid2 size={20} display="flex" flexGrow="1" justifyContent="center" alignItems="center">
          {selectedFile !== null ? (
            <SpecificFileComponent file={selectedFile} />
          ) : (
            <Box>
              <Stack alignItems="center" direction="row" gap={2}>
                <FindInPage />
                <Typography variant="body1">Select or upload csv file</Typography>
              </Stack>
            </Box>
          )}
        </Grid2>
      </Grid2>
    </Box>
  );
}
