import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { DelegateConvictionVotingAction, EnsureAccount } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';
import { Account } from '@/model';
import { DeferredEntity } from '@belopash/typeorm-store/lib/store';

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
    const origin = getOriginAccountId(call.origin);
    if (!origin) return;

    let fromId: string;
    let toAccount: DeferredEntity<Account>;

    try {
      // Covers substrate based chains
      fromId = this.encodeAddress(origin);
    } catch (e) {
      // Workaround for evm parachains
      fromId = call.origin.value.value;
    }
    const fromAccount = ctx.store.defer(Account, fromId);

    if (data.to) {
      let toId: string;

      try {
        // Covers substrate based chains
        toId = this.encodeAddress(data.to);
      } catch (e) {
        // Workaround for evm parachains
        toId = data.to;
      }

      toAccount = ctx.store.defer(Account, toId);

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
        to: () => toAccount?.get(),
        class: data.class,
        conviction: data.conviction,
        balance: data.balance,
      })
    );
  }
}
