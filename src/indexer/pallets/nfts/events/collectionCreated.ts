// @ts-ignore
import { Account, NFTCollection } from '@/model';
import { EnsureAccount } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureNFTCollection } from '@/indexer/actions/nfts/nftCollection';

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

    const ownerId = this.encodeAddress(data.owner);
    const creatorId = this.encodeAddress(data.creator);

    const owner = ctx.store.defer(Account, ownerId);
    const creator = ctx.store.defer(Account, creatorId);
    const nftCollection = ctx.store.defer(NFTCollection, data.collection);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: ownerId, pk: this.decodeAddress(ownerId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => creator.get(), id: creatorId, pk: this.decodeAddress(creatorId) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collection, nftCollection: () => nftCollection.get() })
    );
  }
}
