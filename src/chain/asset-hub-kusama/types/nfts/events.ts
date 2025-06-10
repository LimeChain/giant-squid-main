import {sts, Block, Bytes, Option, Result, EventType, RuntimeCtx} from '../support'
import * as v9420 from '../v9420'

export const created =  {
    name: 'Nfts.Created',
    /**
     * A `collection` was created.
     */
    v9420: new EventType(
        'Nfts.Created',
        sts.struct({
            collection: sts.number(),
            creator: v9420.AccountId32,
            owner: v9420.AccountId32,
        })
    ),
}

export const issued =  {
    name: 'Nfts.Issued',
    /**
     * An `item` was issued.
     */
    v9420: new EventType(
        'Nfts.Issued',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            owner: v9420.AccountId32,
        })
    ),
}

export const transferred =  {
    name: 'Nfts.Transferred',
    /**
     * An `item` was transferred.
     */
    v9420: new EventType(
        'Nfts.Transferred',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            from: v9420.AccountId32,
            to: v9420.AccountId32,
        })
    ),
}

export const burned =  {
    name: 'Nfts.Burned',
    /**
     * An `item` was destroyed.
     */
    v9420: new EventType(
        'Nfts.Burned',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            owner: v9420.AccountId32,
        })
    ),
}

export const ownerChanged =  {
    name: 'Nfts.OwnerChanged',
    /**
     * The owner changed.
     */
    v9420: new EventType(
        'Nfts.OwnerChanged',
        sts.struct({
            collection: sts.number(),
            newOwner: v9420.AccountId32,
        })
    ),
}

export const collectionMetadataSet =  {
    name: 'Nfts.CollectionMetadataSet',
    /**
     * New metadata has been set for a `collection`.
     */
    v9420: new EventType(
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
    v9420: new EventType(
        'Nfts.ItemMetadataSet',
        sts.struct({
            collection: sts.number(),
            item: sts.number(),
            data: sts.bytes(),
        })
    ),
}

export const attributeSet =  {
    name: 'Nfts.AttributeSet',
    /**
     * New attribute metadata has been set for a `collection` or `item`.
     */
    v9420: new EventType(
        'Nfts.AttributeSet',
        sts.struct({
            collection: sts.number(),
            maybeItem: sts.option(() => sts.number()),
            key: sts.bytes(),
            value: sts.bytes(),
            namespace: v9420.AttributeNamespace,
        })
    ),
}
