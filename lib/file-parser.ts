export class FileParser {
  protected bytes = new Uint8Array();

  protected index = 0;

  protected loadBuffer(buffer: ArrayBuffer) {
    this.bytes = new Uint8Array(buffer);
    this.index = 0;
  }

  protected readNextBytes(length: number) {
    // Get next 'length' byte
    const next = this.bytes.slice(this.index, this.index + length);
    if (next.length !== length) {
      throw new Error("Read next bytes out of bound");
    }

    // Increment our index
    this.index += length;

    return next;
  }

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
