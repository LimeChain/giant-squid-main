import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9430 from '../v9430'

export const created =  {
    name: 'Nfts.Created',
    /**
     * A `collection` was created.
     */
    v9430: new EventType(
        'Nfts.Created',
        sts.struct({
            collection: sts.number(),
            creator: v9430.AccountId32,
            owner: v9430.AccountId32,
        })
    ),
}

export const issued =  {
    name: 'Nfts.Issued',
    /**
     * An `item` was issued.
     */
    v9430: new EventType(
        'Nfts.Issued',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            owner: v9430.AccountId32,
        })
    ),
}

export const transferred =  {
    name: 'Nfts.Transferred',
    /**
     * An `item` was transferred.
     */
    v9430: new EventType(
        'Nfts.Transferred',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            from: v9430.AccountId32,
            to: v9430.AccountId32,
        })
    ),
}

export const burned =  {
    name: 'Nfts.Burned',
    /**
     * An `item` was destroyed.
     */
    v9430: new EventType(
        'Nfts.Burned',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            owner: v9430.AccountId32,
        })
    ),
}

export const ownerChanged =  {
    name: 'Nfts.OwnerChanged',
    /**
     * The owner changed.
     */
    v9430: new EventType(
        'Nfts.OwnerChanged',
        sts.struct({
            collection: sts.number(),
            newOwner: v9430.AccountId32,
        })
    ),
}

export const collectionMetadataSet =  {
    name: 'Nfts.CollectionMetadataSet',
    /**
     * New metadata has been set for a `collection`.
     */
    v9430: new EventType(
        'Nfts.CollectionMetadataSet',
        sts.struct({
            collection: sts.number(),
            data: sts.bytes(),
        })
    ),
}

export const itemMetadataSet =  {
    name: 'Nfts.ItemMetadataSet',
    /**
     * New metadata has been set for an item.
     */
    v9430: new EventType(
        'Nfts.ItemMetadataSet',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            data: sts.bytes(),
        })
    ),
}
