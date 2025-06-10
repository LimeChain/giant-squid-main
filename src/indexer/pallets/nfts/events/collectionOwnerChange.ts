// @ts-ignore
import { Account, NFTCollection } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CollectionOwnerChangeAction, EnsureAccount, EnsureNFTCollection } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ICollectionOwnerChangeEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; newOwner: string }> {}

interface ICollectionOwnerChangeEventPalletSetup extends IBasePalletSetup {
  decoder: ICollectionOwnerChangeEventPalletDecoder;
}

export class CollectionOwnerChangeEventPalletHandler extends EventPalletHandler<ICollectionOwnerChangeEventPalletSetup> {
  constructor(setup: ICollectionOwnerChangeEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const ownerId = this.encodeAddress(data.newOwner);

    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);
    const owner = ctx.store.defer(Account, ownerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: ownerId, pk: this.decodeAddress(ownerId) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collectionId, nftCollection: () => nftCollection.get() }),
      new CollectionOwnerChangeAction(block.header, event.extrinsic, {
        nftCollection: () => nftCollection.getOrFail(),
        newOwner: () => owner.getOrFail(),
      })
    );
  }
}
