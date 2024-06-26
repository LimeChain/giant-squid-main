import { Account } from '../../model';
import { Action, ActionContext } from './base';
import { decodeAddress } from '../../utils';

export interface AccountData {
  account: () => Promise<Account | undefined>;
  id: string;
}

export class EnsureAccount extends Action<AccountData> {
  protected async _perform(ctx: ActionContext): Promise<void> {
    let account = await this.data.account();
    if (account != null) return;

    account = new Account({
      id: this.data.id,
      publicKey: decodeAddress(this.data.id),
    });

    await ctx.store.insert(account);
  }
}
