import { Account, BondingType, Staker, StakingUnlockChunk } from '@/model';
import { EnsureAccount, EnsureStaker, SlashAction, SlashBondAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { DecreaseUnlockChunkAction } from '@/indexer/actions/staking/unlock-chunk';

export interface ISlashEventPalletDecoder extends IEventPalletDecoder<{ staker: string; amount: bigint }> {}

interface ISlashEventPalletSetup extends IBasePalletSetup {
  decoder: ISlashEventPalletDecoder;
}

export class SlashEventPalletHandler extends EventPalletHandler<ISlashEventPalletSetup> {
  constructor(setup: ISlashEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  /**
   * Calculate the amount to be slashed from the balance
   * If the balance is less than the slash amount, the full balance is slashed and reminder is calculated
   * Otherwise, the full amount is slashed with no remainder
   *
   * @param balance Total balance of the account
   * @param maxAmount Max amount to be slashed
   * @returns slashing amount and the remainder
   */
  private calculateSlashAmounts(balance: bigint, slashAmount: bigint) {
    const slash = {
      amount: slashAmount,
      remainder: 0n,
    };

    if (balance < slashAmount) {
      slash.amount = balance;
      slash.remainder = slashAmount - balance;
    }

    return slash;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const stakerId = this.encodeAddress(data.staker);

    const accountDef = ctx.store.defer(Account, stakerId);
    const stakerDef = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => accountDef.get(), id: stakerId, pk: data.staker }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => accountDef.getOrFail(), staker: () => stakerDef.get() }),
      new SlashAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => accountDef.getOrFail(),
        staker: () => stakerDef.getOrFail(),
      }),
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];
        const staker = await stakerDef.getOrFail();

        const bondSlash = this.calculateSlashAmounts(staker.activeBonded, data.amount);

        // The account has enough active bonded amount to cover the slash,
        // so slash the amount from the active bonded amount
        if (bondSlash.amount > 0) {
          queue.push(
            new SlashBondAction(block.header, event.extrinsic, {
              id: event.id,
              amount: bondSlash.amount,
              account: () => accountDef.getOrFail(),
              staker: () => Promise.resolve(staker),
            })
          );
        }

        // The account is slashed more than the active bonded amount,
        // so slash the remaining amount from the unbonding tokens that are not yet withdrawn.
        if (bondSlash.remainder > 0) {
          const unlockingChunks = await ctx.store.find(StakingUnlockChunk, {
            where: { staker: { id: staker.id }, withdrawn: false },
            order: { blockNumber: 'ASC' },
          });

          let slashReminder = bondSlash.remainder;
          for (const chunk of unlockingChunks) {
            const chunkSlash = this.calculateSlashAmounts(chunk.amount, slashReminder);

            queue.push(
              new DecreaseUnlockChunkAction(block.header, event.extrinsic, {
                amount: chunkSlash.amount,
                chunk: () => Promise.resolve(chunk),
                staker: () => Promise.resolve(staker),
              })
            );

            // The full amount is slashed, so no need to continue
            if (chunkSlash.remainder <= 0) break;
            slashReminder = chunkSlash.remainder;
          }
        }

        return queue;
      })
    );
  }
}
