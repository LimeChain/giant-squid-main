import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { DelegateConvictionVotingAction } from '@/indexer/actions';

export interface IDelegateCallPalletDecoder
  extends ICallPalletDecoder<{
    class: number;
    to: string | undefined;
    conviction: string;
    balance: string;
  }> {}

interface IDelegateCallPalletSetup extends IBasePalletSetup {
  decoder: IDelegateCallPalletDecoder;
}

export class DelegateCallPalletHandler extends CallPalletHandler<IDelegateCallPalletSetup> {
  constructor(setup: IDelegateCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);

    queue.push(
      new DelegateConvictionVotingAction(block.header, call.extrinsic, {
        class: data.class,
        to: data.to,
        conviction: data.conviction,
        balance: data.balance,
      })
    );
  }
}
