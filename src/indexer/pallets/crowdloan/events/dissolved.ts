import { Crowdloan } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { DissolveCrowdloanAction } from '@/indexer/actions/crowdloan.ts/dissolve';

export interface IDissolvedEventPalletDecoder extends IEventPalletDecoder<{ paraId: number }> {}

interface IDissolvedEventPalletSetup extends IBasePalletSetup {
  decoder: IDissolvedEventPalletDecoder;
}

export class DissolvedEventPalletHandler extends EventPalletHandler<IDissolvedEventPalletSetup> {
  private counter = 0;
  constructor(setup: IDissolvedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const dissolved = this.decoder.decode(event);

    const fund = ctx.store.defer(Crowdloan, dissolved.paraId.toString());

    this.counter++;

    console.log('total dissolved', this.counter);

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];

        const crowdloan = await fund.get();

        // Sometimes a dissolved event is emitted on a registered only crowdloans.
        // That means, the crowdloan has never been created, so we should ignore it.
        if (!crowdloan) return [];

        // TODO: Refund all contributors

        queue.push(
          new DissolveCrowdloanAction(block.header, event.extrinsic, {
            crowdloan: () => Promise.resolve(crowdloan),
          })
        );

        return queue;
      })
    );
  }
}
