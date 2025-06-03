//@ts-ignore
import { Account, XTokensTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XTokensTransferActionData {
  id: string;
  account: () => Promise<Account>;
  call: string;
  to?: string;
  toChain?: string;
  assets?: (string | undefined)[][];
  amount?: (string | undefined)[];
}

export class XTokensTransferAction extends Action<XTokensTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new XTokensTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: await this.data.account(),
      to: this.data.to,
      toChain: this.data.toChain,
      amount: this.data.amount,
      assets: this.data.assets,
      call: this.data.call,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
