import { EnsureAccount, EnsureStaker, HistoryElementAction, ParachainCompoundAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { buildParachainStakingExtrinsicHash } from '@/indexer/pallets/parachain-staking/utils';
import { IEventPalletDecoder } from '@/indexer/types';
// @ts-ignore
import { Account, HistoryElementType, Staker } from '@/model';
import { getOriginAccountId } from '@/utils';

export interface IParachainCompoundEventDecoder extends IEventPalletDecoder<{ stash: string; delegator: string; amount: bigint }> {}

interface ICompoundEventPalletSetup {
  decoder: IParachainCompoundEventDecoder;
}

export class ParachainCompoundEventPalletHandler extends EventPalletHandler<ICompoundEventPalletSetup> {
  constructor(setup: ICompoundEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin || !data) return;

    const accountId = this.encodeAddress(origin);
    const stakerId = this.encodeAddress(data.stash);
    const delegatorId = this.encodeAddress(data.delegator);

    const originAccount = ctx.store.defer(Account, accountId);
    const accountDef = ctx.store.defer(Account, stakerId);
    const delegatorDef = ctx.store.defer(Account, delegatorId);
    const stakerDef = ctx.store.defer(Staker, { id: stakerId });

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => originAccount.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => accountDef.get(),
        id: stakerId,
        pk: data.stash,
      }),
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => delegatorDef.get(),
        id: delegatorId,
        pk: data.stash,
      }),
      new EnsureStaker(block.header, event.extrinsic, {
        id: stakerId,
        staker: () => stakerDef.get(),
        account: () => accountDef.getOrFail(),
      }),
      new ParachainCompoundAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => accountDef.getOrFail(),
        staker: () => stakerDef.getOrFail(),
        delegator: () => delegatorDef.getOrFail(),
        amount: data.amount,
        extrinsicHash: buildParachainStakingExtrinsicHash(block.header.height, event.index, event.extrinsicIndex),
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        amount: data.amount,
        account: () => originAccount.getOrFail(),
      })
    );
  }
}
