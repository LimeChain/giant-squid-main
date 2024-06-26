import { Account, Staker } from '../../../../model';
import { EnsureAccount, SlashAction } from '../../../actions';
import { IEventPalletDecoder, IBasePalletSetup } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';

export interface ISlashEventPalletDecoder extends IEventPalletDecoder<{ staker: string; amount: bigint }> {}

interface ISlashEventPalletSetup extends IBasePalletSetup {
  decoder: ISlashEventPalletDecoder;
}

export class SlashEventPalletHandler extends EventPalletHandler<ISlashEventPalletSetup> {
  constructor(setup: ISlashEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const stakerId = this.encodeAddress(data.staker);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.staker }),
      new SlashAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
