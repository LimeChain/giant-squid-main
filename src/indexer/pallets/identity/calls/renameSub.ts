import { unwrapData } from '@/utils';
import { IdentitySub } from '@/model';
import { RenameSubAction } from '@/indexer/actions/identity';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';

export interface IRenameSubCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> {}
interface IRenameSubCallPalletSetup extends IBasePalletSetup {
  decoder: IRenameSubCallPalletDecoder;
}

export class RenameSubCallPalletHandler extends CallPalletHandler<IRenameSubCallPalletSetup> {
  constructor(setup: IRenameSubCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const renameSubData = this.decoder.decode(call);

    const subId = this.encodeAddress(renameSubData.sub);

    const sub = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new RenameSubAction(block.header, call.extrinsic, {
        sub: () => sub.getOrFail(),
        name: unwrapData(renameSubData.data)!,
      })
    );
  }
}
