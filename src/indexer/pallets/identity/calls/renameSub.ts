import { Action } from '../../../actions/base';
import { RenameSubAction } from '../../../actions/identity';
import { IdentitySub } from '../../../../model';
import { Block, Call, ProcessorContext } from '../../../../processor';
import { unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { IIdentityRenameSubCallPalletDecoder } from '../../../registry';

export class IdentityRenameSubCallPalletHandler extends PalletCallHandler<IIdentityRenameSubCallPalletDecoder> {
  constructor(decoder: IIdentityRenameSubCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

    if (!call.success) return;

    const renameSubData = this.decoder.decode(call);

    const subId = this.encodeAddress(renameSubData.sub);

    const sub = params.ctx.store.defer(IdentitySub, subId);

    params.queue.push(
      new RenameSubAction(params.block.header, call.extrinsic, {
        sub: () => sub.getOrFail(),
        name: unwrapData(renameSubData.data)!,
      })
    );
  }
}
