import { Account, NftCollection, NftToken } from '@/model';
import { CreateNftAction, EnsureAccount, NftTokenTransfer, TokenBurnedAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ITokenTransferredEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: number; from: string; to: string }> {}

interface ITokenTransferredEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenTransferredEventPalletDecoder;
}

export class TokenTransferredEventPalletHandler extends EventPalletHandler<ITokenTransferredEventPalletSetup> {
  constructor(setup: ITokenTransferredEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const nftCollection = ctx.store.defer(NftCollection, data.collectionId);

    const fromId = this.encodeAddress(data.from);
    const toId = this.encodeAddress(data.to);
    const from = ctx.store.defer(Account, fromId);
    const to = ctx.store.defer(Account, toId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => from.get(), id: fromId, pk: this.decodeAddress(fromId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => to.get(), id: toId, pk: this.decodeAddress(toId) }),
      new NftTokenTransfer(block.header, event.extrinsic, {
        id: event.id,
        collectionId: data.collectionId,
        token: data.item,
        from: () => from.getOrFail(),
        to: () => to.getOrFail(),
        collection: () => nftCollection.getOrFail(),
      })
    );
  }
}
