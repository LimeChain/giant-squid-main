import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UnlockConvictionVotingAction } from '@/indexer/actions';

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

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new UnlockConvictionVotingAction(block.header, call.extrinsic, {
        class: data.class,
        target: data.target,
      })
    );
  }
}
