import { Container, styled } from "@mui/material";
import Head from "next/head";
import { ReactNode } from "react";
import { Nav } from "./Nav";

interface LayoutProps {
  title: string;
  description: string;
  children: ReactNode;
}

const Main = styled("main")(({ theme }) => ({
  minHeight: "100vh",
  flex: 1,
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  alignItems: "center",
  backgroundColor: theme.palette.grey[300],
}));

const Footer = styled("footer")(({ theme }) => ({
  display: "flex",
  height: theme.spacing(14),
  width: "100%",
  padding: theme.spacing(2),
  borderTop: "1px solid #eaeaea",
  justifyContent: "center",
  alignItems: "center",
  columnGap: theme.spacing(2),
  backgroundColor: theme.palette.background.paper,
}));

const StyledContainer = styled(Container)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  padding: theme.spacing(4),
  marginTop: theme.spacing(4),
  marginBottom: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
}));

export const Layout: React.FC<LayoutProps> = ({
  title,
  description,
  children,
}) => (
  <>
    <Head>
      <title>{`${title} - Stronghold Converters`}</title>
      <meta name="description" content={description} />
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <Main>
      <Nav />

      <StyledContainer maxWidth="md">
        <Container>{children}</Container>
      </StyledContainer>

      <Footer>
        <a
          href="https://alegemaate.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          Created by Allan Legemaate
        </a>
        <a
          href="https://github.com/alegemaate/stronghold-converters-ui"
          target="_blank"
          rel="noopener noreferrer"
          title="Github"
        >
          Github
        </a>
      </Footer>
    </Main>
  </>
);
