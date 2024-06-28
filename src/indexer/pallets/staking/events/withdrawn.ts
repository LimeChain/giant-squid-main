import { Account, Staker, StakingRole } from '@/model';
import { EnsureAccount, EnsureStaker, WithdrawnAction } from '@/indexer/actions';
import { Action, LazyAction } from '@/indexer/actions/base';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { ICurrentEraStorageLoader } from '@/indexer/pallets/staking/storage';
import { WithdrawUnlockChunkAction } from '@/indexer/actions/staking/withdrawUnlockChunk';

export interface IWithdrawnEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IWithdrawnEventPalletSetup extends IBasePalletSetup {
  decoder: IWithdrawnEventPalletDecoder;
  storage: {
    currentEra: ICurrentEraStorageLoader;
  };
}

export class WithdrawnEventPalletHandler extends EventPalletHandler<IWithdrawnEventPalletSetup> {
  private storage: IWithdrawnEventPalletSetup['storage'];

  constructor(setup: IWithdrawnEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.storage = setup.storage;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const deferredStaker = ctx.store.defer(Staker, { id: stakerId, relations: { unlockings: true } });

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => deferredStaker.get() }),
      new LazyAction(block.header, event.extrinsic, async (ctx) => {
        const queue: Action[] = [];

        const currentEra = await this.storage.currentEra.load(block.header);

        if (!currentEra) return [];

        const staker = await deferredStaker.getOrFail();
        if (staker.unlockings) {
          const widrawable = staker.unlockings.filter((c) => c.lockedUntilEra <= currentEra);

          let chunkSum = 0n;

          for (const chunk of widrawable) {
            queue.push(new WithdrawUnlockChunkAction(block.header, event.extrinsic, { chunkId: chunk.id, value: chunk.amount }));

            chunkSum += chunk.amount;
          }

          if (staker.totalBonded <= 0n && staker.totalUnbonded <= 0n && staker.totalWithdrawn === chunkSum) {
            staker.role = StakingRole.Unknown;
          }
        }

        queue.push(new WithdrawnAction(block.header, event.extrinsic, { amount: data.amount, staker: staker }));

        return queue;
      })
    );
  }
}
