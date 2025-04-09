import { Account, Parachain, XcmTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

export enum XcmCall {
  LIMITED_RESEREVE_TRANSFER_ASSETS = 'limited_reserve_transfer_assets',
  RESEREVE_TRANSFER_ASSETS = 'reserve_transfer_assets',
}

interface XcmTransferActionData {
  id: string;
  from: () => Promise<Account>;
  toChain: () => Promise<Parachain | undefined>;
  to: string;
  amount: bigint;
  feeAssetItem: number;
  call: XcmCall;
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
      from: await this.data.from(),
      to: this.data.to,
      toChain: await this.data.toChain(),
      amount: this.data.amount,
      call: this.data.call,
      weightLimit: this.data.weightLimit,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
