import { EnsureAccount, EnsureStaker, ParachainRewardAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { buildParachainStakingExtrinsicHash } from '@/indexer/pallets/parachain-staking/utils';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { Account, Staker } from '@/model';

export interface IParachainRewardEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IRewardEventPalletSetup extends IBasePalletSetup {
  decoder: IParachainRewardEventPalletDecoder;
}

export class ParachainRewardEventPalletHandler extends EventPalletHandler<IRewardEventPalletSetup> {
  constructor(setup: IRewardEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data) return; // old format rewards skipped

    const stakerId = this.encodeAddress(data.stash);

    const accountDef = ctx.store.defer(Account, stakerId);
    const stakerDef = ctx.store.defer(Staker, { id: stakerId });

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
      new ParachainRewardAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => accountDef.getOrFail(),
        staker: () => stakerDef.getOrFail(),
        amount: data.amount,
        extrinsicHash: buildParachainStakingExtrinsicHash(block.header.height, event.index, event.extrinsicIndex),
      })
    );
  }
}
