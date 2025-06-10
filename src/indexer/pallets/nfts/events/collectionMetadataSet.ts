// @ts-ignore
import { NFTCollection } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EnsureNFTCollection, SetCollectionMetadataAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ICollectionMetadataSetEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; metadataUri: string }> {}

interface ICollectionMetadataSetEventPalletSetup extends IBasePalletSetup {
  decoder: ICollectionMetadataSetEventPalletDecoder;
}

export class CollectionMetadataSetEventPalletHandler extends EventPalletHandler<ICollectionMetadataSetEventPalletSetup> {
  constructor(setup: ICollectionMetadataSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);

    queue.push(
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collectionId, nftCollection: () => nftCollection.get() }),
      new SetCollectionMetadataAction(block.header, event.extrinsic, {
        nftCollection: () => nftCollection.getOrFail(),
        metadataUri: data.metadataUri,
      })
    );
  }
}
