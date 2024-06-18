import { EnsureAccount, TransferAction } from '../../../actions';
import { Account } from '../../../../model';
import { EventPalletHandler, IHandlerEventParams, IHandlerOptions } from '../../handler';
import { IBasePalletSetup, IEventPalletDecoder } from '../../../types';

export interface ITransferEventPalletDecoder extends IEventPalletDecoder<{ from: string; to: string; amount: bigint }> { }
interface ITransferEventPalletSetup extends IBasePalletSetup { decoder: ITransferEventPalletDecoder; }

export class TransferEventPalletHandler extends EventPalletHandler<ITransferEventPalletSetup> {
  constructor(setup: ITransferEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IHandlerEventParams) {
    const { from, to, amount } = this.decoder.decode(event);

    const fromId = this.encodeAddress(from);
    const toId = this.encodeAddress(to);

    const fromAccount = ctx.store.defer(Account, fromId);
    const toAccount = ctx.store.defer(Account, toId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => fromAccount.get(),
        id: fromId,
      }),
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => toAccount.get(),
        id: toId,
      }),
      new TransferAction(block.header, event.extrinsic, {
        id: event.id,
        from: () => fromAccount.getOrFail(),
        to: () => toAccount.getOrFail(),
        amount: amount,
        success: true,
      })
    );
  }
}
