import { EventPalletHandler, IHandlerEventParams, IHandlerOptions } from '../../handler';
import { Account } from '../../../../model';
import { EnsureAccount, RewardAction } from '../../../actions';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '../../../types';

export interface IPayoutStakersCallPalletDecoder extends ICallPalletDecoder<{ validatorStash: string; era: number }> { }
export interface IRewardEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint } | undefined> { }

interface IRewardEventPalletSetup extends IBasePalletSetup {
  decoder: IRewardEventPalletDecoder,
  payoutStakersDecoder: IPayoutStakersCallPalletDecoder
};

export class RewardEventPalletHandler extends EventPalletHandler<IRewardEventPalletSetup> {
  private payoutStakersDecoder: IPayoutStakersCallPalletDecoder;

  constructor(setup: IRewardEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.payoutStakersDecoder = setup.payoutStakersDecoder;
  }

  handle({ ctx, queue, block, item: event }: IHandlerEventParams) {
    const data = this.decoder.decode(event);

    if (data == null) return; // old format rewards skipped

    try {
      let accountId = this.encodeAddress(data.stash);

      let validatorId: string | undefined;
      let era: number | undefined;

      if (event.call?.name === 'Staking.payout_stakers') {
        const callData = this.payoutStakersDecoder.decode(event.call);

        validatorId = this.encodeAddress(callData.validatorStash);
        era = callData.era;
      }

      const from = ctx.store.defer(Account, accountId);

      queue.push(
        new EnsureAccount(block.header, event.extrinsic, {
          account: () => from.get(),
          id: accountId,
        }),
        new RewardAction(block.header, event.extrinsic, {
          id: event.id,
          account: () => from.getOrFail(),
          amount: data.amount,
          era,
          validatorId,
        })
      );
    } catch (e) {
      console.log(event);
      console.log(data);
      console.log(e);
      process.exit(1);
    }
  }
}
