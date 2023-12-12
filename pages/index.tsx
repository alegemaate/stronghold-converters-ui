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
            Stronghold TGX File Converters. Convert TGX files to PNG and PNG
            files to TGX Online.
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Link href="/tgx-to-png">TGX to PNG Converter</Link>
        </Grid>

        <Grid item xs={12}>
          <Link href="/png-to-tgx">PNG to TGX Converter</Link>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            <a
              href="https://github.com/alegemaate/stronghold-converters-ui"
              title="Github Repo"
            >
              Github Repo
            </a>
          </Typography>
        </Grid>
      </Grid>
    </Layout>
  );
};

export default Home;
