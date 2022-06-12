import { convertColor } from "./color";
import { FileParser } from "./file-parser";

interface TgxToken {
  type: TokenType;
  length: number;
}

enum TokenType {
  Stream = 0,
  Transparent = 1,
  Repeated = 2,
  EndLine = 4,
}

export class TGXLoader extends FileParser {
  private imageData: number[] = [];

  public width = 0;

  public height = 0;

  public loadFile(buffer: ArrayBuffer) {
    this.loadBuffer(buffer);
    this.readHeader();
    this.readBody();
  }

  // // Look up address from palette
  // paleteLookup( addr: number, std::vector<unsigned int>* pal) {
  //   if(addr < pal -> size()) {
  //     return pal -> at(addr);
  //   }

  //   return makecol(255, 0, 0);
  // }

  // Create image data
  public getImageData() {
    const bmp = new ImageData(this.width, this.height);
    this.imageData.forEach((byte, index) => {
      bmp.data[index] = byte;
    });
    return bmp;
  }

  // Read header data
  private readHeader() {
    const header = this.readNextBytes(8);
    this.width = header[0] + 256 * header[1];
    this.height = header[4] + 256 * header[5];
  }

  /**
   *
   * @param pal Palette (not supported yet)
   */
  private readBody(pal = null) {
    // Parse file
    while (this.index < this.bytes.length) {
      // Extract token and length
      const token = this.readToken();

      // Deal with tokens accordingly
      switch (token.type) {
        // Pixel stream
        case TokenType.Stream:
          this.writePixels(token.length, pal);
          break;

        // Transparent pixels
        case TokenType.Transparent:
          this.writeTransparent(token.length);
          break;

        // Repeating pixels
        case TokenType.Repeated:
          this.writeRepeatedPixels(token.length, pal);
          break;

        // New line
        case TokenType.EndLine:
          this.fillLine();
          break;

        // Should never get here
        default:
          console.log(`Invalid token (${token}) at ${this.index - 1}`);
          break;
      }
    }
  }

  /**
   * Write "length" number of pixels
   * @param len Length of pixel bytes
   * @param pal Optional palete
   */
  private writePixels(len: number, pal = null) {
    for (let i = 0; i < len; i++) {
      // 15 bit colour
      if (pal === null) {
        const [byte1, byte2] = this.readNextBytes(2);
        const { r, g, b } = convertColor(byte1, byte2);
        this.imageData.push(r, g, b, 255);
      }
      // Palette lookup
      else {
        //   putpixel(bmp, x, y, palete_lookup((unsigned char)bytes -> at(*iter), pal));
      }
    }
  }

  /**
   * Write transparent pixels with lenght of n
   * @param len Length to write transparent pixels
   */
  private writeTransparent(len: number) {
    for (let i = 0; i < len; i++) {
      this.imageData.push(0, 0, 0, 0);
    }
  }

  /**
   * Read one pixel value and repeate it "len" times
   * @param len Length to write pixels
   * @param pal Optional palet for lookups
   */
  private writeRepeatedPixels(len: number, pal = null) {
    // 15 bit colour
    if (pal === null) {
      const [byte1, byte2] = this.readNextBytes(2);
      const { r, g, b } = convertColor(byte1, byte2);
      for (let i = 0; i < len; i++) {
        this.imageData.push(r, g, b, 255);
      }
    }
    // Palettete lookup
    else {
      //   for(let t = x + len; x < t; x++) {
      //     putpixel(bmp, x, y, palete_lookup((unsigned char)bytes -> at(*iter), pal));
      //   }
    }
  }

  /**
   * Fill in the rest of the width of the image with transparent pixels
   */
  private fillLine() {
    this.writeTransparent(this.imageData.length % this.width);
  }

  /**
   * Read the next token
   * Token types can be one of:
   *  0 -> Stream of pixels
   *  1 -> Transparent Pixels
   *  2 -> Repeated Pixels
   *  4 -> End of line
   * @returns Type and length of token
   */
  private readToken(): TgxToken {
    const tokenByte = this.readNextByte();
    const type = tokenByte >> 5;
    const length = (tokenByte & 0b00011111) + 1;

    return { type, length };
  }
}
