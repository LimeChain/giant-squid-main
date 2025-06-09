// @ts-ignore
import { Account } from '@/model';
import { EnsureAccount, TokenBurnedAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

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
    const owner = ctx.store.defer(Account, data.owner);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: data.owner, pk: this.decodeAddress(data.owner) }),
      new TokenBurnedAction(block.header, event.extrinsic, {
        tokenId: data.item,
        collectionId: data.collectionId,
        owner: () => owner.getOrFail(),
      })
    );
  }
}
