import { IBasePalletSetup, ICallPalletDecoder, PayeeType } from '@/indexer/types';
import { IHandlerOptions, ICallHandlerParams } from '@/indexer/pallets/handler';
import { ILedgerStorageLoader } from '@/indexer';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, Staker } from '@/model';
import { Action, LazyAction } from '@/indexer/actions/base';
import { toHex } from '@subsquid/substrate-processor';
import { BasePayeeCallPallet } from '@/indexer/pallets/staking/calls/setPayee.base';

export interface ISetPayeeCallPalletData {
  controller?: string;
  payee: { type: PayeeType; account?: string };
}
export interface ISetPayeeCallPalletDecoder extends ICallPalletDecoder<ISetPayeeCallPalletData> {}

interface ISetPayeeCallPalletSetup extends IBasePalletSetup {
  decoder: ISetPayeeCallPalletDecoder;
  storage: {
    ledger: ILedgerStorageLoader;
  };
}

export class SetPayeeCallPalletHandler extends BasePayeeCallPallet<ISetPayeeCallPalletSetup> {
  storage: ISetPayeeCallPalletSetup['storage'];

  constructor(setup: ISetPayeeCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.storage = setup.storage;
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    queue.push(
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

        this.addPayee({ ctx, block, item: call, queue, data, staker, stash: ledger.stash });

        return queue;
      })
    );
  }
}
