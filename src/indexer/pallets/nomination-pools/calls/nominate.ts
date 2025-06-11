// @ts-ignore
import { Pool, Account, HistoryElementType } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { NominatePoolAction } from '@/indexer/actions/nomination-pools/nominate';
import { EnsureAccount } from '@/indexer/actions';
import { HistoryElementAction } from '@/indexer/actions/historyElement';
import { getOriginAccountId } from '@/utils';

export interface INominationPoolsNominateCallPalletDecoder
  extends ICallPalletDecoder<{
    poolId: string;
    validators: string[];
  }> {}

interface INominationPoolsNominateCallPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsNominateCallPalletDecoder;
}

export class NominationPoolsNominateCallPalletHandler extends CallPalletHandler<INominationPoolsNominateCallPalletSetup> {
  constructor(setup: INominationPoolsNominateCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);
    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const pool = ctx.store.defer(Pool, data.poolId);
    const originId = this.encodeAddress(origin);
    const originAccount = ctx.store.defer(Account, originId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => originAccount.get(), id: originId, pk: this.decodeAddress(originId) }),
      new NominatePoolAction(block.header, call.extrinsic, {
        pool: () => pool.getOrFail(),
        validators: data.validators,
      }),
      new HistoryElementAction(block.header, call.extrinsic, {
        id: call.id,
        name: call.name,
        type: HistoryElementType.Extrinsic,
        account: () => originAccount.getOrFail(),
      })
    );
  }
}
