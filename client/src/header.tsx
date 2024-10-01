import TableChartIcon from "@mui/icons-material/TableChart";
import { AppBar, Box, Toolbar, Typography } from "@mui/material";

export default function Header() {
  return (
    <Box sx={{ flexGrow: 1, borderRadius: "10px" }} borderRadius="10px">
      <AppBar position="sticky">
        <Toolbar>
          <TableChartIcon />
          <Typography
            variant="h6"
            component="div"
            sx={{ flexGrow: 1, marginLeft: 2 }}
          >
            CSV Previewer
          </Typography>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
