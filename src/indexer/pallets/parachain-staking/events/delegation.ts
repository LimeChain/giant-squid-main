import { EnsureAccount, EnsureStaker, ParachainDelegationAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { buildParachainStakingExtrinsicHash } from '@/indexer/pallets/parachain-staking/utils';
import { IEventPalletDecoder } from '@/indexer/types';
// @ts-ignore
import { Account, Staker } from '@/model';

export interface IParachainDelegationEventDecoder
  extends IEventPalletDecoder<{ delegator: string; amount: bigint; stash: string; delegatorPosition: { __kind: string }; autoCompundPercent?: number }> {}

interface IDelegationEventPalletSetup {
  decoder: IParachainDelegationEventDecoder;
}

export class ParachainDelegationEventPalletHandler extends EventPalletHandler<IDelegationEventPalletSetup> {
  constructor(setup: IDelegationEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data) return;

    const stakerId = this.encodeAddress(data.stash);
    const delegatorId = this.encodeAddress(data.delegator);

    const accountDef = ctx.store.defer(Account, stakerId);
    const delegatorDef = ctx.store.defer(Account, delegatorId);
    const stakerDef = ctx.store.defer(Staker, stakerId);

    queue.push(
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
      new ParachainDelegationAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => accountDef.getOrFail(),
        staker: () => stakerDef.getOrFail(),
        delegator: () => delegatorDef.getOrFail(),
        amount: data.amount,
        extrinsicHash: buildParachainStakingExtrinsicHash(block.header.height, event.index, event.extrinsicIndex),
        delegatorPosition: data.delegatorPosition.__kind,
        autoCompundPercent: data.autoCompundPercent,
      })
    );
  }
}
