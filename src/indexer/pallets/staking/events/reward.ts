import { Account, BondingType, RewardDestination, Staker } from '@/model';
import { AddPayeeAction, BondAction, EnsureAccount, EnsureStaker, RewardAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { Action, LazyAction } from '@/indexer/actions/base';

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

    const stakerId = this.encodeAddress(data.stash);

    let validatorId: string | undefined;
    let era: number | undefined;

    if (event.call?.name === 'Staking.payout_stakers') {
      const callData = this.payoutStakersDecoder.decode(event.call);

      validatorId = this.encodeAddress(callData.validatorStash);
      era = callData.era;
    }

    const accountDef = ctx.store.defer(Account, stakerId);
    const stakerDef = ctx.store.defer(Staker, { id: stakerId, relations: { payee: true } });

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

      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];
        const staker = await stakerDef.getOrFail();
        const account = await accountDef.getOrFail();

        const payee = staker.payee;

        queue.push(
          new RewardAction(block.header, event.extrinsic, {
            id: event.id,
            account: () => Promise.resolve(payee?.account || account),
            staker: () => Promise.resolve(staker),
            amount: data.amount,
            era,
            validatorId,
          })
        );

        if (data.amount > 0 && payee?.type === RewardDestination.Staked) {
          queue.push(
            new BondAction(block.header, event.extrinsic, {
              id: event.id,
              type: BondingType.Reward,
              amount: data.amount,
              account: () => Promise.resolve(payee?.account || account),
              staker: () => Promise.resolve(staker),
            })
          );
        }

        return queue;
      })
    );
  }
}
