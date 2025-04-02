import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { VoteConvictionVotingAction } from '@/indexer/actions';

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

interface IVoteCallPalletSetup {
  decoder: IVoteCallPalletDecoder;
}

export class VoteCallPalletHandler extends CallPalletHandler<IVoteCallPalletSetup> {
  constructor(setup: IVoteCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new VoteConvictionVotingAction(block.header, call.extrinsic, {
        pollIndex: data.pollIndex,
        vote: data.vote,
      })
    );
  }
}
