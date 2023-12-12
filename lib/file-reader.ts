/**
 * General file reader class
 */
export class FileReader {
  /**
   * Bytes of file
   */
  protected bytes = new Uint8Array();

  /**
   * Index of current byte
   */
  protected index = 0;

  /**
   * Load buffer into reader
   * @param buffer - Buffer to read
   */
  protected loadBuffer(buffer: ArrayBuffer): void {
    this.bytes = new Uint8Array(buffer);
    this.index = 0;
  }

  /**
   * Read next 'length' bytes
   * @param length - Number of bytes to read
   * @returns - Next 'length' bytes
   */
  protected readNextBytes(length: number): Uint8Array {
    // Get next 'length' byte
    const next = this.bytes.slice(this.index, this.index + length);
    if (next.length !== length) {
      throw new Error("Read next bytes out of bound");
    }

    // Increment our index
    this.index += length;

    return next;
  }

  /**
   * Read a single byte
   * @returns - Next byte
   */
  protected readNextByte(): number {
    // Get a single byte
    const byte = this.bytes.at(this.index);
    if (typeof byte !== "number") {
      throw new Error("Read next byte out of bounds");
    }

    // Increment our index
    this.index++;

    return byte;
  }
}
