import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';
// @ts-ignore
import { Account, Staker } from '@/model';
import { AddControllerAction } from '@/indexer/actions/staking/controller';

export interface ISetControllerCallPalletDecoder extends ICallPalletDecoder<string | undefined> {}

interface ISetControllerCallPalletSetup extends IBasePalletSetup {
  decoder: ISetControllerCallPalletDecoder;
}

export class SetControllerCallPalletHandler extends CallPalletHandler<ISetControllerCallPalletSetup> {
  constructor(setup: ISetControllerCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const ctrler = this.decoder.decode(call);
    const stashId = this.encodeAddress(origin);
    const controllerId = this.encodeAddress(ctrler || origin);

    const account = ctx.store.defer(Account, stashId);
    const staker = ctx.store.defer(Staker, stashId);
    const controller = ctx.store.defer(Account, controllerId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => account.get(), id: stashId, pk: this.decodeAddress(stashId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: stashId, staker: () => staker.get(), account: () => account.getOrFail() }),
      new EnsureAccount(block.header, call.extrinsic, { account: () => controller.get(), id: controllerId, pk: this.decodeAddress(controllerId) }),
      new AddControllerAction(block.header, call.extrinsic, {
        id: call.id,
        controller: () => controller.getOrFail(),
        staker: () => staker.getOrFail(),
      })
    );
  }
}
