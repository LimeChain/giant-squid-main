import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { Account, CrowdloanContributor, Parachain } from '@/model';
import { EnsureAccount } from '@/indexer/actions';
import { ContributeCrowdloanAction } from '@/indexer/actions/crowdloan/contribute';
import { EnsureCrowdloanContributorAction } from '@/indexer/actions/crowdloan/contributor';
import { buildContributorId, getActiveCrowdloan } from '../utils';

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
        const crowdloan = getActiveCrowdloan(parachain.crowdloans);

        if (!crowdloan) return [];

        const contributorId = buildContributorId(accountId, crowdloan.id);
        const contributorDef = ctx.store.defer(CrowdloanContributor, contributorId);

        queue.push(
          new EnsureAccount(block.header, event.extrinsic, {
            id: accountId,
            pk: contributed.account,
            account: () => accountDef.get(),
          }),
          new EnsureCrowdloanContributorAction(block.header, event.extrinsic, {
            id: contributorId,
            account: () => accountDef.getOrFail(),
            crowdloan: () => Promise.resolve(crowdloan),
            contributor: () => contributorDef.get(),
          }),
          new ContributeCrowdloanAction(block.header, event.extrinsic, {
            id: event.id,
            amount: contributed.amount,
            contributor: () => contributorDef.getOrFail(),
            crowdloan: () => Promise.resolve(crowdloan),
          })
        );

        return queue;
      })
    );
  }
}
