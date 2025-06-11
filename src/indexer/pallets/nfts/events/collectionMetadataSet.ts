// @ts-ignore
import { Account, HistoryElementType, NFTCollection } from '@/model';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EnsureAccount, EnsureNFTCollection, HistoryElementAction, SetCollectionMetadataAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';

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
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);

    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collectionId, nftCollection: () => nftCollection.get() }),
      new SetCollectionMetadataAction(block.header, event.extrinsic, {
        nftCollection: () => nftCollection.getOrFail(),
        metadataUri: data.metadataUri,
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
