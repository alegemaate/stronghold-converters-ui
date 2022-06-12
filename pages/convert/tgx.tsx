import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import { useRef } from "react";
import { TGXLoader } from "../../lib/tgx-loader";
import styles from "../../styles/Home.module.css";

const TGXConverter: NextPage = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const loadFile = async (files: FileList | null) => {
    const file = files?.item(0);
    const ctx = canvasRef.current?.getContext("2d");

    if (!file || !ctx) {
      return;
    }

    const buffer = await file.arrayBuffer();

    const loader = new TGXLoader();
    const result = loader.loadTgx(buffer);
    console.log(result);
    ctx.clearRect(0, 0, 1000, 1000);
    ctx.putImageData(result, 5, 5);
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>TGX Converter</title>
        <meta
          name="description"
          content="Convert Stronghold Crusader TGX files to PNG"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>Convert TGX to PNG</h1>

        <p className={styles.description}>Choose a file to convert to PNG</p>
        <div className={styles.grid}>
          <input
            type="file"
            accept="*.tgx"
            onChange={(event) => loadFile(event.target.files)}
          />
          <canvas width={1000} height={1000} ref={canvasRef} />
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="Vercel Logo" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default TGXConverter;
