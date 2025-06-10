//@ts-ignore
import { Account, XcmTransfer, XcmTransferTo, XcmTransferAsset, XcmTransferAssetAmount } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XcmTransferActionData {
  id: string;
  account: () => Promise<Account>;
  toChain?: string | null;
  to?: {
    type: string;
    value: string | null;
  };
  amount?: { type: string; value: string | null };
  call: string;
  weightLimit?: bigint | null;
  contractCalled?: string | null;
  contractInput?: string | null;
  asset?: {
    parents?: number | null;
    pallet?: string | null;
    assetId?: string | null;
    parachain?: string | null;
    fullPath?: string[];
    error?: string | null;
  };
}

export class XcmTransferAction extends Action<XcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new XcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: await this.data.account(),
      to: new XcmTransferTo({ type: this.data.to?.type, value: this.data.to?.value }),
      toChain: this.data.toChain,
      amount: new XcmTransferAssetAmount({ type: this.data.amount?.type, value: this.data.amount?.value }),
      call: this.data.call,
      weightLimit: this.data.weightLimit,
      contractCalled: this.data.contractCalled,
      contractInput: this.data.contractInput,
      asset: new XcmTransferAsset({
        parents: this.data.asset?.parents,
        pallet: this.data.asset?.pallet,
        assetId: this.data.asset?.assetId,
        parachain: this.data.asset?.parachain,
        fullPath: this.data.asset?.fullPath,
      }),
    });

    await ctx.store.insert(xcmTransfer);
  }
}
