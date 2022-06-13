export class FileWriter {
  protected bytes = new Uint8Array();

  private fileArray: number[] = [];

  protected getArrayBuffer(): ArrayBuffer {
    return new Uint8ClampedArray(this.fileArray);
  }

  protected writeBytes(bytes: number[]) {
    this.fileArray.push(...bytes);
  }

  protected writeByte(byte: number) {
    this.fileArray.push(byte);
  }
}
