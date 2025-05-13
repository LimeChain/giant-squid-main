import * as ss58 from '@subsquid/ss58';
import { isHex } from '@subsquid/util-internal-hex';
import { assertNotNull, decodeHex } from '@subsquid/substrate-processor';
import { Item, orderItems } from '@/utils/orderItems';
import { Block } from '@/indexer/processor';

export function decodeAddress(address: string, networkOrPrefix: string | number) {
  if (isHex(address)) {
    return address;
  }

  return ss58.codec(networkOrPrefix).decode(address);
}

export function encodeAddress(address: string | Uint8Array, networkOrPrefix: string | number) {
  if (isHex(address)) {
    return address;
  }

  return ss58.codec(networkOrPrefix).encode(address);
}

export function processItem(blocks: Block[], fn: (block: Block, item: Item) => void) {
  for (let block of blocks) {
    for (let item of orderItems(block)) {
      fn(block, item);
    }
  }
}

export function getOriginAccountId(origin: any): Uint8Array | undefined {
  if (origin && origin.__kind === 'system' && origin.value.__kind === 'Signed') {
    const id = origin.value.value;
    if (id.__kind === 'Id') {
      return decodeHex(id.value);
    } else {
      return decodeHex(id);
    }
  } else {
    return undefined;
  }
}

export function toEntityMap<T extends { id: string }>(entities: T[]): Map<string, T> {
  return new Map(entities.map((e) => [e.id, e]));
}

export function* splitIntoBatches<T>(list: T[], maxBatchSize: number): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list;
  } else {
    let offset = 0;
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize);
      offset += maxBatchSize;
    }
    yield list.slice(offset);
  }
}

export function unwrapData(data: { __kind: string; value?: string }) {
  switch (data.__kind) {
    case 'None':
      return null;
    case 'BlakeTwo256':
    case 'Sha256':
    case 'Keccak256':
    case 'ShaThree256':
      return Buffer.from(data.value!).toString('hex');
    default: {
      let unwrapped = '';
      if (isHex(data.value)) {
        unwrapped = decodeHex(data.value).toString('utf-8');
      } else {
        unwrapped = Buffer.from(data.value!).toString('utf-8');
      }

      // Removes all the null characters from the decoded string
      return unwrapped.replace(/\u0000/g, '');
    }
  }
}

export function ensureEnvVariable(name: string): string {
  return assertNotNull(process.env[name], `Missing env variable ${name}`);
}

/**
 * Decodes a hexadecimal string into a UTF-8 string.
 *
 * @param hexString - The hexadecimal string to decode. It may optionally start with the '0x' prefix.
 * @returns The decoded UTF-8 string.
 *
 * @remarks
 * This function removes the '0x' prefix from the input string if present, converts the hexadecimal
 * string into a byte array, and then decodes it into a UTF-8 string using the `TextDecoder` API.
 *
 * @example
 * ```typescript
 * const result = decodeHexToUTF8('48656c6c6f');
 * console.log(result); // Output: "Hello"
 * ```
 */
export function decodeHexToUTF8(hexString: ss58.Bytes) {
  // Remove '0x' prefix if present
  if (hexString.startsWith('0x')) {
    hexString = hexString.slice(2);
  }

  // Convert hex to bytes and then to UTF-8 string
  const bytes = [];
  for (let i = 0; i < hexString.length; i += 2) {
    bytes.push(parseInt(hexString.substring(i, i + 2), 16));
  }

  return new TextDecoder('utf-8').decode(new Uint8Array(bytes));
}

/**
 * Calculates the era return as a percentage based on the reward and bonded amount.
 *
 * @param reward - The reward amount as a bigint.
 * @param bondedAmount - The bonded amount as a bigint.
 * @returns The era return as a string formatted with two decimal places followed by a '%' symbol,
 *          or `null` if the bonded amount is zero.
 */
export function calculateEraReturn(reward: bigint, bondedAmount: bigint): string | null {
  if (bondedAmount === 0n) {
    return null;
  }

  const rewardNumber = Number(reward);
  const bondedNumber = Number(bondedAmount);
  const eraReturn = (rewardNumber / bondedNumber) * 100;

  return `${eraReturn.toFixed(2)}%`;
}
