import { EnsureAccount, EnsureStaker, ParachainCandidateBondedLessAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IEventPalletDecoder } from '@/indexer/types';
// @ts-ignore
import { Account, Staker } from '@/model';
import { buildParachainStakingExtrinsicHash } from '../utils';

export interface IParachainCandidateBondedLessEventDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface ICandidateBondedLessEventPalletSetup {
  decoder: IParachainCandidateBondedLessEventDecoder;
}

export class ParachainCandidateBondedLessEventPalletHandler extends EventPalletHandler<ICandidateBondedLessEventPalletSetup> {
  constructor(setup: ICandidateBondedLessEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data) return;

    const stakerId = this.encodeAddress(data.stash);

    const accountDef = ctx.store.defer(Account, stakerId);
    const stakerDef = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => accountDef.get(),
        id: stakerId,
        pk: data.stash,
      }),
      new EnsureStaker(block.header, event.extrinsic, {
        id: stakerId,
        staker: () => stakerDef.get(),
        account: () => accountDef.getOrFail(),
      }),
      new ParachainCandidateBondedLessAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => accountDef.getOrFail(),
        staker: () => stakerDef.getOrFail(),
        amount: data.amount,
        extrinsicHash: buildParachainStakingExtrinsicHash(block.header.height, event.index, event.extrinsicIndex),
      })
    );
  }
}
