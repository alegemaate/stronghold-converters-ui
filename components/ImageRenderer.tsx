import { useEffect, useRef, useState } from "react";
import { imageDataToUri } from "../lib/convert";

interface ImageRendererProps {
  image: ImageData | null;
  name: string;
}

export const ImageRenderer: React.FC<ImageRendererProps> = ({
  image,
  name,
}) => {
  const [imageSrc, setImageSrc] = useState("");
  const [downloadSrc, setDownloadSrc] = useState("");

  useEffect(() => {
    const renderImage = (data: ImageData) => {
      const dataUrl = imageDataToUri(data);
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
      <img src={imageSrc} width="100%" alt="Image output" />
      <a href={downloadSrc} download={name}>
        Download [{name}]
      </a>
    </>
  );
};
