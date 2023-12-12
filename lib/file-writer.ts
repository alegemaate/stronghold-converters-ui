/**
 * Generic file writer
 */
export class FileWriter {
  /**
   * Byte array of file
   */
  private fileArray: number[] = [];

  /**
   * Load buffer into writer
   * @param buffer - Buffer to write
   */
  protected getArrayBuffer(): ArrayBuffer {
    return new Uint8ClampedArray(this.fileArray);
  }

  /**
   * Write bytes to file
   * @param bytes - Bytes to write
   */
  protected writeBytes(bytes: number[]) {
    this.fileArray.push(...bytes);
  }

  /**
   * Write single byte to file
   * @param byte - Byte to write
   */
  protected writeByte(byte: number) {
    this.fileArray.push(byte);
  }
}
