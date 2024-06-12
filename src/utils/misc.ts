import { isHex } from '@subsquid/util-internal-hex';
import { assertNotNull, decodeHex } from '@subsquid/substrate-processor';
import * as ss58 from '@subsquid/ss58';
import { Item, orderItems } from './orderItems';
import { Block } from '../processor';

export function decodeAddress(address: string) {
  return ss58.codec(ensureEnvVariable('CHAIN')).decode(address);
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

      return unwrapped.replace(/\u0000/g, '');
    }
  }
}

export function ensureEnvVariable(name: string): string {
  return assertNotNull(process.env[name], `Missing env variable ${name}`);
}
