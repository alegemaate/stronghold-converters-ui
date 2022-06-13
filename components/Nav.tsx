import { AppBar, Typography } from "@mui/material";
import Link from "next/link";

export const Nav = () => (
  <AppBar
    position="static"
    sx={{
      padding: 2,
    }}
  >
    <Link href="/" passHref>
      <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
        Stronghold Crusader File Converters
      </Typography>
    </Link>
  </AppBar>
);
