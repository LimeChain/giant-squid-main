import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { CreatePoolAction } from '@/indexer/actions/nomination-pools/pool';
import { getOriginAccountId } from '@/utils';
// @ts-ignore
import { Account, Staker } from '@/model';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';

export interface INominationPoolsCreatePollCallPalletDecoder
  extends ICallPalletDecoder<{
    amount: bigint;
    root: string;
    nominator: string;
    toggler: string;
  }> {}

interface INominationPoolsCreatePoolCallPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsCreatePollCallPalletDecoder;
}

export class NominationPoolsCreatePoolCallPalletHandler extends CallPalletHandler<INominationPoolsCreatePoolCallPalletSetup> {
  constructor(setup: INominationPoolsCreatePoolCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (call.success === false) return;
    const origin = getOriginAccountId(call.origin);
    if (!origin) return;
    const data = this.decoder.decode(call);

    const creatorId = this.encodeAddress(origin);
    const creatorAccount = ctx.store.defer(Account, creatorId);
    const creatorStaker = ctx.store.defer(Staker, creatorId);

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
      new EnsureAccount(block.header, call.extrinsic, { account: () => creatorAccount.get(), id: creatorId, pk: this.decodeAddress(creatorId) }),
      new EnsureStaker(block.header, call.extrinsic, { id: creatorId, account: () => creatorAccount.getOrFail(), staker: () => creatorStaker.get() }),
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
      new CreatePoolAction(block.header, call.extrinsic, {
        creator: () => creatorStaker.getOrFail(),
        root: () => rootStaker.getOrFail(),
        nominator: () => nominatorStaker.getOrFail(),
        toggler: () => togglerStaker.getOrFail(),
        totalBonded: data.amount,
      })
    );
  }
}
