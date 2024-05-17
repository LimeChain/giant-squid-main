import * as ss58 from '@subsquid/ss58'
import { Account } from '../model'
import { Action, ActionContext } from './base'
import { chain } from '../chain'

export interface AccountData {
    account: () => Promise<Account | undefined>
    id: string
}

export class EnsureAccount extends Action<AccountData> {
    protected async _perform(ctx: ActionContext): Promise<void> {
        let account = await this.data.account()
        if (account != null) return

        account = new Account({
            id: this.data.id,
            publicKey: ss58.codec(chain.config.name).decode(this.data.id),
        })

        await ctx.store.insert(account)
    }
}
