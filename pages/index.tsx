import { Typography, Link as MUILink } from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";

import { Layout } from "../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout title="Web Tools" description="Collection of web based tools">
      <Typography variant="h1">Web Tools</Typography>
      <Typography variant="h2">A.D.S. Games</Typography>
      <Link href="convert/tgx-to-png" passHref>
        <MUILink variant="body2">TGX Converter</MUILink>
      </Link>
    </Layout>
  );
};

export default Home;
