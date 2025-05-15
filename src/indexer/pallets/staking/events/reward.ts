// @ts-ignore
import { Account, BondingType, HistoryElementType, RewardDestination, Staker } from '@/model';
import { BondAction, EnsureAccount, EnsureStaker, HistoryElementAction, RewardAction } from '@/indexer/actions';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { Action, LazyAction } from '@/indexer/actions/base';
import { EraRewardAction } from '@/indexer/actions/staking/era-rewards';
import { getOriginAccountId } from '@/utils';

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

    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const originAccount = ctx.store.defer(Account, accountId);

    const accountDef = ctx.store.defer(Account, stakerId);
    const stakerDef = ctx.store.defer(Staker, { id: stakerId, relations: { payee: true } });

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => originAccount.get(), id: accountId, pk: this.decodeAddress(accountId) }),
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
          }),
          new EraRewardAction(block.header, event.extrinsic, {
            id: event.id,
            staker: () => Promise.resolve(staker),
            amount: data.amount,
            era,
            validatorId,
          })
        );

        // the payee type is set to Staked, so we need to auto-bond the reward
        // rewards with zero amount have no effect on the staking ledger, so we skip them
        if (data.amount > 0 && payee?.type === RewardDestination.Staked) {
          queue.push(
            new BondAction(block.header, event.extrinsic, {
              id: event.id,
              type: BondingType.Reward,
              amount: data.amount,
              account: () => Promise.resolve(payee?.account || account),
              staker: () => Promise.resolve(staker),
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

        return queue;
      })
    );
  }
}
