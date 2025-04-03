import { Account, XcmTransfer, XcmTransferBeneficiary, XcmTransferBeneficiaryKey, XcmTransferDestination } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';
import { IXcmDestination, IXcmTransferBeneficiary } from '@/indexer/pallets/xcm/calls/reserveTransferAssets';

interface XcmTransferActionData {
  id: string;
  destination: () => Promise<{ parachain: IXcmDestination['parachain']; parents: IXcmDestination['parents'] }>;
  //   destination: () => Promise<Parachain>;
  feeAssetItem: number;
  from: string;
  //   from: () => Promise<Account>;
  beneficiary: IXcmTransferBeneficiary;
}
export class XcmTransferAction extends Action<XcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const xcmDestination = await this.data.destination().catch();
    if (!xcmDestination) return;

    let xcmTransferDestination = new XcmTransferDestination({
      id: xcmDestination.parachain?.toString(),
      parachain: xcmDestination.parachain?.toString(),
      parents: xcmDestination.parents,
    });
    let xcmTransferBeneficiaryKey = new XcmTransferBeneficiaryKey({
      id: `${this.data.beneficiary.key.value}-key`,
      kind: this.data.beneficiary.key.kind,
      value: this.data.beneficiary.key.value,
    });

    await Promise.all([ctx.store.upsert(xcmTransferDestination), ctx.store.upsert(xcmTransferBeneficiaryKey)]);

    let xcmTransferBeneficiary = new XcmTransferBeneficiary({
      id: xcmTransferBeneficiaryKey.value,
      key: xcmTransferBeneficiaryKey,
      parents: this.data.beneficiary.parents,
    });
    await ctx.store.upsert(xcmTransferBeneficiary);

    let xcmTransfer = new XcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      from: this.data.from,
      feeAssetItem: this.data.feeAssetItem,
      destination: xcmTransferDestination,
      beneficiary: xcmTransferBeneficiary,
    });
    await ctx.store.insert(xcmTransfer);
  }
}
