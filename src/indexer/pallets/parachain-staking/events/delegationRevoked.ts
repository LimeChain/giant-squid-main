import { EnsureAccount, EnsureStaker, HistoryElementAction, ParachainDelegationRevokedAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IEventPalletDecoder } from '@/indexer/types';
// @ts-ignore
import { Account, HistoryElementType, Staker } from '@/model';
import { buildParachainStakingExtrinsicHash } from '../utils';
import { getOriginAccountId } from '@/utils';

export interface IParachainDelegationRevokedEventDecoder extends IEventPalletDecoder<{ delegator: string; stash: string; amount: bigint }> {}

interface IDelegationRevokedEventPalletSetup {
  decoder: IParachainDelegationRevokedEventDecoder;
}

export class ParachainDelegationRevokedEventPalletHandler extends EventPalletHandler<IDelegationRevokedEventPalletSetup> {
  constructor(setup: IDelegationRevokedEventPalletSetup, options: IHandlerOptions) {
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
      new ParachainDelegationRevokedAction(block.header, event.extrinsic, {
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
        account: () => accountDef.getOrFail(),
      })
    );
  }
}
