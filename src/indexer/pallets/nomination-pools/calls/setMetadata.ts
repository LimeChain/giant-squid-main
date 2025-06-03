//@ts-ignore
import { Pool } from '@/model';
import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UpdatePoolAction } from '@/indexer/actions';

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

    queue.push(
      new UpdatePoolAction(block.header, call.extrinsic, {
        pool: () => pool.getOrFail(),
        name: data.metadata,
      })
    );
  }
}
