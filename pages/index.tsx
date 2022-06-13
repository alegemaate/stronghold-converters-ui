import { Typography, Link as MUILink, Grid } from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";

import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout title="Home" description="Collection of web based tools">
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Stronghold Converters</Typography>
          <Typography variant="body1">
            Stronghold Crusader File Converters
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Link href="/tgx-to-png" passHref>
            <MUILink variant="body2">TGX to PNG Converter</MUILink>
          </Link>
        </Grid>

        <Grid item xs={12}>
          <Link href="/png-to-tgx" passHref>
            <MUILink variant="body2">PNG to TGX Converter</MUILink>
          </Link>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
