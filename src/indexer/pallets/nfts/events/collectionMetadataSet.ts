import { NftCollection } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { SetCollectionMetadataAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ICollectionMetadataSetEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; metadata: string }> {}

interface ICollectionMetadataSetEventPalletSetup extends IBasePalletSetup {
  decoder: ICollectionMetadataSetEventPalletDecoder;
}

export class CollectionMetadataSetEventPalletHandler extends EventPalletHandler<ICollectionMetadataSetEventPalletSetup> {
  constructor(setup: ICollectionMetadataSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const nftCollection = ctx.store.defer(NftCollection, data.collectionId);

    queue.push(
      new SetCollectionMetadataAction(block.header, event.extrinsic, {
        nftCollection: () => nftCollection.getOrFail(),
        metadata: data.metadata,
      })
    );
  }
}
