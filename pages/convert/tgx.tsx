import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { Container } from "@mui/system";
import type { NextPage } from "next";
import { useState } from "react";

import { ImageRenderer } from "../../components/ImageRenderer";
import { Layout } from "../../components/Layout";
import { TGXLoader } from "../../lib/tgx-loader";

const TGXConverter: NextPage = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFile = async (files: FileList | null) => {
    try {
      setLoading(true);

      const file = files?.item(0);
      if (!file) {
        return;
      }

      // Convert to buffer
      const buffer = await file.arrayBuffer();

      // Save file name
      setFileName(file.name.replace("tgx", "png"));

      // Convert buffer to image data
      const loader = new TGXLoader();
      loader.loadFile(buffer);
      const result = loader.getImageData();

      setImageData(result);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="TGX Converter"
      description="Convert Stronghold Crusader TGX files to PNG"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">Convert TGX to PNG</Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Choose a file to convert to PNG
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <LoadingButton
            variant="contained"
            component="label"
            loading={loading}
          >
            Upload File
            <input
              type="file"
              accept=".tgx"
              onChange={(event) => loadFile(event.target.files)}
              hidden
            />
          </LoadingButton>
        </Grid>

        <Grid item xs={12}>
          <ImageRenderer image={imageData} name={fileName} />
        </Grid>

        <Grid item xs={12}>
          {error && <Typography variant="body1">{error}</Typography>}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default TGXConverter;
