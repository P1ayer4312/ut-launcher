import crypto from "node:crypto";
import { Buffer } from "node:buffer";
import type { TGameKey } from "@src/backend/types/gameConfigData.type";

/**
 * Get a CD-Key for a selected game
 */
export function gameKeyProvider(gameId: TGameKey) {
  //TODO: This
  switch (gameId) {
    case "ut-2004":
      return generate2kKey();
    case "ut-3":
      return generate3Key();

    default:
      throw new Error("Invalid game id received");
  }
}

function generate2kKey() {
  function scramble(value: string) {
    let result = "";
    const table = "ABCDEFGHJLKMNPQRTUVWXYZ2346789";

    for (let n = 0; n < value.length; n++) {
      const char = value.charCodeAt(n);

      if (char >= 0x30 && char <= 0x39) {
        result += table[char - 0x30];
      } else if (char >= 0x41 && char <= 0x5a) {
        result += table[char - 0x41 + 10];
      } else if (char >= 0x61 && char <= 0x7a) {
        result += table[char - 0x61 + 10];
      } else {
        result += "\0";
      }
    }

    return result;
  }

  const buffer = Buffer.alloc(8);
  crypto.randomFillSync(buffer);

  const magic = "appDebugfNoInit";
  const base = 30;
  const padch = "A";
  const seed = buffer.readBigUInt64LE();

  const seed30 = seed.toString(base);
  const key = scramble(seed30).padStart(14, padch);
  const checkData = `${buffer.readBigInt64LE()}${magic}`;
  const digest = crypto.createHash("md5").update(checkData).digest();

  const qdigest = Buffer.from(digest.subarray(0, 8)).readBigUInt64LE();
  const digest30 = qdigest.toString(base).padStart(6, padch);
  const check = scramble(digest30);
  const fullKey = `${key}${check}`;

  const final =
    `${fullKey.substring(10, 15)}-` +
    `${fullKey.substring(5, 10)}-` +
    `${fullKey.substring(0, 5)}-` +
    `${fullKey.substring(15, 20)}`;

  return final;
}

function generate3Key() {
  const CHARSET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  const KEY_LENGTH = 8;
  const CHECKSUM_VALUE = 1727;
  const CHECKSUM_MULTIPLIER = 1664117991;
  const XOR_CONSTANT = 0x31443772;

  function toByteArray(bigIntNum: bigint) {
    const seedBuffer = Buffer.alloc(8);
    seedBuffer.writeBigUint64LE(bigIntNum, 0);
    return Uint8Array.from(seedBuffer);
  }

  function initializeData(data: Uint8Array) {
    const buffer = Buffer.alloc(8);
    crypto.randomFillSync(buffer);

    const randomBigInt = buffer.readBigUInt64LE();

    const lowBits = randomBigInt & 0xffffffffn;
    const highBits = (randomBigInt >> 32n) & 0xffffffffn;

    const seed = BigInt.asUintN(32, lowBits * highBits);
    const seedBytes = toByteArray(seed);
    data[0] = seedBytes[2] ^ 1;
    data[1] = seedBytes[3];
    data[2] = seedBytes[0];
    data[3] = seedBytes[1];

    const second = BigInt.asUintN(32, (seed ^ BigInt(XOR_CONSTANT)) * 2n);
    const secondBytes = toByteArray(second);
    data[4] = secondBytes[0];
    data[5] = secondBytes[1];
    data[6] = secondBytes[2];
    data[7] = secondBytes[3];

    for (let i = KEY_LENGTH + 2; i < data.length; i++) {
      data[i] = crypto.randomInt(0, 255);
    }
  }

  function calculateChecksum(data: Uint8Array) {
    let checksum = 0n;
    for (let i = 0; i < KEY_LENGTH; i++) {
      const temp = BigInt.asUintN(32, BigInt(CHECKSUM_MULTIPLIER) * checksum);
      checksum = BigInt.asUintN(32, BigInt(data[i]) - temp);
    }

    const checksumWord = CHECKSUM_VALUE ^ (Number(checksum) % 0xfff1);
    data[KEY_LENGTH] = checksumWord & 0xff;
    data[KEY_LENGTH + 1] = checksumWord >> 8;
  }

  function encodeKey(data: Uint8Array) {
    const encoded = [];
    let outputIndex = 0;
    let offsetBit = 0;

    for (let chunkStart = 0; chunkStart < data.length; chunkStart += 3) {
      const b0 = data[chunkStart];
      const b1 = data[chunkStart + 1] || 0;
      const b2 = data[chunkStart + 2] || 0;
      const b3 = data[chunkStart + 3] || 0;
      const chunk = Buffer.from([b0, b1, b2, b3]).readUint32LE();

      let bitPosition = offsetBit;
      for (let n = 0; n < 5; n++) {
        const index = (chunk >> bitPosition) & 0x1f;
        encoded[outputIndex] = CHARSET.charAt(index);
        outputIndex += 1;
        bitPosition = Number(BigInt.asUintN(8, BigInt(bitPosition) + 5n));
      }

      offsetBit = Number(BigInt.asUintN(8, BigInt(offsetBit) + 1n));
    }

    return encoded;
  }

  const data = new Uint8Array(18);
  initializeData(data);
  calculateChecksum(data);

  const encodedBytes = encodeKey(data).join("");

  const key =
    `${encodedBytes.substring(0, 4)}-` +
    `${encodedBytes.substring(4, 8)}-` +
    `${encodedBytes.substring(8, 12)}-` +
    `${encodedBytes.substring(12, 16)}`;

  return key;
}
