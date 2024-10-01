import {
  Alert,
  Box,
  Button,
  Divider,
  FormControl,
  FormHelperText,
  Grid2,
  Input,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import { useContext, useState } from "react";

import ColumnNamesContext from "./context";
import ExtendDialog from "./extend-form-dialog";

function validateApiEndpoint(url: string) {
  const urlRegex =
    /^(http|https):\/\/[\w.-]+(?:\.[\w.-]+)*\/[\w._~:/?#[\]@!$&'()*+,;=%-]*$/;
  return urlRegex.test(url);
}

interface IFormInputs {
  apiEndpoint: string;
  column: string;
  dataKey: string;
  newFileName: string;
}

interface IErrors {
  apiError: string;
  keyError: string;
  newFileNameError: string;
}

export default function ExtendForm({ file }: { file: string }) {
  const { columnNames } = useContext(ColumnNamesContext);

  const [formInputs, setFormInputs] = useState<IFormInputs>({
    apiEndpoint: "",
    column: columnNames[0],
    dataKey: "",
    newFileName: "",
  });

  const [errors, setErrors] = useState<IErrors>({
    apiError: "",
    keyError: "",
    newFileNameError: "",
  });

  const [openDialog, setShowDialog] = useState(false);

  const handleSubmit = (event) => {
    event.preventDefault();
    let error = false;

    const errors = {
      apiError: "",
      keyError: "",
      newFileNameError: "",
    };

    if (!validateApiEndpoint(formInputs.apiEndpoint)) {
      error = true;
      errors.apiError = "Invalid api endpoint url!";
    }

    if (!formInputs.dataKey) {
      error = true;
      errors.keyError = "Missing key name!";
    }

    if (!formInputs.newFileName) {
      error = true;
      errors.newFileNameError = "Missing key name!";
    }

    if (error) {
      setErrors(errors);
      return;
    }

    setShowDialog(true);
  };

  const handleReset = () => {
    setFormInputs({
      apiEndpoint: "",
      column: columnNames[0],
      dataKey: "",
      newFileName: "",
    });

    setErrors({
      apiError: "",
      keyError: "",
      newFileNameError: "",
    });
  };

  return (
    <>
      <Box
        component="form"
        autoComplete="off"
        display="flex"
        flexDirection="column"
      >
        {errors.apiError && <Alert severity="error">{errors.apiError}</Alert>}

        <FormControl required sx={{ margin: "20px 10px 10px 10px" }}>
          <InputLabel htmlFor="api-input">URL</InputLabel>
          <Input
            error={!!errors.apiError}
            required
            id="api-input"
            aria-describedby="api-helper-text"
            value={formInputs.apiEndpoint}
            onChange={(event) => {
              setFormInputs({ ...formInputs, apiEndpoint: event.target.value });
              setErrors({ ...errors, apiError: "" });
            }}
          />
          <FormHelperText id="api-helper-text">
            Input an URL from which extension data will be fetched from
          </FormHelperText>
        </FormControl>

        <FormControl required sx={{ margin: "10px 10px 10px 10px" }}>
          <InputLabel htmlFor="data-key-input">Data key</InputLabel>
          <Input
            error={!!errors.keyError}
            required
            id="data-key-input"
            aria-describedby="data-key-helper-text"
            value={formInputs.dataKey}
            onChange={(event) => {
              setFormInputs({ ...formInputs, dataKey: event.target.value });
              setErrors({ ...errors, keyError: "" });
            }}
          />
          <FormHelperText id="data-key-helper-text">
            Key name which will be used for data joining
          </FormHelperText>
        </FormControl>

        <FormControl required sx={{ margin: "10px 10px 10px 10px" }}>
          <InputLabel htmlFor="new-file-name">New file name</InputLabel>
          <Input
            error={!!errors.newFileNameError}
            required
            id="new-file-name"
            aria-describedby="api-helper-text"
            value={formInputs.newFileName}
            onChange={(event) => {
              setFormInputs({
                ...formInputs,
                newFileName: event.target.value.replace(".csv", ""),
              });
              setErrors({ ...errors, newFileNameError: "" });
            }}
          />
          <FormHelperText id="api-helper-text">
            Key name which will be used for data joining
          </FormHelperText>
        </FormControl>

        <FormControl sx={{ margin: "10px" }}>
          <Select
            id="column-input"
            aria-describedby="column-helper-text"
            value={formInputs.column}
            onChange={(event) =>
              setFormInputs({ ...formInputs, column: event.target.value })
            }
            autoWidth
          >
            {columnNames.map((name) => (
              <MenuItem key={name} value={name}>
                {name}
              </MenuItem>
            ))}
          </Select>
          <FormHelperText id="column-helper-text">
            Column name which will be used for data joining
          </FormHelperText>
        </FormControl>

        <Divider />

        <Grid2
          display="flex"
          flexDirection="row"
          spacing={5}
          marginTop="10px"
          justifyContent="flex-end"
        >
          <Button
            type="submit"
            variant="contained"
            color="primary"
            onClick={handleSubmit}
          >
            Submit
          </Button>
          <Button
            type="button"
            onClick={handleReset}
            variant="contained"
            color="error"
          >
            Reset
          </Button>
        </Grid2>
      </Box>

      <ExtendDialog
        reqBody={{ ...formInputs, file }}
        open={openDialog}
        closeDialog={() => setShowDialog(false)}
      />
    </>
  );
}
