import { Account, BondingType, Staker } from '@/model';
import { EnsureAccount, BondAction, EnsureStaker } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Call } from '@/indexer/processor';

export interface IBondedEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IBondedEventPalletSetup extends IBasePalletSetup {
  decoder: IBondedEventPalletDecoder;
}

export class BondedEventPalletHandler extends EventPalletHandler<IBondedEventPalletSetup> {
  constructor(setup: IBondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  hasBondCall(call?: Call) {
    if (call?.name === 'Staking.bond' || call?.name === 'Staking.rebond' || call?.name === 'Staking.bond_extra') {
      return true;
    }

    // It is a batch call, so check each call in the batch
    if (
      call?.args?.calls?.some(
        (call: any) => call.__kind === 'Staking' && (call.value.__kind === 'bond' || call.value.__kind === 'bond_extra' || call.value.__kind === 'rebond')
      )
    ) {
      return true;
    }

    return false;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    // It is already handled by the calls, so skip the event handler
    if (this.hasBondCall(event.call)) {
      return;
    }

    console.log('BondedEventPalletHandler', event.call);

    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

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
