import { Account, StakingSlash } from '../../model';
import { Action, ActionContext } from './base';

interface SlashData {
  id: string;
  amount: bigint;
  account: () => Promise<Account>;
}

export class SlashAction extends Action<SlashData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();

    const slash = new StakingSlash({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      amount: this.data.amount,
    });

    await ctx.store.insert(slash);
  }
}
