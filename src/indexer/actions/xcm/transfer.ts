import { Account, Parachain, XcmTransfer, XcmTransferCall } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XcmTransferActionData {
  id: string;
  account: () => Promise<Account>;
  toChain: () => Promise<Parachain | undefined>;
  to: string;
  amount: bigint;
  feeAssetItem: number;
  call: XcmTransferCall;
  weightLimit: bigint | null;
}

export class XcmTransferAction extends Action<XcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new XcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      feeAssetItem: this.data.feeAssetItem,
      account: await this.data.account(),
      to: this.data.to,
      toChain: await this.data.toChain(),
      amount: this.data.amount,
      call: this.data.call,
      weightLimit: this.data.weightLimit,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
