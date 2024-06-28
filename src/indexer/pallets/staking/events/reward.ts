import { Account } from '@/model';
import { EnsureAccount, RewardAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';

export interface IPayoutStakersCallPalletDecoder extends ICallPalletDecoder<{ validatorStash: string; era: number }> {}
export interface IRewardEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint } | undefined> {}

interface IRewardEventPalletSetup extends IBasePalletSetup {
  decoder: IRewardEventPalletDecoder;
  payoutStakersDecoder: IPayoutStakersCallPalletDecoder;
}

export class RewardEventPalletHandler extends EventPalletHandler<IRewardEventPalletSetup> {
  private payoutStakersDecoder: IPayoutStakersCallPalletDecoder;

  constructor(setup: IRewardEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.payoutStakersDecoder = setup.payoutStakersDecoder;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data) return; // old format rewards skipped

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
        pk: data.stash,
      }),
      new RewardAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => from.getOrFail(),
        amount: data.amount,
        era,
        validatorId,
      })
    );
  }
}
