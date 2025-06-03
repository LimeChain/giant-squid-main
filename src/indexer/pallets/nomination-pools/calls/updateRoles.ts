//@ts-ignore
import { Account, Pool, Staker } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions/nomination-pools/pool';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';

export interface INominationPoolsUpdateRolesCallPalletDecoder
  extends ICallPalletDecoder<{
    poolId: string;
    root: string | undefined;
    nominator: string | undefined;
    toggler: string | undefined;
  }> {}

interface INominationPoolsUpdateRolesCallPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsUpdateRolesCallPalletDecoder;
}

export class NominationPoolsUpdateRolesCallPalletHandler extends CallPalletHandler<INominationPoolsUpdateRolesCallPalletSetup> {
  constructor(setup: INominationPoolsUpdateRolesCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);

    if (!data.root || !data.nominator || !data.toggler) {
      return;
    }

    const pool = ctx.store.defer(Pool, data.poolId.toString());

    const rootAccountId = this.encodeAddress(data.root);
    const rootAccount = ctx.store.defer(Account, rootAccountId);
    const rootStaker = ctx.store.defer(Staker, rootAccountId);

    const nominatorAccountId = this.encodeAddress(data.nominator);
    const nominatorAccount = ctx.store.defer(Account, nominatorAccountId);
    const nominatorStaker = ctx.store.defer(Staker, nominatorAccountId);

    const togglerAccountId = this.encodeAddress(data.toggler);
    const togglerAccount = ctx.store.defer(Account, togglerAccountId);
    const togglerStaker = ctx.store.defer(Staker, togglerAccountId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => rootAccount.get(), id: rootAccountId, pk: this.decodeAddress(rootAccountId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: rootAccountId, account: () => rootAccount.getOrFail(), staker: () => rootStaker.get() }),
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => nominatorAccount.get(),
        id: nominatorAccountId,
        pk: this.decodeAddress(nominatorAccountId),
      }),
      new EnsureStaker(block.header, call.extrinsic, {
        id: nominatorAccountId,
        account: () => nominatorAccount.getOrFail(),
        staker: () => nominatorStaker.get(),
      }),
      new EnsureAccount(block.header, call.extrinsic, { account: () => togglerAccount.get(), id: togglerAccountId, pk: this.decodeAddress(togglerAccountId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: togglerAccountId, account: () => togglerAccount.getOrFail(), staker: () => togglerStaker.get() }),
      new UpdatePoolAction(block.header, call.extrinsic, {
        pool: () => pool.getOrFail(),
        root: () => rootStaker.getOrFail(),
        nominator: () => nominatorStaker.getOrFail(),
        toggler: () => togglerStaker.getOrFail(),
      })
    );
  }
}
