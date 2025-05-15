// @ts-ignore
import { Account, HistoryElementType, Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { DissolveCrowdloanAction } from '@/indexer/actions/crowdloan/dissolve';
import { ChangeParachainStatusAction } from '@/indexer/actions/crowdloan/parachain';
import { getActiveCrowdloan } from '../utils';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';

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
        const crowdloan = getActiveCrowdloan(parachain.crowdloans);

        if (!crowdloan) return [];

        const origin = getOriginAccountId(event.call?.origin);

        if (!origin) return [];

        const accountId = this.encodeAddress(origin);
        const account = ctx.store.defer(Account, accountId);

        queue.push(
          new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
          new DissolveCrowdloanAction(block.header, event.extrinsic, {
            crowdloan: () => Promise.resolve(crowdloan),
          }),
          new ChangeParachainStatusAction(block.header, event.extrinsic, {
            parachain: () => Promise.resolve(parachain),
            status: ParachainStatus.Dissolved,
          }),
          new HistoryElementAction(block.header, event.extrinsic, {
            id: event.id,
            name: event.name,
            type: HistoryElementType.Event,
            account: () => account.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
