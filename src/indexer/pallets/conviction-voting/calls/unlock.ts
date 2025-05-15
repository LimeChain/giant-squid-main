import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, HistoryElementAction, UnlockConvictionVotingAction } from '@/indexer/actions';
import { Account, HistoryElementType } from '@/model';
import { getOriginAccountId } from '@/utils';

export interface IUnlockCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
    target: string | undefined;
  }> {}

interface IUnlockCallPalletSetup {
  decoder: IUnlockCallPalletDecoder;
}

export class UnlockCallPalletHandler extends CallPalletHandler<IUnlockCallPalletSetup> {
  constructor(setup: IUnlockCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);
    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const originId = this.encodeAddress(origin);
    const originAccount = ctx.store.defer(Account, originId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, { account: () => originAccount.get(), id: originId, pk: this.decodeAddress(originId) }),
      new UnlockConvictionVotingAction(block.header, call.extrinsic, {
        id: call.id,
        class: data.class,
        target: data.target,
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
