import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { Account, Parachain } from '@/model';
import { EnsureAccount } from '@/indexer/actions';
import { ContributeCrowdloanAction, IncreaseCrowdloanRaisedFundsAction } from '@/indexer/actions/crowdloan.ts/contribute';

export interface IContributedEventPalletDecoder extends IEventPalletDecoder<{ paraId: number; account: string; amount: bigint }> {}

interface IContributedEventPalletSetup extends IBasePalletSetup {
  decoder: IContributedEventPalletDecoder;
}

export class ContributedEventPalletHandler extends EventPalletHandler<IContributedEventPalletSetup> {
  constructor(setup: IContributedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const contributed = this.decoder.decode(event);

    const accountId = this.encodeAddress(contributed.account);

    const accountDef = ctx.store.defer(Account, accountId);
    const parachainDef = ctx.store.defer(Parachain, { id: contributed.paraId.toString(), relations: { crowdloans: true } });

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];

        const parachain = await parachainDef.getOrFail();

        if (parachain.crowdloans.length === 0) return [];

        const latestCrowdloan = parachain.crowdloans.sort((a, b) => b.startBlock - a.startBlock)[0];

        queue.push(
          new EnsureAccount(block.header, event.extrinsic, {
            id: accountId,
            pk: contributed.account,
            account: () => accountDef.get(),
          }),
          new ContributeCrowdloanAction(block.header, event.extrinsic, {
            id: event.id,
            amount: contributed.amount,
            account: () => accountDef.getOrFail(),
            crowdloan: () => Promise.resolve(latestCrowdloan),
          }),
          new IncreaseCrowdloanRaisedFundsAction(block.header, event.extrinsic, {
            amount: contributed.amount,
            crowdloan: () => Promise.resolve(latestCrowdloan),
          })
        );

        return queue;
      })
    );
  }
}
