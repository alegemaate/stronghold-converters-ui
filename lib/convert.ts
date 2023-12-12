/**
 * Import file to image data
 * @param file - File to convert to image data
 * @returns - Image data of file
 */
export const fileToImageData = async (file: File): Promise<ImageData> =>
  new Promise<ImageData>((resolve, reject) => {
    try {
      const image = new Image();
      image.src = URL.createObjectURL(file);
      image.onload = () => {
        // Create canvas
        const canvas = document.createElement("canvas");
        const context = canvas.getContext("2d");

        if (!context) {
          throw new Error("Context not defined");
        }

        // Render image
        canvas.width = image.width;
        canvas.height = image.height;
        context.drawImage(image, 0, 0);
        const imageData = context.getImageData(
          0,
          0,
          canvas.width,
          canvas.height
        );

        resolve(imageData);
      };
    } catch (err) {
      reject(err as Error);
    }
  });

/**
 * Convert image data to URI
 * @param imageData - Image data to convert to URI
 * @returns - URI of image data
 */
export const imageDataToUri = (imageData: ImageData): string => {
  const canvas = document.createElement("canvas");
  const ctx = canvas.getContext("2d");

  if (!ctx) {
    throw new Error("Context not defined");
  }

  canvas.width = imageData.width;
  canvas.height = imageData.height;
  ctx.putImageData(imageData, 0, 0);

  return canvas.toDataURL();
};
