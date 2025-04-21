import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsurePool } from '@/indexer/actions/nomination-pools/pool';

export interface ISetMetadataCallPalletDecoder
  extends ICallPalletDecoder<{
    id: number;
    metadata: string;
  }> {}

interface ISetMetadataCallPalletSetup extends IBasePalletSetup {
  decoder: ISetMetadataCallPalletDecoder;
}

export class SetMetadataCallPalletHandler extends CallPalletHandler<ISetMetadataCallPalletSetup> {
  constructor(setup: ISetMetadataCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new EnsurePool(block.header, call.extrinsic, {
        id: data.id.toString(),
        name: data.metadata,
      })
    );
  }
}
