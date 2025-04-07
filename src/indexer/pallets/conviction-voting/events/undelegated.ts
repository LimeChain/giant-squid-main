import { EnsureAccount, UndelegateConvictionVotingAction } from '@/indexer/actions';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';

export interface IUndelegateCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
  }> {}
export interface IUndelegatedEventPalletDecoder extends IEventPalletDecoder<{ accountId: string }> {}

interface IUndelegatedEventPalletSetup extends IBasePalletSetup {
  undelegateDecoder: IUndelegateCallPalletDecoder;
  decoder: IUndelegatedEventPalletDecoder;
}

export class UndelegatedEventPalletHandler extends EventPalletHandler<IUndelegatedEventPalletSetup> {
  private undelegateDecoder: IUndelegateCallPalletDecoder;

  constructor(setup: IUndelegatedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
    this.undelegateDecoder = setup.undelegateDecoder;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const accountId = this.encodeAddress(data.accountId);
    const account = ctx.store.defer(Account, accountId);
    let classNumber: number | undefined;

    if (event.call?.name === 'ConvictionVoting.undelegate') {
      const callData = this.undelegateDecoder.decode(event.call);
      classNumber = callData.class;
    }

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => account.get(),
        id: accountId,
        pk: data.accountId,
      }),

      new UndelegateConvictionVotingAction(block.header, event.extrinsic, {
        id: event.id,
        extrinsicHash: event.extrinsic?.hash,
        class: classNumber,
        account: () => account.getOrFail(),
      })
    );
  }
}
