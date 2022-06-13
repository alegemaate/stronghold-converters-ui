import { useEffect, useRef, useState } from "react";

interface FileDownloadProps {
  fileData: ArrayBuffer | null;
  name: string;
}

export const FileDownload: React.FC<FileDownloadProps> = ({
  fileData,
  name,
}) => {
  const [downloadSrc, setDownloadSrc] = useState("");

  useEffect(() => {
    if (!fileData) {
      return;
    }

    const fileBlob = new Blob([fileData], { type: "octet/stream" });

    const dataUrl = window.URL.createObjectURL(fileBlob);
    setDownloadSrc(dataUrl);
  }, [fileData]);

  if (!fileData) {
    return null;
  }

  return (
    <a href={downloadSrc} download={name}>
      Download [{name}]
    </a>
  );
};
