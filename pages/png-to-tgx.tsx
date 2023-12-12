import { CircularProgress, Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";

import { FileDownload } from "../components/FileDownload";
import { Layout } from "../components/Layout";
import { fileToImageData } from "../lib/convert";
import { TgxWriter } from "../lib/tgx/tgx-writer";

interface ImageBundle {
  data: ArrayBuffer;
  name: string;
  error: string;
}

const PngToTgx: NextPage = () => {
  const [fileData, setFileData] = useState<ImageBundle[]>([]);
  const [loading, setLoading] = useState(false);
  const [processing, setProcessing] = useState("");

  const loadFile = async (files: FileList | null) => {
    if (!files) {
      return;
    }

    setFileData([]);
    setLoading(true);

    for (let i = 0; i < files.length; i++) {
      try {
        const file = files.item(i);
        if (!file) {
          continue;
        }

        setProcessing(file.name);

        const imageData = await fileToImageData(file);

        // Convert image data to file
        const loader = new TgxWriter();
        loader.loadImageData(imageData);
        const result = loader.getFileBuffer();

        setFileData((fd) => [
          ...fd,
          {
            data: result,
            name: file.name.replace("png", "tgx"),
            error: "",
          },
        ]);
      } catch (err) {
        setFileData((fd) => [
          ...fd,
          {
            data: new ArrayBuffer(0),
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
      title="PNG to TGX Converter"
      description="Convert PNG files to Stronghold/Stronghold Crusader TGX"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">PNG to TGX Converter</Typography>
          <Typography variant="h2">
            Convert PNG files to Stronghold/Stronghold Crusader TGX
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Choose a file to convert to TGX
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <input
            type="file"
            accept=".png"
            onChange={(event) => loadFile(event.target.files)}
            multiple
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
          {fileData.map((image) => (
            <Grid item xs={12} key={image.name}>
              <Typography variant="h3">{image.name}</Typography>
              <FileDownload fileData={image.data} name={image.name} />
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

export default PngToTgx;
