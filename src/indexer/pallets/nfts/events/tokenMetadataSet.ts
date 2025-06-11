// @ts-ignore
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { HistoryElementAction, SetTokenMetadataAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';
import { Account, HistoryElementType } from '@/model';

export interface ITokenMetadataSetEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: string; data: string }> {}

interface ITokenMetadataSetEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenMetadataSetEventPalletDecoder;
}

export class TokenMetadataSetEventPalletHandler extends EventPalletHandler<ITokenMetadataSetEventPalletSetup> {
  constructor(setup: ITokenMetadataSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);

    queue.push(
      new SetTokenMetadataAction(block.header, event.extrinsic, {
        collectionId: data.collectionId,
        tokenId: data.item,
        metadata: data.data,
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
