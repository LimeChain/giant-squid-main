import { IStakingPayoutStakersCallPalletDecoder, IStakingRewardEventPalletDecoder } from '../../../registry';
import { Block, Event, ProcessorContext } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { Action } from '../../../actions/base';
import { Account } from '../../../../model';
import { EnsureAccount, RewardAction } from '../../../actions';

export class StakingRewardPalletHandler extends PalletEventHandler<IStakingRewardEventPalletDecoder> {
  private payoutStakersDecoder: IStakingPayoutStakersCallPalletDecoder;

  constructor(
    decoder: IStakingRewardEventPalletDecoder,
    options: { chain: string },
    payoutStakersDecoder: IStakingPayoutStakersCallPalletDecoder
  ) {
    super(decoder, options);

    this.payoutStakersDecoder = payoutStakersDecoder;
  }

  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    const event = params.item as Event;

    const data = this.decoder.decode(event);

    if (data == null) return; // old format rewards skipped

    let accountId = this.encodeAddress(data.stash);

    let validatorId: string | undefined;
    let era: number | undefined;

    if (event.call?.name === 'Staking.payout_stakers') {
      const callData = this.payoutStakersDecoder.decode(event.call);
      validatorId = this.encodeAddress(callData.validatorStash);
      era = callData.era;
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
