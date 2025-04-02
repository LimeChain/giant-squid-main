import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { UndelegateConvictionVotingAction } from '@/indexer/actions';

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

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new UndelegateConvictionVotingAction(block.header, call.extrinsic, {
        class: data.class,
      })
    );
  }
}
