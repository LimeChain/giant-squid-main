import { Account, Staker } from '@/model';
import { EnsureAccount, UnBondAction } from '@/indexer/actions';
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
  private bondingDurationCache: number | undefined;

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
      new UnBondAction(block.header, event.extrinsic, {
        id: event.id,
        amount: data.amount,
        account: () => account.getOrFail(),
        staker: () => staker.getOrFail(),
      }),
      new LazyAction(block.header, event.extrinsic, async (ctx) => {
        const queue: Action[] = [];

        if (!this.bondingDurationCache) {
          const bondingDuration = this.constants.bondingDuration.get(block.header);
          this.bondingDurationCache = bondingDuration;
        }

        const currentEra = await this.storage.currentEra.load(block.header);

        if (!currentEra) return [];

        const stakerDef = await staker.getOrFail();

        queue.push(
          new UnlockChunkAction(block.header, event.extrinsic, {
            id: event.id,
            amount: data.amount,
            lockedUntilEra: currentEra + this.bondingDurationCache,
            staker: () => Promise.resolve(stakerDef),
          })
        );

        return queue;
      })
    );
  }
}
