// Convert 15 bit colour to 24 bit
export const convertColor = (byte1: number, byte2: number) => {
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
