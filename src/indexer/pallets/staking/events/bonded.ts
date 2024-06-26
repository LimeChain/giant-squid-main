import { Account, Staker } from '../../../../model';
import { EnsureAccount, BondAction } from '../../../actions';
import { EnsureStaker } from '../../../actions/staking/staker';
import { IEventPalletDecoder, IBasePalletSetup } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';

export interface IBondedEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IBondedEventPalletSetup extends IBasePalletSetup {
  decoder: IBondedEventPalletDecoder;
}

export class BondedEventPalletHandler extends EventPalletHandler<IBondedEventPalletSetup> {
  constructor(setup: IBondedEventPalletSetup, options: IHandlerOptions) {
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
      new BondAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
