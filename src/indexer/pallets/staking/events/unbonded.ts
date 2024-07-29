import { Account, Staker } from '@/model';
import { EnsureAccount, EnsureStaker, UnBondAction } from '@/indexer/actions';
import { Action, LazyAction } from '@/indexer/actions/base';
import { UnlockChunkAction } from '@/indexer/actions/staking/unlock-chunk';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBondingDurationConstantGetter } from '@/indexer/pallets/staking/constants';
import { ICurrentEraStorageLoader } from '@/indexer/pallets/staking/storage';
import { Call } from '@/indexer/processor';

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

  hasUnbondCall(call?: Call) {
    if (call?.name === 'Staking.unbond') {
      return true;
    }
    // It is a batch call, so check each call in the batch
    if (call?.args?.calls?.some((call: any) => call.__kind === 'Staking' && call.value.__kind === 'unbond')) {
      return true;
    }

    return false;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    // The event is containing an "unbond" call, so we leave it to the call handler
    if (this.hasUnbondCall(event.call)) return;

    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const accountDeferred = ctx.store.defer(Account, stakerId);
    const stakerDeferred = ctx.store.defer(Staker, stakerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => accountDeferred.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { staker: () => stakerDeferred.get(), account: () => accountDeferred.getOrFail(), id: stakerId }),
      new LazyAction(block.header, event.extrinsic, async (ctx) => {
        const queue: Action[] = [];

        const staker = await stakerDeferred.getOrFail();

        // Some unbond extrinsics are processed more than once in different blocks by the RPC providers, so we cannot rely blindly on the unbond data
        // We make sure the unbond amount is greater than the active bonded amount, otherwise we assume it is a duplicate extrinsic
        if (data.amount > staker.activeBonded) {
          return [];
        }

        const bondingDuration = this.constants.bondingDuration.get(block.header);
        const currentEra = await this.storage.currentEra.load(block.header);

        if (!currentEra) return [];

        queue.push(
          new UnBondAction(block.header, event.extrinsic, {
            id: event.id,
            amount: data.amount,
            account: () => accountDeferred.getOrFail(),
            staker: () => stakerDeferred.getOrFail(),
          }),
          new UnlockChunkAction(block.header, event.extrinsic, {
            id: event.id,
            amount: data.amount,
            lockedUntilEra: currentEra + bondingDuration,
            staker: () => stakerDeferred.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
