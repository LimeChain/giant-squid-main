import { toHex } from '@subsquid/substrate-processor';
import { getOriginAccountId } from '@/utils';
import { Account, BondingType, Staker } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { ILedgerStorageLoader } from '@/indexer';

export interface IRebondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint }> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IRebondCallPalletDecoder;
  storage: {
    ledger: ILedgerStorageLoader;
  };
}

export class RebondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
  storage: IRebondCallPalletSetup['storage'];

  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.storage = setup.storage;
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const controllerId = this.encodeAddress(origin);
    const controller = ctx.store.defer(Account, controllerId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => controller.get(), id: controllerId, pk: this.decodeAddress(controllerId) }),
      new LazyAction(block.header, call.extrinsic, async () => {
        const queue: Action[] = [];

        const ledger = await this.storage.ledger.load(block.header, toHex(origin));

        if (!ledger) return [];

        const stashId = this.encodeAddress(ledger.stash);

        const stash = ctx.store.defer(Account, stashId);
        const staker = ctx.store.defer(Staker, { id: stashId });

        queue.push(
          new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
          new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() })
        );

        queue.push(
          new BondAction(block.header, call.extrinsic, {
            id: call.id,
            type: BondingType.Rebond,
            amount: data.amount,
            account: () => controller.getOrFail(),
            staker: () => staker.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
