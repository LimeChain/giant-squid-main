import { Account, Parachain, ParachainStatus } from '@/model';
import { Action, ActionContext } from '@/indexer/actions/base';

interface CreateParachainData {
  id: string;
  manager: () => Promise<Account>;
}

export class CreateParachainAction extends Action<CreateParachainData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const manager = await this.data.manager();

    const parachain = new Parachain({
      id: this.data.id,
      manager: manager,
      status: ParachainStatus.Reserved,
    });

    await ctx.store.insert(parachain);
  }
}

interface ChangeParachainStatusData {
  status: ParachainStatus;
  parachain: () => Promise<Parachain>;
}

export class ChangeParachainStatusAction extends Action<ChangeParachainStatusData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    const parachain = await this.data.parachain();

    parachain.status = this.data.status;

    await ctx.store.upsert(parachain);
  }
}
