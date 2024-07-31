import { CrowdloanContributor, CrowdloanReimbursementType, Parachain } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { IRemoveKeysLimitConstantGetter } from '../constants';
import { MarkCrowdloanContributorAsReimbursedAction } from '@/indexer/actions/crowdloan/contributor';
import { ReimburseCrowdloanAction } from '@/indexer/actions/crowdloan/reimburse';
import { getActiveCrowdloan } from '../utils';

export interface IPartiallyRefundedEventPalletDecoder extends IEventPalletDecoder<{ paraId: number }> {}

interface IPartiallyRefundedEventPalletSetup extends IBasePalletSetup {
  decoder: IPartiallyRefundedEventPalletDecoder;
  constants: {
    removeKeysLimit: IRemoveKeysLimitConstantGetter;
  };
}

export class PartiallyRefundedEventPalletHandler extends EventPalletHandler<IPartiallyRefundedEventPalletSetup> {
  private constants: IPartiallyRefundedEventPalletSetup['constants'];

  constructor(setup: IPartiallyRefundedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.constants = setup.constants;
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const partiallyRefunded = this.decoder.decode(event);

    const parachainDef = ctx.store.defer(Parachain, { id: partiallyRefunded.paraId.toString(), relations: { crowdloans: true } });

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];

        const parachain = await parachainDef.getOrFail();
        const crowdloan = getActiveCrowdloan(parachain.crowdloans);

        if (!crowdloan) return [];

        const contributorsRefundLimit = this.constants.removeKeysLimit.get(block.header);
        const contributors = await ctx.store.find(CrowdloanContributor, {
          where: { crowdloan: { id: crowdloan.id }, reimbursed: false },
          order: { blockNumber: 'ASC' },
          take: contributorsRefundLimit,
        });

        for (const { id: contributorId } of contributors) {
          // Using the local cached version of the contributor to avoid duplicate queries
          // When syncing, the indexer is processing multiple blocks at once, so the same contributor might have already withdrawn their funds in a previous block
          const contributorDef = ctx.store.defer(CrowdloanContributor, contributorId);
          const contributor = await contributorDef.getOrFail();

          queue.push(
            new MarkCrowdloanContributorAsReimbursedAction(block.header, event.extrinsic, {
              contributor: () => Promise.resolve(contributor),
            }),
            new ReimburseCrowdloanAction(block.header, event.extrinsic, {
              id: contributor.id,
              amount: contributor.totalContributed,
              type: CrowdloanReimbursementType.Refund,
              contributor: () => Promise.resolve(contributor),
              crowdloan: () => Promise.resolve(crowdloan),
            })
          );
        }

        return queue;
      })
    );
  }
}
