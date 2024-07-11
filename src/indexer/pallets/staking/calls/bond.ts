import { ICallPalletDecoder, IBasePalletSetup, PayeeType } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, BondingType, RewardDestination, Staker } from '@/model';
import { AddPayeeAction } from '@/indexer/actions/staking/payee';
import { DeferredEntity } from '@belopash/typeorm-store/lib/store';
import { BasePayeeCallPallet } from './setPayee.base';
import { ISetPayeeCallPalletData } from './setPayee';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint } & ISetPayeeCallPalletData> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends BasePayeeCallPallet<IRebondCallPalletSetup> {
  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const origin = getOriginAccountId(call.origin);
    const data = this.decoder.decode(call);

    if (!origin) return;

    const stashId = this.encodeAddress(origin);

    const stash = ctx.store.defer(Account, stashId);
    const staker = ctx.store.defer(Staker, stashId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() }),
      new BondAction(block.header, call.extrinsic, {
        id: call.id,
        type: BondingType.Bond,
        amount: data.amount,
        account: () => stash.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );

    this.addPayee({ ctx, block, item: call, queue, data, staker, stash: this.decodeAddress(stashId) });
  }
}
