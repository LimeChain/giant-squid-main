import { Account, HistoryElementType } from '@/model';
import { EnsureAccount, HistoryElementAction, TransferAction } from '@/indexer/actions';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ITransferEventPalletDecoder extends IEventPalletDecoder<{ from: string; to: string; amount: bigint }> {}
interface ITransferEventPalletSetup extends IBasePalletSetup {
  decoder: ITransferEventPalletDecoder;
}

export class TransferEventPalletHandler extends EventPalletHandler<ITransferEventPalletSetup> {
  constructor(setup: ITransferEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const { from, to, amount } = this.decoder.decode(event);

    const fromId = this.encodeAddress(from);
    const toId = this.encodeAddress(to);

    const fromAccount = ctx.store.defer(Account, fromId);
    const toAccount = ctx.store.defer(Account, toId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => fromAccount.get(),
        id: fromId,
        pk: from,
      }),
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => toAccount.get(),
        id: toId,
        pk: to,
      }),
      new TransferAction(block.header, event.extrinsic, {
        id: event.id,
        from: () => fromAccount.getOrFail(),
        to: () => toAccount.getOrFail(),
        amount: amount,
        success: true,
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        amount,
        account: () => fromAccount.getOrFail(),
      })
    );
  }
}
