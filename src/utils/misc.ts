import { decodeHex, toHex } from '@subsquid/substrate-processor'
import * as ss58 from '@subsquid/ss58'
import { chain } from '../chain'
import { Item, orderItems } from './orderItems'
import { Block } from '../processor'

export function encodeAddress(address: string | Uint8Array) {
  return ss58.codec(chain.config.name).encode(address);
}

export function decodeAddress(address: string) {
  return ss58.codec(chain.config.name).decode(address);
}

export function processItem(
  blocks: Block[],
  fn: (block: Block, item: Item) => void
) {
  for (let block of blocks) {
    for (let item of orderItems(block)) {
      fn(block, item)
    }
  }
}

export function getOriginAccountId(origin: any): Uint8Array | undefined {
  if (
    origin &&
    origin.__kind === 'system' &&
    origin.value.__kind === 'Signed'
  ) {
    const id = origin.value.value
    if (id.__kind === 'Id') {
      return decodeHex(id.value)
    } else {
      return decodeHex(id)
    }
  } else {
    return undefined
  }
}

export function toEntityMap<T extends { id: string }>(
  entities: T[]
): Map<string, T> {
  return new Map(entities.map((e) => [e.id, e]))
}

export function* splitIntoBatches<T>(
  list: T[],
  maxBatchSize: number
): Generator<T[]> {
  if (list.length <= maxBatchSize) {
    yield list
  } else {
    let offset = 0
    while (list.length - offset > maxBatchSize) {
      yield list.slice(offset, offset + maxBatchSize)
      offset += maxBatchSize
    }
    yield list.slice(offset)
  }
}
