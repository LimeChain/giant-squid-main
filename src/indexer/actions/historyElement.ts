import { Account, HistoryElement, HistoryElementType, Staker } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface HistoryElementData {
  id: string;
  name: string;
  type: HistoryElementType;
  amount?: bigint;
  account: () => Promise<Account>;
}

export class HistoryElementAction extends Action<HistoryElementData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const account = await this.data.account();

    const bond = new HistoryElement({
      id: this.composeId(this.data.id, this.block.height),
      name: this.data.name,
      entityType: this.data.type,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: account,
      amount: this.data.amount,
    });

    await ctx.store.upsert(bond);
  }
}
