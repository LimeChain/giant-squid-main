// @ts-ignore
import { Account, HistoryElementType, NFTCollection } from '@/model';
import { CollectionOwnerChangeAction, EnsureAccount, EnsureNFTCollection, HistoryElementAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';

export interface ICollectionCreatedEventPalletDecoder extends IEventPalletDecoder<{ collection: string; creator: string; owner: string }> {}

interface ICollectionCreatedEventPalletSetup extends IBasePalletSetup {
  decoder: ICollectionCreatedEventPalletDecoder;
}

export class CollectionCreatedEventPalletHandler extends EventPalletHandler<ICollectionCreatedEventPalletSetup> {
  constructor(setup: ICollectionCreatedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);
    const ownerId = this.encodeAddress(data.owner);
    const creatorId = this.encodeAddress(data.creator);

    const owner = ctx.store.defer(Account, ownerId);
    const creator = ctx.store.defer(Account, creatorId);
    const nftCollection = ctx.store.defer(NFTCollection, data.collection);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: ownerId, pk: this.decodeAddress(ownerId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => creator.get(), id: creatorId, pk: this.decodeAddress(creatorId) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collection, nftCollection: () => nftCollection.get() }),
      new CollectionOwnerChangeAction(block.header, event.extrinsic, {
        nftCollection: () => nftCollection.getOrFail(),
        newOwner: () => owner.getOrFail(),
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        account: () => account.getOrFail(),
      })
    );
  }
}
