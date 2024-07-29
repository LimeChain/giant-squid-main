import { toHex } from '@subsquid/substrate-processor';
import { getOriginAccountId } from '@/utils';
import { Account, Staker } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EnsureAccount, EnsureStaker, UnBondAction } from '@/indexer/actions';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { IBondingDurationConstantGetter, ICurrentEraStorageLoader, ILedgerStorageLoader } from '@/indexer';
import { UnlockChunkAction } from '@/indexer/actions/staking/unlock-chunk';

export interface IUnbondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint }> {}

interface IUnbondCallPalletSetup extends IBasePalletSetup {
  decoder: IUnbondCallPalletDecoder;
  constants: {
    bondingDuration: IBondingDurationConstantGetter;
  };
  storage: {
    ledger: ILedgerStorageLoader;
    currentEra: ICurrentEraStorageLoader;
  };
}

export class UnbondCallPalletHandler extends CallPalletHandler<IUnbondCallPalletSetup> {
  storage: IUnbondCallPalletSetup['storage'];
  constants: IUnbondCallPalletSetup['constants'];

  constructor(setup: IUnbondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.storage = setup.storage;
    this.constants = setup.constants;
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const data = this.decoder.decode(call);

    queue.push(
      new LazyAction(block.header, call.extrinsic, async () => {
        const queue: Action[] = [];

        const ledger = await this.storage.ledger.load(block.header, toHex(origin));
        const bondingDuration = this.constants.bondingDuration.get(block.header);
        const currentEra = await this.storage.currentEra.load(block.header);

        if (!currentEra) return [];
        if (!ledger) return [];

        const stashId = this.encodeAddress(ledger.stash);
        const controllerId = this.encodeAddress(origin);

        const controllerDeferred = ctx.store.defer(Account, controllerId);
        const stashDeferred = ctx.store.defer(Account, stashId);
        const stakerDeferred = ctx.store.defer(Staker, { id: stashId });

        queue.push(
          new EnsureAccount(block.header, call.extrinsic, { account: () => controllerDeferred.get(), id: controllerId, pk: this.decodeAddress(controllerId) }),
          new EnsureAccount(block.header, call.extrinsic, { account: () => stashDeferred.get(), id: stashId, pk: this.decodeAddress(stashId) }),
          new EnsureStaker(block.header, call.extrinsic, { staker: () => stakerDeferred.get(), account: () => stashDeferred.getOrFail(), id: stashId }),
          new LazyAction(block.header, call.extrinsic, async () => {
            const queue: Action[] = [];

            const staker = await stakerDeferred.getOrFail();

            // Some unbond extrinsics are processed more than once in different blocks by the RPC providers, so we cannot rely blindly on the unbond data
            // We make sure the unbond amount is greater than the active bonded amount, otherwise we assume it is a duplicate extrinsic
            if (data.amount > staker.activeBonded) {
              return [];
            }

            queue.push(
              new UnBondAction(block.header, call.extrinsic, {
                id: call.id,
                amount: data.amount,
                account: () => controllerDeferred.getOrFail(),
                staker: () => stakerDeferred.getOrFail(),
              }),
              new UnlockChunkAction(block.header, call.extrinsic, {
                id: call.id,
                amount: data.amount,
                lockedUntilEra: currentEra + bondingDuration,
                staker: () => stakerDeferred.getOrFail(),
              })
            );
            return queue;
          })
        );

        return queue;
      })
    );
  }
}
