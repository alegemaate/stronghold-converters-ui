import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";

import { ImageRenderer } from "../components/ImageRenderer";
import { Layout } from "../components/Layout";
import { TgxReader } from "../lib/tgx-reader";

const TgxToPng: NextPage = () => {
  const [imageData, setImageData] = useState<ImageData | null>(null);
  const [fileName, setFileName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const loadFile = async (files: FileList | null) => {
    try {
      setLoading(true);
      setError("");

      const file = files?.item(0);
      if (!file) {
        return;
      }

      // Convert to buffer
      const buffer = await file.arrayBuffer();

      // Save file name
      setFileName(file.name.replace("tgx", "png"));

      // Convert buffer to image data
      const loader = new TgxReader();
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
      title="TGX to PNG Converter"
      description="Convert Stronghold Crusader TGX files to PNG"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">TGX to PNG Converter</Typography>
          <Typography variant="h2">
            Convert Stronghold Crusader TGX files to PNG
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Choose a TGX file to convert to PNG
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

export default TgxToPng;
