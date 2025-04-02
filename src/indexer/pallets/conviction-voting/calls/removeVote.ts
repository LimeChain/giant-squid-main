import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { RemoveVoteConvictionVotingAction } from '@/indexer/actions';

export interface IRemoveVoteCallPalletDecoder
  extends ICallPalletDecoder<{
    class?: number;
    index: number;
  }> {}

interface IRemoveVoteCallPalletSetup extends IBasePalletSetup {
  decoder: IRemoveVoteCallPalletDecoder;
}

export class RemoveVoteCallPalletHandler extends CallPalletHandler<IRemoveVoteCallPalletSetup> {
  constructor(setup: IRemoveVoteCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new RemoveVoteConvictionVotingAction(block.header, call.extrinsic, {
        class: data.class,
        index: data.index,
      })
    );
  }
}
