import { Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { ChangeParachainStatusAction } from '@/indexer/actions/crowdloan/parachain';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface IDeregisteredParachainEventPalletDecoder extends IEventPalletDecoder<{ paraId: number }> {}

interface IDeregisteredParachainEventPalletSetup extends IBasePalletSetup {
  decoder: IDeregisteredParachainEventPalletDecoder;
}

export class DeregisteredParachainEventPalletHandler extends EventPalletHandler<IDeregisteredParachainEventPalletSetup> {
  constructor(setup: IDeregisteredParachainEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const parachain = ctx.store.defer(Parachain, data.paraId.toString());

    queue.push(
      new ChangeParachainStatusAction(block.header, event.extrinsic, {
        parachain: () => parachain.getOrFail(),
        status: ParachainStatus.Deregistered,
      })
    );
  }
}
