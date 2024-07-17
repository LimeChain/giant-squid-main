import assert from 'assert';
import { Block, Call, Event } from '@/indexer/processor';

export type Item =
  | {
      kind: 'call';
      value: Call;
    }
  | {
      kind: 'event';
      value: Event;
    };

const CALL_FIRST = 1;

export function orderItems(block: Block): Item[] {
  const items: Item[] = [];

  for (const call of block.calls) {
    items.push({
      kind: 'call',
      value: call,
    });
  }

  for (const event of block.events) {
    items.push({
      kind: 'event',
      value: event,
    });
  }

  items.sort((a, b) => {
    switch (a.kind) {
      case 'call':
        switch (b.kind) {
          case 'call':
            return compareCalls(a.value, b.value);
          case 'event':
            return compareCallEvent(a.value, b.value, CALL_FIRST);
        }
      case 'event':
        switch (b.kind) {
          case 'call':
            return compareCallEvent(b.value, a.value, CALL_FIRST) * -1;
          case 'event':
            return compareEvents(a.value, b.value);
        }
    }
  });

  return items;
}

function compareEvents(a: { index: number }, b: { index: number }) {
  return a.index - b.index;
}

function compareCalls(a: { extrinsicIndex: number; address: number[] }, b: { extrinsicIndex: number; address: number[] }) {
  return a.extrinsicIndex - b.extrinsicIndex || a.address.length - b.address.length || (a.address.length == 0 ? 0 : last(a.address) - last(b.address));
}

function compareCallEvent(a: { extrinsicIndex: number; address: number[] }, b: { extrinsicIndex?: number; callAddress?: number[] }, callFirst: number) {
  return b.extrinsicIndex == null || b.callAddress == null
    ? 1
    : a.extrinsicIndex - b.extrinsicIndex ||
        a.address.length - b.callAddress.length ||
        (a.address.length == 0 ? 0 : last(a.address) - last(b.callAddress)) ||
        callFirst;
}

function last<T>(arr: T[]): T {
  assert(arr.length > 0);
  return arr[arr.length - 1];
}
