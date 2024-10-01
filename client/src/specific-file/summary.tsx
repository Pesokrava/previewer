import { List, ListItem, ListItemText } from "@mui/material";
import { IJoinDataReq } from "../connectors";

export default function ExtentionSummary(props: IJoinDataReq) {
  const { apiEndpoint, column, dataKey, file, newFileName } = props;

  return (
    <List>
      <ListItem>
        <ListItemText primary="API Endpoint:" secondary={apiEndpoint} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Column:" secondary={column} />
      </ListItem>
      <ListItem>
        <ListItemText primary="Data Key:" secondary={dataKey} />
      </ListItem>
      <ListItem>
        <ListItemText primary="File:" secondary={file} />
      </ListItem>
      <ListItem>
        <ListItemText primary="New File Name:" secondary={newFileName} />
      </ListItem>
    </List>
  );
}
