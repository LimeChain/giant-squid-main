import { EnsureAccount, TransferAction } from '../../../actions';
import { Action } from '../../../actions/base';
import { Account } from '../../../../model';
import { ProcessorContext, Block, Event } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { ITransferEventPalletDecoder } from '../../../registry';

export class TransferEventPalletHandler extends PalletEventHandler<ITransferEventPalletDecoder> {
  constructor(decoder: ITransferEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    const event = params.item as Event;

    const { from, to, amount } = this.decoder.decode(event);

    const fromId = this.encodeAddress(from);
    const toId = this.encodeAddress(to);

    const fromAccount = params.ctx.store.defer(Account, fromId);
    const toAccount = params.ctx.store.defer(Account, toId);

    params.queue.push(
      new EnsureAccount(params.block.header, event.extrinsic, {
        account: () => fromAccount.get(),
        id: fromId,
      }),
      new EnsureAccount(params.block.header, event.extrinsic, {
        account: () => toAccount.get(),
        id: toId,
      }),
      new TransferAction(params.block.header, event.extrinsic, {
        id: event.id,
        from: () => fromAccount.getOrFail(),
        to: () => toAccount.getOrFail(),
        amount: amount,
        success: true,
      })
    );
  }
}
