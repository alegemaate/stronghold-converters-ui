// Convert 15 bit colour to 24 bit
export const color15to32 = (byte1: number, byte2: number) => {
  // Extract values (gggbbbbb Xrrrrrgg)
  const r = (byte2 & 0b01111100) >> 2;
  const g = ((byte1 & 0b11100000) >> 5) | ((byte2 & 0b00000011) << 3);
  const b = byte1 & 0b00011111;

  // Convert from 15 bit to 32
  // Technically this will not use the full depth, but does not involve floats which is ideal
  return {
    r: r * 8,
    g: g * 8,
    b: b * 8,
  };
};

// Convert 24 bit colour to 15 bit
export const color32to15 = (r: number, g: number, b: number) => {
  // Roll up values (gggbbbbb Xrrrrrgg)
  const byte1 = ((b & 0b111111000) >> 3) | ((g & 0b00111000) << 2);
  const byte2 = ((r & 0b111111000) >> 1) | ((g & 0b11000000) >> 6) | 0b10000000;

  return [byte1, byte2];
};
