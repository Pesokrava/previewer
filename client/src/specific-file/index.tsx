import { Box, Divider, Tab, Tabs } from '@mui/material';
import { useState } from 'react';

import ColumnNamesContext from './context';
import CsvDataTable from './csv-table';
import ExtendForm from './extend-form';

export default function SpecificFileComponent({ file }: { file: string }) {
  const [selectedTab, setValue] = useState('preview');
  const [columnNames, setColumnNames] = useState([]);

  const handleChange = (_, newValue: string) => {
    setValue(newValue);
  };

  return (
    <ColumnNamesContext.Provider value={{ columnNames, setColumnNames }}>
      <Box
        sx={{ display: 'flex', flexDirection: 'column', width: '100%', height: '100%', bgcolor: 'background.paper' }}
      >
        <Tabs value={selectedTab} onChange={handleChange} centered>
          <Tab label="Preview" value="preview" key="preview" />
          <Tab label="Extend" value="extend" key="extend" />
        </Tabs>

        <Divider sx={{ marginTop: '8px' }} />

        {selectedTab === 'preview' && <CsvDataTable file={file} />}
        {selectedTab === 'extend' && <ExtendForm file={file} />}
      </Box>
    </ColumnNamesContext.Provider>
  );
}
