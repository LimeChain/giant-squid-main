import { DelegateConvictionVotingAction, EnsureAccount } from '@/indexer/actions';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';

export interface IDelegateCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
    conviction: string;
    balance: bigint;
  }> {}

export interface IDelegatedEventPalletDecoder extends IEventPalletDecoder<{ from: string; to: string }> {}

interface IDelegatedEventPalletSetup extends IBasePalletSetup {
  delegateDecoder: IDelegateCallPalletDecoder;
  decoder: IDelegatedEventPalletDecoder;
}

export class DelegatedEventPalletHandler extends EventPalletHandler<IDelegatedEventPalletSetup> {
  private delegateDecoder: IDelegateCallPalletDecoder;

  constructor(setup: IDelegatedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.delegateDecoder = setup.delegateDecoder;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const toId = this.encodeAddress(data.to);
    const fromId = this.encodeAddress(data.from);
    const fromAccount = ctx.store.defer(Account, fromId);
    const toAccount = ctx.store.defer(Account, toId);

    let classNumber: number | undefined;
    let conviction: string | undefined;
    let balance: bigint | undefined;

    if (event.call?.name === 'ConvictionVoting.delegate') {
      const callData = this.delegateDecoder.decode(event.call);

      classNumber = callData.class;
      conviction = callData.conviction;
      balance = callData.balance;
    }

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => toAccount.get(),
        id: toId,
        pk: data.to,
      }),
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => fromAccount.get(),
        id: fromId,
        pk: data.from,
      }),
      new DelegateConvictionVotingAction(block.header, event.extrinsic, {
        id: event.id,
        extrinsicHash: event.extrinsic?.hash,
        from: () => fromAccount.getOrFail(),
        to: () => toAccount.getOrFail(),
        class: classNumber,
        conviction,
        balance,
      })
    );
  }
}
