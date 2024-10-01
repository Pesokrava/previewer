import {
  Alert,
  Box,
  Divider,
  LinearProgress,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TablePagination,
  TableRow,
} from "@mui/material";
import React, { useContext, useEffect, useState } from "react";

import { fetchFile } from "../connectors";
import ColumnNamesContext from "./context";

type CSVDataTypes =
  | string
  | number
  | boolean
  | Array<string>
  | Array<number>
  | null
  | undefined;
type Rows = { index: number; [key: string]: CSVDataTypes }[];

function CsvDataTable({ file }: { file: string }) {
  const [rows, setData] = useState<Rows>([]);
  const [isLoading, setLoading] = useState(true);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [error, setError] = useState("");
  const [page, setPage] = useState(0);
  const [totalRows, setTotalRows] = useState(0);
  const { setColumnNames } = useContext(ColumnNamesContext);

  useEffect(() => {
    const fetchData = async () => {
      setError("");
      setLoading(true);
      try {
        const data = await fetchFile(file, rowsPerPage, page * rowsPerPage);
        setData(data.rows);

        setTotalRows(data.totalRows);
        if (data.rows.length) {
          setColumnNames(Object.keys(data.rows[0]));
        }
      } catch {
        setError("Failed to fetch file");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [file, rowsPerPage, page, setColumnNames]);

  const handleChangePage = (_, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (isLoading) {
    return (
      <Box margin="5px">
        <LinearProgress></LinearProgress>;
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  if (!rows.length) {
    return <p>Empty</p>;
  }

  return (
    <Box overflow="auto" height="100%" width="100%">
      <Divider />

      <TableContainer component={Box} sx={{ overflow: "initial" }}>
        <Table stickyHeader sx={{ minWidth: 650 }} aria-label="sticky table">
          <TableHead>
            <TableRow key="header">
              {Object.keys(rows[0])
                .slice(1)
                .map((columnName) => (
                  <TableCell
                    key={columnName}
                    sx={{ borderBottom: "1px solid", fontWeight: "bold" }}
                  >
                    {columnName}
                  </TableCell>
                ))}
            </TableRow>
          </TableHead>

          <TableBody>
            {rows.map((row) => (
              <TableRow key={row.index}>
                {Object.values(row)
                  .slice(1)
                  .map((value, index) => (
                    <TableCell key={index}>{value || "null"}</TableCell>
                  ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <TablePagination
        rowsPerPageOptions={[5, 10, 25]}
        component="div"
        count={totalRows}
        rowsPerPage={rowsPerPage}
        page={page}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
        showFirstButton
        showLastButton
        sx={{
          position: "sticky",
          left: 0,
          bottom: 0,
          backgroundColor: "white",
          borderTop: "1px solid",
        }}
      />
    </Box>
  );
}

export default CsvDataTable;
