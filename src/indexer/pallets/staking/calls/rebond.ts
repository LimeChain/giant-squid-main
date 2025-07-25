import { toHex } from '@subsquid/substrate-processor';
import { getOriginAccountId } from '@/utils';
// @ts-ignore
import { Account, BondingType, HistoryElementType, Staker } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { BondAction, EnsureAccount, EnsureStaker, HistoryElementAction } from '@/indexer/actions';
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

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const data = this.decoder.decode(call);
    const controllerId = this.encodeAddress(origin);
    const controller = ctx.store.defer(Account, controllerId);

    queue.push(
      new LazyAction(block.header, call.extrinsic, async () => {
        const queue: Action[] = [];

        const ledger = await this.storage.ledger.load(block.header, toHex(origin));

        if (!ledger) return [];

        const stashId = this.encodeAddress(ledger.stash);

        const stash = ctx.store.defer(Account, stashId);
        const staker = ctx.store.defer(Staker, { id: stashId });
        queue.push(
          new EnsureAccount(block.header, call.extrinsic, { account: () => controller.get(), id: controllerId, pk: this.decodeAddress(controllerId) }),
          new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
          new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() }),
          new BondAction(block.header, call.extrinsic, {
            id: call.id,
            type: BondingType.Rebond,
            amount: data.amount,
            account: () => controller.getOrFail(),
            staker: () => staker.getOrFail(),
          }),
          new HistoryElementAction(block.header, call.extrinsic, {
            id: call.id,
            name: call.name,
            amount: data.amount,
            type: HistoryElementType.Extrinsic,
            account: () => controller.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
