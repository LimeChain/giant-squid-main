import { Account, NftCollection, NftToken } from '@/model';
import { CreateNftAction, EnsureAccount, TokenBurnedAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IssueNftToken } from '@/indexer/actions/nfts/tokenIssued';
import { SetTokenMetadataAction } from '@/indexer/actions/nfts/tokenMetadataSet';

export interface ITokenBurnedEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: number; owner: string }> {}

interface ITokenBurnedEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenBurnedEventPalletDecoder;
}

export class TokenBurnedEventPalletHandler extends EventPalletHandler<ITokenBurnedEventPalletSetup> {
  constructor(setup: ITokenBurnedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const nftToken = ctx.store.defer(NftToken, `${data.collectionId}-${data.item}`);
    const nftCollection = ctx.store.defer(NftCollection, data.collectionId);

    queue.push(
      new TokenBurnedAction(block.header, event.extrinsic, {
        token: () => nftToken.getOrFail(),
        collection: () => nftCollection.getOrFail(),
      })
    );
  }
}
