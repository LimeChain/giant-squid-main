import { Account, fromJsonVersionedMultiLocation, FullResult, Parachain, XcmTransaction } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface XcmTransferActionData {
  id: string;
  destination: () => void;
  //   destination: () => Promise<Parachain>;
  feeAssetItem: number;
  parents: number | null;
  //   from: () => Promise<Account>;
  result: any;
}
export class XcmTransferAction extends Action<XcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    // const parachain = await this.data.destination().catch(() => null);
    // if (!parachain) return;

    let transaction = new XcmTransaction({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      //   from: await this.data.from(),
      feeAssetItem: this.data.feeAssetItem,
      //   destination: parachain,
      parents: this.data.parents,
      fullResult: new FullResult({}, this.data.result),
    });
    await ctx.store.insert(transaction);
  }
}
