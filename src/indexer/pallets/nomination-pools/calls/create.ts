import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsurePool } from '@/indexer/actions/nomination-pools/pool';

export interface ICreatePollCallPalletDecoder
  extends ICallPalletDecoder<{
    amount: bigint;
    root: string;
    nominator: string;
    toggler: string;
  }> {}

interface ICreatePoolCallPalletSetup extends IBasePalletSetup {
  decoder: ICreatePollCallPalletDecoder;
}

let totalCalls = 0;

export class CreatePoolCallPalletHandler extends CallPalletHandler<ICreatePoolCallPalletSetup> {
  constructor(setup: ICreatePoolCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);
    totalCalls++;

    queue.push(
      new EnsurePool(block.header, call.extrinsic, {
        id: totalCalls.toString(),
        root: data.root,
        nominator: data.nominator,
        toggler: data.toggler,
        totalBonded: data.amount,
      })
    );
  }
}
