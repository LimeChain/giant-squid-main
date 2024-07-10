import { IBasePalletSetup, ICallPalletDecoder } from '@/indexer/types';
import { CallPalletHandler, IHandlerOptions, ICallHandlerParams } from '@/indexer/pallets/handler';
import { ILedgerStorageLoader } from '@/indexer';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, RewardDestination, Staker } from '@/model';
import { Action, LazyAction } from '@/indexer/actions/base';
import { toHex } from '@subsquid/substrate-processor';
import { SetPayeeAction } from '@/indexer/actions/staking/payee';

export interface ISetPayeeCallPalletDecoder extends ICallPalletDecoder<{ payee: { type: string; account?: string } }> {}

interface ISetPayeeCallPalletSetup extends IBasePalletSetup {
  decoder: ISetPayeeCallPalletDecoder;
  storage: {
    ledger: ILedgerStorageLoader;
  };
}

export class SetPayeeCallPalletHandler extends CallPalletHandler<ISetPayeeCallPalletSetup> {
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

        if (data.payee.account) {
          const payeeId = this.encodeAddress(data.payee.account);
          const payee = ctx.store.defer(Account, payeeId);

          queue.push(
            new EnsureAccount(block.header, call.extrinsic, { account: () => payee.get(), id: payeeId, pk: this.decodeAddress(payeeId) }),
            new SetPayeeAction(block.header, call.extrinsic, {
              staker: () => staker.getOrFail(),
              payeeType: data.payee.type as RewardDestination,
              account: () => payee.getOrFail(),
            })
          );
        } else {
          queue.push(
            new SetPayeeAction(block.header, call.extrinsic, {
              staker: () => staker.getOrFail(),
              payeeType: data.payee.type as RewardDestination,
            })
          );
        }

        return queue;
      })
    );
  }
}
