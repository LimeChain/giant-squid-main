import { CrowdloanContributor, CrowdloanReimbursementType, Parachain } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { ReimburseCrowdloanAction } from '@/indexer/actions/crowdloan/reimburse';
import { MarkCrowdloanContributorAsReimbursedAction } from '@/indexer/actions/crowdloan/contributor';
import { buildContributorId, getActiveCrowdloan } from '../utils';

export interface IWithdrewEventPalletDecoder extends IEventPalletDecoder<{ paraId: number; account: string }> {}

interface IWithdrewEventPalletSetup extends IBasePalletSetup {
  decoder: IWithdrewEventPalletDecoder;
}

export class WithdrewEventPalletHandler extends EventPalletHandler<IWithdrewEventPalletSetup> {
  constructor(setup: IWithdrewEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const withdrew = this.decoder.decode(event);

    const parachainDef = ctx.store.defer(Parachain, { id: withdrew.paraId.toString(), relations: { crowdloans: true } });

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];

        const parachain = await parachainDef.getOrFail();
        const crowdloan = getActiveCrowdloan(parachain.crowdloans);

        if (!crowdloan) return [];

        const accountId = this.encodeAddress(withdrew.account);

        const contributorId = buildContributorId(accountId, crowdloan.id);
        const contributorDef = ctx.store.defer(CrowdloanContributor, contributorId);
        const contributor = await contributorDef.get();

        if (!contributor) {
          return [];
        }

        // Make sure the contributor hasn't been already refunded
        // There is a case where an account has been refunded and at the same time he has a withdraw extrinsic executed
        if (contributor.reimbursed) {
          return [];
        }

        queue.push(
          new MarkCrowdloanContributorAsReimbursedAction(block.header, event.extrinsic, {
            contributor: () => Promise.resolve(contributor),
          }),
          new ReimburseCrowdloanAction(block.header, event.extrinsic, {
            id: contributor.id,
            amount: contributor.totalContributed,
            type: CrowdloanReimbursementType.Withdraw,
            contributor: () => Promise.resolve(contributor),
            crowdloan: () => Promise.resolve(crowdloan),
          })
        );

        return queue;
      })
    );
  }
}
