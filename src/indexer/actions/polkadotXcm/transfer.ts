import { Account, PolkadotXcmTransfer, PolkadotXcmTransferCall } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface PolkadotXcmTransferActionData {
  id: string;
  account: () => Promise<Account>;
  toChain: string;
  to: string;
  amount: bigint;
  feeAssetItem: number;
  call: PolkadotXcmTransferCall;
  weightLimit: bigint | null;
}

export class PolkadotXcmTransferAction extends Action<PolkadotXcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new PolkadotXcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      feeAssetItem: this.data.feeAssetItem,
      account: await this.data.account(),
      to: this.data.to,
      toChain: this.data.toChain,
      amount: this.data.amount,
      call: this.data.call,
      weightLimit: this.data.weightLimit,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
