import { Account, RewardDestination, Staker, StakingPayee } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface AddPayeeData {
  id: string;
  type: RewardDestination;
  staker: () => Promise<Staker>;
  account?: () => Promise<Account> | undefined;
}

export class AddPayeeAction extends Action<AddPayeeData> {
  async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const account = this.data.account ? await this.data.account() : null;

    const payee = new StakingPayee({
      id: this.data.id,
      type: this.data.type,
      account,
      staker,
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    staker.payee = payee;

    await ctx.store.insert(payee);
    await ctx.store.upsert(staker);
  }
}
