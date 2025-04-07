import { EnsureAccount, VoteConvictionVotingAction } from '@/indexer/actions';
import { IBasePalletSetup, ICallPalletDecoder, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Account } from '@/model';

export interface IVoteCallPalletDecoder
  extends ICallPalletDecoder<{
    pollIndex: number;
    vote: {
      aye?: bigint;
      nay?: bigint;
      balance?: bigint;
      vote?: number;
      abstain?: bigint;
    };
  }> {}
export interface IVotedEventPalletDecoder extends IEventPalletDecoder<{ who: string }> {}

interface IVotedEventPalletSetup extends IBasePalletSetup {
  voteDecoder: IVoteCallPalletDecoder;
  decoder: IVotedEventPalletDecoder;
}

export class VotedEventPalletHandler extends EventPalletHandler<IVotedEventPalletSetup> {
  private voteDecoder: IVoteCallPalletDecoder;

  constructor(setup: IVotedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.voteDecoder = setup.voteDecoder;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const whoId = this.encodeAddress(data.who);
    const whoAccount = ctx.store.defer(Account, whoId);

    let pollIndex: number | undefined;
    let vote;

    if (event.call?.name === 'ConvictionVoting.vote') {
      const callData = this.voteDecoder.decode(event.call);

      pollIndex = callData.pollIndex;
      vote = callData.vote;
    }

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => whoAccount.get(),
        id: whoId,
        pk: data.who,
      }),

      new VoteConvictionVotingAction(block.header, event.extrinsic, {
        id: event.id,
        extrinsicHash: event.extrinsic?.hash,
        who: () => whoAccount.getOrFail(),
        pollIndex,
        vote: vote ?? {},
      })
    );
  }
}
