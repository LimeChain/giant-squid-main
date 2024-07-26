import { Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, ICallPalletDecoder } from '@/indexer/types';
import { CreateCrowdloanAction } from '@/indexer/actions/crowdloan/create';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { ChangeParachainStatusAction } from '@/indexer/actions/crowdloan/parachain';

export interface ICreateCallPalletDecoder extends ICallPalletDecoder<{ paraId: number; cap: bigint; end: number; firstPeriod: number; lastPeriod: number }> {}

interface ICreateCallPalletSetup extends IBasePalletSetup {
  decoder: ICreateCallPalletDecoder;
}

export class CreateCallPalletHandler extends CallPalletHandler<ICreateCallPalletSetup> {
  constructor(setup: ICreateCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const data = this.decoder.decode(call);

    const parachain = ctx.store.defer(Parachain, data.paraId.toString());

    queue.push(
      new CreateCrowdloanAction(block.header, call.extrinsic, {
        id: call.id,
        cap: data.cap,
        end: data.end,
        firstPeriod: data.firstPeriod,
        lastPeriod: data.lastPeriod,
        parachain: () => parachain.getOrFail(),
      }),
      new ChangeParachainStatusAction(block.header, call.extrinsic, {
        parachain: () => parachain.getOrFail(),
        status: ParachainStatus.Registered,
      })
    );
  }
}
