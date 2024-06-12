import { IStakingRewardEventPalletDecoder } from '../../../registry';
import { Block, Event, ProcessorContext } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { Action } from '../../../../action/base';
import { Account } from '../../../../model';
import { EnsureAccount, RewardAction } from '../../../../action';

export class StakingRewardPalletHandler extends PalletEventHandler<IStakingRewardEventPalletDecoder> {
  constructor(decoder: IStakingRewardEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    const event = params.item as Event;

    const data = this.decoder.decode(event);

    if (data == null) return; // old format rewards skipped

    let accountId = this.encodeAddress(data.stash);

    let validatorId: string | undefined;
    let era: number | undefined;
    // NOTE: make this so it works with the new refactored code
    if (event.call?.name === 'Staking.payout_stakers') {
      // const c = chain.api.calls.staking.payout_stakers.decode(event.call);
      // validatorId = encodeAddress(c.validatorStash);
      // era = c.era;
    }

    const from = params.ctx.store.defer(Account, accountId);

    params.queue.push(
      new EnsureAccount(params.block.header, event.extrinsic, {
        account: () => from.get(),
        id: accountId,
      }),
      new RewardAction(params.block.header, event.extrinsic, {
        id: event.id,
        account: () => from.getOrFail(),
        amount: data.amount,
        era,
        validatorId,
      })
    );
  }
}
