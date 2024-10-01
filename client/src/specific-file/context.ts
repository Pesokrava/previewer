import { createContext } from 'react';

interface IColumnNamesContext {
  columnNames: string[];
  setColumnNames: (names: string[]) => void;
}

const ColumnNamesContext = createContext<IColumnNamesContext>({ columnNames: [], setColumnNames: () => {} });
export default ColumnNamesContext;
