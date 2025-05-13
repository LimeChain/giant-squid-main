import { Account, HistoryElementType, Pool, Staker } from '@/model';
import { EnsureAccount, EnsureStaker, HistoryElementAction, NominationPoolsBondAction } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Call } from '@/indexer/processor';

export interface INominationPoolsBondedEventPalletDecoder extends IEventPalletDecoder<{ member: string; poolId: string; bonded: bigint; joined: boolean }> {}

interface INominationPoolsBondedEventPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsBondedEventPalletDecoder;
}

export class NominationPoolsBondedEventPalletHandler extends EventPalletHandler<INominationPoolsBondedEventPalletSetup> {
  constructor(setup: INominationPoolsBondedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  hasBondCall(call?: Call) {
    switch (call?.name) {
      case 'NominationPools.join':
      case 'NominationPools.bond_extra':
      case 'NominationPools.bond_extra_other':
        return true;
    }

    // It is a batch call, so check each call in the batch
    if (call?.args?.calls) {
      for (const batchCall of call.args.calls) {
        if (batchCall.__kind === 'NominationPools') {
          switch (batchCall.value.__kind) {
            case 'join':
            case 'bond_extra':
            case 'bond_extra_other':
              return true;
          }
        }
      }
    }

    return false;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    if (!this.hasBondCall(event.call)) {
      return;
    }

    const data = this.decoder.decode(event);

    const poolId = data.poolId;
    const accountId = this.encodeAddress(data.member);

    const account = ctx.store.defer(Account, accountId);
    const staker = ctx.store.defer(Staker, accountId);
    const pool = ctx.store.defer(Pool, poolId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new EnsureStaker(block.header, event.extrinsic, { id: accountId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new NominationPoolsBondAction(block.header, event.extrinsic, {
        id: event.id,
        type: event.call?.name.split('.')[1] ?? 'unknown',
        amount: data.bonded,
        staker: () => staker.getOrFail(),
        pool: () => pool.getOrFail(),
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        amount: data.bonded,
        account: () => account.getOrFail(),
      })
    );
  }
}
