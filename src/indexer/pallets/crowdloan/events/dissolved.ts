import { Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { DissolveCrowdloanAction } from '@/indexer/actions/crowdloan.ts/dissolve';
import { ChangeParachainStatusAction } from '@/indexer/actions/crowdloan.ts/parachain';

export interface IDissolvedEventPalletDecoder extends IEventPalletDecoder<{ paraId: number }> {}

interface IDissolvedEventPalletSetup extends IBasePalletSetup {
  decoder: IDissolvedEventPalletDecoder;
}

export class DissolvedEventPalletHandler extends EventPalletHandler<IDissolvedEventPalletSetup> {
  constructor(setup: IDissolvedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const dissolved = this.decoder.decode(event);

    const parachainDef = ctx.store.defer(Parachain, { id: dissolved.paraId.toString(), relations: { crowdloans: true } });

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];

        const parachain = await parachainDef.getOrFail();

        if (parachain.crowdloans.length === 0) {
          return [];
        }

        const latestCrowdloan = parachain.crowdloans.sort((a, b) => b.startBlock - a.startBlock)[0];

        queue.push(
          new DissolveCrowdloanAction(block.header, event.extrinsic, {
            crowdloan: () => Promise.resolve(latestCrowdloan),
          }),
          new ChangeParachainStatusAction(block.header, event.extrinsic, {
            parachain: () => Promise.resolve(parachain),
            status: ParachainStatus.Dissolved,
          })
        );

        return queue;
      })
    );
  }
}
