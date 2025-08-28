export const snowflakeToDate = (id: string | number): Date => {
  let temp = BigInt(id).toString(2);
  const length = 64 - temp.length;

  if (length > 0) {
    temp = temp.padStart(64, "0");
  }

  const timestampBits = temp.substring(0, 42);

  const timestamp = parseInt(timestampBits, 2) + 1420070400000;

  return new Date(timestamp);
};
