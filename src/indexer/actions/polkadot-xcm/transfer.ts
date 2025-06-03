//@ts-ignore
import { Account, PolkadotXcmTransfer } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface PolkadotXcmTransferActionData {
  id: string;
  account: () => Promise<Account>;
  toChain?: string | null;
  to?: string | null;
  amount?: bigint | null;
  call: string;
  weightLimit?: bigint | null;
  contractCalled?: string | null;
  contractInput?: string | null;
}

export class PolkadotXcmTransferAction extends Action<PolkadotXcmTransferActionData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let xcmTransfer = new PolkadotXcmTransfer({
      id: this.data.id,
      blockNumber: this.block.height,
      timestamp: new Date(this.block.timestamp ?? 0),
      extrinsicHash: this.extrinsic?.hash,
      account: await this.data.account(),
      to: this.data.to,
      toChain: this.data.toChain,
      amount: this.data.amount,
      call: this.data.call,
      weightLimit: this.data.weightLimit,
      contractCalled: this.data.contractCalled,
      contractInput: this.data.contractInput,
    });

    await ctx.store.insert(xcmTransfer);
  }
}
