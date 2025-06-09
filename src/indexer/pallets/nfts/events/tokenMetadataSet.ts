// @ts-ignore
import { Account, NftCollection, NftToken } from '@/model';

import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IssueNftToken } from '@/indexer/actions/nfts/tokenIssued';
import { SetTokenMetadataAction } from '@/indexer/actions/nfts/tokenMetadataSet';

export interface ITokenMetadataSetEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: number; data: string }> {}

interface ITokenMetadataSetEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenMetadataSetEventPalletDecoder;
}

export class TokenMetadataSetEventPalletHandler extends EventPalletHandler<ITokenMetadataSetEventPalletSetup> {
  constructor(setup: ITokenMetadataSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const nftToken = ctx.store.defer(NftToken, `${data.collectionId}-${data.item}`);

    queue.push(
      new SetTokenMetadataAction(block.header, event.extrinsic, {
        token: () => nftToken.getOrFail(),
        metadata: data.data,
      })
    );
  }
}
