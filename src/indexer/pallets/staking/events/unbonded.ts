import { Account, Staker } from '../../../../model';
import { EnsureAccount, EnsureStaker, UnBondAction } from '../../../actions';
import { IEventPalletDecoder, IBasePalletSetup } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';

export interface IUnBondedEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IUnBondedEventPalletSetup extends IBasePalletSetup {
  decoder: IUnBondedEventPalletDecoder;
}

export class UnBondedEventPalletHandler extends EventPalletHandler<IUnBondedEventPalletSetup> {
  constructor(setup: IUnBondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new UnBondAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
