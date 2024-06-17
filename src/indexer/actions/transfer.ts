import { Account, NativeTransfer, Transfer, TransferDirection } from '../../model';
import { Action, ActionContext } from './base';

export interface TransferData {
  id: string;
  from: () => Promise<Account>;
  to: () => Promise<Account>;
  amount: bigint;
  success: boolean;
}

export class TransferAction extends Action<TransferData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let from = await this.data.from();
    let to = await this.data.to();

    let transfer = new NativeTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      from,
      to,
      amount: this.data.amount,
      success: this.data.success,
    });

    await ctx.store.insert(transfer);

    let transferFrom = new Transfer({
      id: transfer.id + '-from',
      transfer,
      account: from,
      direction: TransferDirection.From,
    });
    let transferTo = new Transfer({
      id: transfer.id + '-to',
      transfer,
      account: to,
      direction: TransferDirection.To,
    });
    await ctx.store.insert([transferFrom, transferTo]);
  }
}
