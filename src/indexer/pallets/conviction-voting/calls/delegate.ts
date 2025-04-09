import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { DelegateConvictionVotingAction, EnsureAccount } from '@/indexer/actions';
import { decodeHex } from '@subsquid/substrate-processor';
import { getOriginAccountId } from '@/utils';
import { Account } from '@/model';

export interface IDelegateCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
    to: string | undefined;
    conviction: string;
    balance: bigint;
  }> {}

interface IDelegateCallPalletSetup extends IBasePalletSetup {
  decoder: IDelegateCallPalletDecoder;
}

export class DelegateCallPalletHandler extends CallPalletHandler<IDelegateCallPalletSetup> {
  constructor(setup: IDelegateCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    const fromOrigin = getOriginAccountId(call.origin);
    const fromId = fromOrigin ? this.encodeAddress(fromOrigin) : call.origin.value.value;
    const fromAccount = ctx.store.defer(Account, fromId);

    const toId = data.to ? this.encodeAddress(decodeHex(data.to)) : undefined;
    const toAccount = toId && ctx.store.defer(Account, toId);

    if (toAccount && toId) {
      queue.push(
        new EnsureAccount(block.header, call.extrinsic, {
          account: () => toAccount.get(),
          id: toId,
          pk: this.decodeAddress(toId),
        })
      );
    }

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => fromAccount.get(),
        id: fromId,
        pk: this.decodeAddress(fromId),
      }),
      new DelegateConvictionVotingAction(block.header, call.extrinsic, {
        id: call.id,
        extrinsicHash: call.extrinsic?.hash,
        from: () => fromAccount.getOrFail(),
        to: toAccount ? () => toAccount.getOrFail() : async () => undefined,
        class: data.class,
        conviction: data.conviction,
        balance: data.balance,
      })
    );
  }
}
