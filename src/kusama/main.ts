import {StoreWithCache} from '@belopash/squid-tools'
import {TypeormDatabase} from '@subsquid/typeorm-store'
import {Block, BlockHeader, Call, Event, Extrinsic, processor} from './processor'
import assert from 'assert'

export function getRuntime(block: BlockHeader) {
    const version = block.specId.split('@')[1]
    switch (version) {
        case '1020':
        case '1021':
        case '1022':
        case '1023':
        case '1024':
        case '1025':
        case '1026':
        case '1027':
        case '1028':
        case '1029':
            return require('./runtime/v1020').runtime
        case '1030':
        case '1031':
            return require('./runtime/v1030').runtime
        case '1032':
        case '1033':
        case '1038':
        case '1039':
        case '1040':
        case '1042':
        case '1045':
        default:
            return require('./runtime/v1032').runtime
            // case '1050':
            // case '1051':
            // case '1052':
            // case '1053':
            // case '1054':
            // case '1055':
            // case '1058':
            // case '1062':
            // case '2005':
            // case '2007':
            // case '2008':
            // case '2011':
            // case '2012':
            // case '2013':
            //     return require('./runtime/v1050').runtime
            // case '2015':
            // case '2019':
            // case '2022':
            // case '2023':
            // case '2024':
            // case '2025':
            // case '2026':
            // case '2027':
            //     return require('./runtime/v2015').runtime
            // case '2028':
            // case '2029':
            // case '2030':
            // case '9010':
            // case '9030':
            // case '9040':
            //     return require('./runtime/v2028').runtime
            // case '9050':
            // case '9070':
            // case '9080':
            // case '9090':
            // case '9100':
            //     return require('./runtime/v9050').runtime
            // case '9111':
            // case '9122':
            //     return require('./runtime/v9111').runtime
            // case '9130':
            //     return require('./runtime/v9130').runtime
            // case '9300':
            //     return require('./runtime/v9300').runtime
            // case '9430':
            //     return require('./runtime/v9430').runtime
            throw new Error(`Unknown runtime version: ${version}`)
    }
}

processor.run(new TypeormDatabase(), async (_ctx) => {
    const store = StoreWithCache.create(_ctx.store)
    // const queue = new ActionQueue()

    const ctx = {..._ctx, store}
    for (let block of ctx.blocks) {
        const runtime = getRuntime(block.header)

        const items = orderItems(block)
        for (const {kind, value} of items) {
            switch (kind) {
                case 'event': {
                    const [palletName, itemName] = value.name.split('.')
                    const pallet = runtime[palletName]
                    if (pallet == null) continue

                    const mapper = pallet.EventMappers[itemName]
                    if (mapper == null) continue

                    new mapper().handle(ctx, value)

                    break
                }
                case 'call': {
                    const [palletName, itemName] = value.name.split('.')
                    const pallet = runtime[palletName]
                    if (pallet == null) continue

                    const mapper = pallet.CallMappers[itemName]
                    if (mapper == null) continue

                    new mapper().handle(ctx, value)

                    break
                }
            }
        }
        console.dir(items, {depth: 3})
    }

    // await queue.process(ctx)
    await ctx.store.flush()
})

type Item =
    | {
          kind: 'call'
          value: Call
      }
    | {
          kind: 'event'
          value: Event
      }

function orderItems(block: Block): Item[] {
    const items: Item[] = []

    for (const call of block.calls) {
        items.push({
            kind: 'call',
            value: call,
        })
    }

    for (const event of block.events) {
        items.push({
            kind: 'event',
            value: event,
        })
    }

    items.sort((a, b) => {
        switch (a.kind) {
            case 'call':
                switch (b.kind) {
                    case 'call':
                        return compareCalls(a.value, b.value)
                    case 'event':
                        return compareCallEvent(a.value, b.value)
                }
            case 'event':
                switch (b.kind) {
                    case 'call':
                        return compareCallEvent(b.value, a.value) * -1
                    case 'event':
                        return compareEvents(a.value, b.value)
                }
        }
    })

    return items
}

function compareEvents(a: {index: number}, b: {index: number}) {
    return a.index - b.index
}

function compareCalls(a: {extrinsicIndex: number; address: number[]}, b: {extrinsicIndex: number; address: number[]}) {
    return (
        a.extrinsicIndex - b.extrinsicIndex ||
        a.address.length - b.address.length ||
        (a.address.length == 0 ? 0 : last(a.address) - last(b.address))
    )
}

const CALL_FIRST = 1

function compareCallEvent(
    a: {extrinsicIndex: number; address: number[]},
    b: {extrinsicIndex?: number; callAddress?: number[]}
) {
    return b.extrinsicIndex == null || b.callAddress == null
        ? 1
        : a.extrinsicIndex - b.extrinsicIndex ||
              a.address.length - b.callAddress.length ||
              (a.address.length == 0 ? 0 : last(a.address) - last(b.callAddress)) ||
              CALL_FIRST
}

function last<T>(arr: T[]): T {
    assert(arr.length > 0)
    return arr[arr.length - 1]
}