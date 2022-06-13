import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import type { NextPage } from "next";
import { useState } from "react";
import { FileDownload } from "../../components/FileDownload";

import { Layout } from "../../components/Layout";
import { fileToImageData } from "../../lib/convert";
import { TgxWriter } from "../../lib/tgx-writer";

const PngToTgx: NextPage = () => {
  const [fileData, setFileData] = useState<ArrayBuffer | null>(null);
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

      const imageData = await fileToImageData(file);

      // Convert image data to file
      const loader = new TgxWriter();
      loader.loadImageData(imageData);
      const result = loader.getFileBuffer();
      setFileData(result);

      // Save file name
      setFileName(file.name.replace("png", "tgx"));
    } catch (err) {
      setError((err as Error).message);
      setLoading(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout
      title="PNG to TGX Converter"
      description="Convert PNG files to Stronghold Crusader TGX"
    >
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography variant="h1">
            Convert PNG files to Stronghold Crusader TGX
          </Typography>
        </Grid>

        <Grid item xs={12}>
          <Typography variant="body1">
            Choose a file to convert to TGX
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
              accept=".png"
              onChange={(event) => loadFile(event.target.files)}
              hidden
            />
          </LoadingButton>
        </Grid>

        <Grid item xs={12}>
          {error && <Typography variant="body1">{error}</Typography>}
        </Grid>

        <Grid item xs={12}>
          <FileDownload fileData={fileData} name={fileName} />
        </Grid>
      </Grid>
    </Layout>
  );
};

export default PngToTgx;
