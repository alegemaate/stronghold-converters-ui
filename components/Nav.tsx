import { AppBar, Typography } from "@mui/material";
import Link from "next/link";

export const Nav = () => (
  <AppBar
    position="static"
    sx={{
      padding: 2,
    }}
  >
    <Link href="/">
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Stronghold File Converters
      </Typography>
    </Link>
  </AppBar>
);
