// @ts-ignore
import { Account, Staker, StakingController } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export interface AddControllerData {
  id: string;
  staker: () => Promise<Staker>;
  controller: () => Promise<Account>;
}

export class AddControllerAction extends Action<AddControllerData> {
  async _perform(ctx: ActionContext): Promise<void> {
    const staker = await this.data.staker();
    const controller = await this.data.controller();

    const payee = new StakingController({
      id: this.data.id,
      staker,
      controller,
      blockNumber: this.block.height,
      extrinsicHash: this.extrinsic?.hash,
      timestamp: new Date(this.block.timestamp ?? 0),
    });

    staker.controller = controller;

    await ctx.store.insert(payee);
    await ctx.store.upsert(staker);
  }
}
