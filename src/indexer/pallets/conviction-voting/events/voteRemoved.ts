import { EnsureAccount, RemoveVoteConvictionVotingAction } from '@/indexer/actions';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';

export interface IRemoveVoteCallPalletDecoder
  extends ICallPalletDecoder<{
    class?: number;
    index: number;
  }> {}
export interface IVoteRemovedEventPalletDecoder
  extends IEventPalletDecoder<{
    who: string;
    vote: {
      aye?: bigint;
      nay?: bigint;
      balance?: bigint;
      vote?: number;
      abstain?: bigint;
    };
  }> {}

interface IVoteRemovedEventPalletSetup extends IBasePalletSetup {
  removeVoteDecoder: IRemoveVoteCallPalletDecoder;
  decoder: IVoteRemovedEventPalletDecoder;
}

export class VoteRemovedEventPalletHandler extends EventPalletHandler<IVoteRemovedEventPalletSetup> {
  private removeVoteDecoder: IRemoveVoteCallPalletDecoder;

  constructor(setup: IVoteRemovedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.removeVoteDecoder = setup.removeVoteDecoder;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const whoId = this.encodeAddress(data.who);
    const whoAccount = ctx.store.defer(Account, whoId);
    let classNumber: number | undefined;
    let index: number | undefined;

    if (event.call?.name === 'ConvictionVoting.remove_vote') {
      const callData = this.removeVoteDecoder.decode(event.call);
      classNumber = callData.class;
      index = callData.index;
    }

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => whoAccount.get(),
        id: whoId,
        pk: data.who,
      }),

      new RemoveVoteConvictionVotingAction(block.header, event.extrinsic, {
        id: event.id,
        extrinsicHash: event.extrinsic?.hash,
        class: classNumber,
        index: index,
        who: () => whoAccount.getOrFail(),
        vote: data.vote,
      })
    );
  }
}
