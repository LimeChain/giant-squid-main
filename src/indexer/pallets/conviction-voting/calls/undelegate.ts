import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, UndelegateConvictionVotingAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';
import { Account } from '@/model';

export interface IUndelegateCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
  }> {}

interface IUndelegateCallPalletSetup extends IBasePalletSetup {
  decoder: IUndelegateCallPalletDecoder;
}

export class UndelegateCallPalletHandler extends CallPalletHandler<IUndelegateCallPalletSetup> {
  constructor(setup: IUndelegateCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);
    const origin = getOriginAccountId(call.origin);
    if (!origin) return;

    let accountId: string;

    try {
      // Covers substrate based chains
      accountId = this.encodeAddress(origin);
    } catch (e) {
      // Workaround for evm parachains
      accountId = call.origin.value.value;
    }

    const account = ctx.store.defer(Account, accountId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => account.get(),
        id: accountId,
        pk: this.decodeAddress(accountId),
      }),
      new UndelegateConvictionVotingAction(block.header, call.extrinsic, {
        id: call.id,
        extrinsicHash: call.extrinsic?.hash,
        account: () => account.getOrFail(),
        class: data.class,
      })
    );
  }
}
