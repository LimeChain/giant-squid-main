import { Account, Staker } from '@/model';
import { EnsureAccount, EnsureStaker, UnBondAction } from '@/indexer/actions';
import { Action, LazyAction } from '@/indexer/actions/base';
import { UnlockChunkAction } from '@/indexer/actions/staking/unlock-chunk';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBondingDurationConstantGetter } from '@/indexer/pallets/staking/constants';
import { ICurrentEraStorageLoader } from '@/indexer/pallets/staking/storage';

export interface IUnBondedEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IUnBondedEventPalletSetup extends IBasePalletSetup {
  decoder: IUnBondedEventPalletDecoder;
  constants: {
    bondingDuration: IBondingDurationConstantGetter;
  };
  storage: {
    currentEra: ICurrentEraStorageLoader;
  };
}

export class UnBondedEventPalletHandler extends EventPalletHandler<IUnBondedEventPalletSetup> {
  private constants: IUnBondedEventPalletSetup['constants'];
  private storage: IUnBondedEventPalletSetup['storage'];

  constructor(setup: IUnBondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.constants = setup.constants;
    this.storage = setup.storage;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new UnBondAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      }),
      new LazyAction(block.header, event.extrinsic, async (ctx) => {
        const queue: Action[] = [];

        const bondingDuration = this.constants.bondingDuration.get(block.header);
        const currentEra = await this.storage.currentEra.load(block.header);

        if (!currentEra) return [];

        queue.push(
          new UnlockChunkAction(block.header, event.extrinsic, {
            id: event.id,
            amount: data.amount,
            lockedUntilEra: currentEra + bondingDuration,
            staker: () => staker.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
