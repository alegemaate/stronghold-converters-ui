function dec2bin(dec: number) {
  return dec.toString(2);
}

// Convert 15 bit colour to 24 bit
const convertColor = (byte1: number, byte2: number) => {
  // Extract values (gggbbbbb Xrrrrrgg)
  const r = (byte2 & 0b01111100) >> 2;
  const g = ((byte1 & 0b11100000) >> 5) | ((byte2 & 0b00000011) << 3);
  const b = byte1 & 0b00011111;

  // Convert from 15 bit to 32
  // Technically this will not use the full depth, but does not involve floats which is ideal
  return {
    r: r * 7,
    g: g * 7,
    b: b * 7,
  };
};

export class TGXLoader {
  // // Look up address from pallette
  // palleteLookup( addr: number, std::vector<unsigned int>* pall) {
  //   if(addr < pall -> size()) {
  //     return pall -> at(addr);
  //   }

  //   return makecol(255, 0, 0);
  // }

  // Load tgx from file
  public loadTgx(buffer: ArrayBuffer) {
    const array = new Uint8Array(buffer);

    // Return new image
    return this.parseTgx(array);
  }

  // Tgx helper used by file and memory
  private parseTgx(bytes: Uint8Array, pall = null) {
    // Iterator
    let iter = 0;

    // Read the 8 byte header
    const width: number = bytes[0] + 256 * bytes[1];
    const height: number = bytes[4] + 256 * bytes[5];
    iter += 8;

    // Make bitmap
    const bmp = new ImageData(width, height);
    console.log({ width, height });

    // Image position x/y
    let x = 0;
    let y = 0;

    // Parse file
    while (iter < bytes.length) {
      // Close
      if (y >= height) {
        break;
      }

      // Extract token and length
      const token = bytes[iter] >> 5;
      const length = (bytes[iter] & 0b00011111) + 1;
      console.log("token", bytes[iter]);
      iter += 1;

      // Deal with tokens accordingly
      switch (token) {
        // Pixel stream
        case 0:
          for (let t = x + length; x < t; x++) {
            // 15 bit colour
            if (pall == null) {
              const { r, g, b } = convertColor(bytes[iter], bytes[iter + 1]);
              const index = (x + y * width) * 4;
              bmp.data[index] = r;
              bmp.data[index + 1] = g;
              bmp.data[index + 2] = b;
              bmp.data[index + 3] = 255;
              iter += 2;
            }
            // Palette lookup
            else {
              //   putpixel(bmp, x, y, pallete_lookup((unsigned char)bytes -> at(*iter), pall));
              iter += 1;
            }
          }

          break;

        // Transparent pixels
        case 1:
          for (let t = x + length; x < t; x++) {
            const index = (x + y * width) * 4;
            bmp.data[index] = 0;
            bmp.data[index + 1] = 0;
            bmp.data[index + 2] = 0;
            bmp.data[index + 3] = 0;
          }

          break;

        // Repeating pixels
        case 2:
          // 15 bit colour
          if (pall == null) {
            for (let t = x + length; x < t; x++) {
              const { r, g, b } = convertColor(bytes[iter], bytes[iter + 1]);
              const index = (x + y * width) * 4;
              bmp.data[index] = r;
              bmp.data[index + 1] = g;
              bmp.data[index + 2] = b;
              bmp.data[index + 3] = 255;
            }

            iter += 2;
          }
          // Pallette lookup
          else {
            //   for(let t = x + length; x < t; x++) {
            //     putpixel(bmp, x, y, pallete_lookup((unsigned char)bytes -> at(*iter), pall));
            //   }

            iter += 1;
          }

          break;

        // New line
        case 4:
          // Fill rest of line
          for (; x < width; x++) {
            const index = (x + y * width) * 4;
            bmp.data[index] = 0;
            bmp.data[index + 1] = 0;
            bmp.data[index + 2] = 0;
            bmp.data[index + 3] = 0;
          }

          // New line
          y += 1;
          x = 0;
          break;

        // Should never get here
        default:
          console.log(
            "Invalid token (",
            token,
            ") at ",
            iter - 1,
            " length ",
            length
          );
          break;
      }
    }

    // Return bmp
    return bmp;
  }
}
