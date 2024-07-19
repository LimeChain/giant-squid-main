import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, BondingType, Staker } from '@/model';
import { BasePayeeCallPallet } from '@/indexer/pallets/staking/calls/setPayee.base';
import { ISetPayeeCallPalletData } from '@/indexer/pallets/staking/calls/setPayee';
import { AddControllerAction } from '@/indexer/actions/staking/controller';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint } & ISetPayeeCallPalletData> {}

interface IBondCallPalletSetup extends IBasePalletSetup {
  decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends BasePayeeCallPallet<IBondCallPalletSetup> {
  constructor(setup: IBondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const stashId = this.encodeAddress(origin);

    const data = this.decoder.decode(call);
    const stash = ctx.store.defer(Account, stashId);
    const staker = ctx.store.defer(Staker, stashId);

    const controllerId = this.encodeAddress(data.controller || origin);
    const controller = ctx.store.defer(Account, controllerId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
      new EnsureAccount(block.header, call.extrinsic, { account: () => controller.get(), id: controllerId, pk: this.decodeAddress(controllerId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() }),
      new AddControllerAction(block.header, call.extrinsic, {
        id: call.id,
        controller: () => controller.getOrFail(),
        staker: () => staker.getOrFail(),
      }),
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
