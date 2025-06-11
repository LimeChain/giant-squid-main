//@ts-ignore
import { Pool, Account, HistoryElementType } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, HistoryElementAction, UpdatePoolAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';

export interface INominationPoolsSetMetadataCallPalletDecoder
  extends ICallPalletDecoder<{
    id: string;
    metadata: string;
  }> {}

interface INominationPoolsSetMetadataCallPalletSetup extends IBasePalletSetup {
  decoder: INominationPoolsSetMetadataCallPalletDecoder;
}

export class NominationPoolsSetMetadataCallPalletHandler extends CallPalletHandler<INominationPoolsSetMetadataCallPalletSetup> {
  constructor(setup: INominationPoolsSetMetadataCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const data = this.decoder.decode(call);
    const pool = ctx.store.defer(Pool, data.id);
    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const originId = this.encodeAddress(origin);
    const originAccount = ctx.store.defer(Account, originId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => originAccount.get(), id: originId, pk: this.decodeAddress(originId) }),
      new UpdatePoolAction(block.header, call.extrinsic, {
        pool: () => pool.getOrFail(),
        name: data.metadata,
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
