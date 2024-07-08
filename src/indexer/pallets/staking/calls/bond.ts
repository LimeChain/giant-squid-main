import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';

import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint; controller?: string }> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;

    const data = this.decoder.decode(call);

    console.log(data);
  }
}
