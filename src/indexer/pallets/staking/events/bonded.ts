import { Account, BondingType, Staker } from '@/model';
import { EnsureAccount, BondAction, EnsureStaker } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface IBondedEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IBondedEventPalletSetup extends IBasePalletSetup {
  decoder: IBondedEventPalletDecoder;
  skipCalls?: boolean;
}

export class BondedEventPalletHandler extends EventPalletHandler<IBondedEventPalletSetup> {
  private skipBonded: boolean;
  constructor(setup: IBondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.skipBonded = setup.skipCalls ?? true;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

    // NOTE: Skip if event is emitted from the call as its already handled there
    if (event.call?.name === 'Staking.rebond') return;
    if (event.call?.name === 'Staking.bond' && this.skipBonded === true) return;

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new BondAction(block.header, event.extrinsic, {
        id: event.id,
        type: BondingType.Bond,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
