import { CircularProgress, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";

import { ImageRenderer } from "../components/ImageRenderer";
import { Layout } from "../components/Layout";
import { TgxReader } from "../lib/tgx/tgx-reader";

interface ImageBundle {
  data: ImageData | null;
  name: string;
  error: string;
}

const TgxToPng: NextPage = () => {
  const [imageData, setImageData] = useState<ImageBundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState("");

  const loadFile = async (files: FileList | null) => {
    if (!files) {
      return;
    }

    setImageData([]);
    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files.item(i);
        if (!file) {
          continue;
        }

        setProcessing(file.name);

        // Convert to buffer
        const buffer = await file.arrayBuffer();

        // Convert buffer to image data
        const loader = new TgxReader();
        loader.loadFile(buffer);
        const result = loader.getImageData();

        setImageData((imgData) => [
          ...imgData,
          {
            data: result,
            name: file.name.replace("tgx", "png"),
            error: "",
          },
        ]);
      } catch (err) {
        setImageData((imgData) => [
          ...imgData,
          {
            data: null,
            name: "",
            error: (err as Error).message,
          },
        ]);
      }
    }

    setLoading(false);
    setProcessing("");
  };

  return (
    <Layout
      title="TGX to PNG Converter"
      description="Convert Stronghold/Stronghold Crusader TGX files to PNG"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">TGX to PNG Converter</Typography>
          <Typography variant="h2">
            Convert Stronghold/Stronghold Crusader TGX files to PNG
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Choose a TGX file to convert to PNG
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            accept=".tgx"
            multiple
            onChange={(event) => loadFile(event.target.files)}
            onDrop={(event) => {
              event.preventDefault();
              loadFile(event.dataTransfer.files);
            }}
          />
        </Grid>

        {loading && (
          <Grid item xs={12}>
            <Typography variant="body1">Processing {processing}...</Typography>
            <CircularProgress />
          </Grid>
        )}

        <Grid item xs={12}>
          {imageData.map((image) => (
            <Grid item xs={12} key={image.name}>
              <Typography variant="h3">{image.name}</Typography>
              <ImageRenderer image={image.data} name={image.name} />
              {image.error && (
                <Typography variant="body1">{image.error}</Typography>
              )}
              <hr />
            </Grid>
          ))}
        </Grid>
      </Grid>
    </Layout>
  );
};

export default TgxToPng;
