// @ts-ignore
import { Account, HistoryElementType } from '@/model';
import { EnsureAccount, HistoryElementAction, TokenBurnedAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';

export interface ITokenBurnedEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: string; owner: string }> {}

interface ITokenBurnedEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenBurnedEventPalletDecoder;
}

export class TokenBurnedEventPalletHandler extends EventPalletHandler<ITokenBurnedEventPalletSetup> {
  constructor(setup: ITokenBurnedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);
    const owner = ctx.store.defer(Account, data.owner);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: data.owner, pk: this.decodeAddress(data.owner) }),
      new TokenBurnedAction(block.header, event.extrinsic, {
        tokenId: data.item,
        collectionId: data.collectionId,
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
