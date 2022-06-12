import { Typography, Link as MUILink } from "@mui/material";
import type { NextPage } from "next";
import Link from "next/link";

import { Layout } from "../../components/Layout";

const Home: NextPage = () => {
  return (
    <Layout title="Converters" description="File Conversion">
      <Typography variant="h1">Converters</Typography>
      <Typography variant="h2">A.D.S. Games</Typography>
      <Link href="convert/tgx" passHref>
        <MUILink variant="body2">TGX Converter</MUILink>
      </Link>
    </Layout>
  );
};

export default Home;
