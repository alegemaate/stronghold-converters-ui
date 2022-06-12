import { useEffect, useRef, useState } from "react";

interface ImageRendererProps {
  image: ImageData | null;
  name: string;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({
  image,
  name,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [imageSrc, setImageSrc] = useState("");
  const [downloadSrc, setDownloadSrc] = useState("");

  useEffect(() => {
    const renderImage = async (data: ImageData) => {
      const canvas = canvasRef.current;
      const ctx = canvas?.getContext("2d");

      if (!ctx || !canvas) {
        return;
      }

      canvas.width = data.width;
      canvas.height = data.height;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.putImageData(data, 0, 0);

      const dataUrl = canvas.toDataURL();
      setImageSrc(dataUrl);
      setDownloadSrc(dataUrl.replace("image/png", "image/octet-stream"));
    };

    if (image) {
      renderImage(image);
    }
  }, [image]);

  if (!image) {
    return null;
  }

  return (
    <>
      <canvas
        width={0}
        height={0}
        ref={canvasRef}
        style={{ display: "none" }}
      />
      <img src={imageSrc} width="100%" alt="Image output" />
      <a href={downloadSrc} download={name}>
        Download [{name}]
      </a>
    </>
  );
};
