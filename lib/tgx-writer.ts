import { color32to15 } from "./color";
import { FileWriter } from "./file-writer";

enum TokenType {
  Stream = 0,
  Transparent = 1,
  Repeated = 2,
  EndLine = 4,
}

interface PixelStreamValue {
  r: number;
  g: number;
  b: number;
}

interface PixelValue {
  r: number;
  g: number;
  b: number;
  a: number;
  count: number;
}

const MAX_TOKEN_LENGTH = 32;

const pixelValueEqual = (a: PixelValue, b: PixelValue) =>
  a.r === b.r && a.g === b.g && a.b === b.b && a.a === b.a;

export class TgxWriter extends FileWriter {
  private width = 0;

  private height = 0;

  public loadImageData(imageData: ImageData) {
    // Set dimensions
    this.width = imageData.width;
    this.height = imageData.height;

    // Write data
    this.writeHeader();
    this.writeBody(imageData);
  }

  // Create image data
  public getFileBuffer() {
    return this.getArrayBuffer();
  }

  // Read header data
  private writeHeader() {
    const widthByte1 = this.width & 0b11111111;
    const widthByte2 = this.width >> 8;
    const heightByte1 = this.height & 0b11111111;
    const heightByte2 = this.height >> 8;

    this.writeBytes([
      widthByte1,
      widthByte2,
      0,
      0,
      heightByte1,
      heightByte2,
      0,
      0,
    ]);
  }

  /**
   * Write body data
   */
  private writeBody(imageData: ImageData) {
    const pixelStack = this.preprocessBody(imageData);

    // Write bytes, line by line
    pixelStack.forEach((line) => {
      // Stream happens when multiple pixels in a row that are not the same
      const pixelStream: PixelStreamValue[] = [];

      line.forEach((pixel, index) => {
        // Transparent
        if (pixel.a === 0) {
          this.writePixelStream(pixelStream);
          this.writeTransparent(pixel.count);
        }

        // Repeated pixel (we allow some duplicates)
        else if (pixel.count > 2) {
          this.writePixelStream(pixelStream);
          this.writePixelRepeated(pixel);
        }

        // Pixel stream
        else {
          for (let i = 0; i < pixel.count; i++) {
            pixelStream.push(pixel);

            // Max stream length is 32
            if (pixelStream.length >= MAX_TOKEN_LENGTH) {
              this.writePixelStream(pixelStream);
            }
          }
        }

        // Line ending
        if (index === line.length - 1) {
          this.writePixelStream(pixelStream);
          this.writeLineEnding();
        }
      });
    });
  }

  private preprocessBody(imageData: ImageData): PixelValue[][] {
    // Create scanlines for pixel stack
    const pixelStack: PixelValue[][] = [];
    for (let i = 0; i < this.height; i++) {
      pixelStack.push([]);
    }

    // Index of image buffer parsing
    let parseIndex = 0;

    // Read into the stack (deals with repeated pixels)
    while (parseIndex < imageData.data.length) {
      // Current line
      const y = Math.floor(parseIndex / 4 / this.width);

      // Read next color
      const [r, g, b, a] = imageData.data.slice(parseIndex, parseIndex + 4);
      const currentValue: PixelValue = { r, g, b, a, count: 1 };

      // Pop for compare
      const lastValue = pixelStack[y].pop();

      // Start of parse
      if (!lastValue) {
        pixelStack[y].push(currentValue);
      }
      // We can simply increment count since they are equal
      else if (
        pixelValueEqual(currentValue, lastValue) &&
        lastValue.count < MAX_TOKEN_LENGTH
      ) {
        lastValue.count += 1;
        pixelStack[y].push(lastValue);
      }
      // Non equal values, we start fresh
      else {
        pixelStack[y].push(lastValue);
        pixelStack[y].push(currentValue);
      }

      parseIndex += 4;
    }

    return pixelStack;
  }

  private writePixelStream(pixels: PixelStreamValue[]) {
    if (pixels.length === 0) {
      return;
    }

    this.writeToken(TokenType.Stream, pixels.length);

    pixels.forEach((pixel) => {
      const bytes = color32to15(pixel.r, pixel.g, pixel.b);
      this.writeBytes(bytes);
    });

    pixels.length = 0;
  }

  private writePixelRepeated(pixel: PixelValue) {
    const bytes = color32to15(pixel.r, pixel.g, pixel.b);
    this.writeToken(TokenType.Repeated, pixel.count);
    this.writeBytes(bytes);
  }

  private writeTransparent(length: number) {
    this.writeToken(TokenType.Transparent, length);
  }

  private writeLineEnding() {
    this.writeToken(TokenType.EndLine, 1);
  }

  private writeToken(type: TokenType, length: number): void {
    console.assert(length > 0 && length <= 32);
    const tokenByte = (type << 5) | ((length - 1) & 0b00011111);
    this.writeByte(tokenByte);
  }
}
