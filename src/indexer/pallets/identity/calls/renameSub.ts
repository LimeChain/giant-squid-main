import { getOriginAccountId, unwrapData } from '@/utils';
// @ts-ignore
import { Account, HistoryElementType, IdentitySub } from '@/model';
import { RenameSubAction } from '@/indexer/actions/identity';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';

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
    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const originId = this.encodeAddress(origin);
    const originAccount = ctx.store.defer(Account, originId);

    const subId = this.encodeAddress(renameSubData.sub);
    const sub = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => originAccount.get(),
        id: originId,
        pk: originId,
      }),
      new RenameSubAction(block.header, call.extrinsic, {
        sub: () => sub.getOrFail(),
        name: unwrapData(renameSubData.data)!,
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
