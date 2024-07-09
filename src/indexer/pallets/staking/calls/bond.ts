import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { decodeHex } from '@subsquid/substrate-processor';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, BondingType, Staker } from '@/model';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint; payee?: string; controller?: string }> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const origin = getOriginAccountId(call.origin);
    const data = this.decoder.decode(call);

    if (!origin) return;

    const stashId = this.encodeAddress(origin);

    const controller = data.controller && this.encodeAddress(decodeHex(data.controller));

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
  }
}
