import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { CreatePoolAction } from '@/indexer/actions/nomination-pools/pool';
import { getOriginAccountId } from '@/utils';
import { Account, Pool, Staker } from '@/model';
import { EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { NominatePoolAction } from '@/indexer/actions/nomination-pools/nominate';

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
    if (!data) return;
    const pool = ctx.store.defer(Pool, data.poolId);

    queue.push(
      new NominatePoolAction(block.header, call.extrinsic, {
        pool: () => pool.getOrFail(),
        validators: data.validators,
      })
    );
  }
}
