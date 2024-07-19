import { IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams } from '@/indexer/pallets/handler';
import { EnsureAccount, AddPayeeAction } from '@/indexer/actions';
import { Account, Staker, RewardDestination } from '@/model';
import { DeferredEntity } from '@belopash/typeorm-store/lib/store';
import { ISetPayeeCallPalletData } from '@/indexer/pallets/staking/calls/setPayee';

export abstract class BasePayeeCallPallet<T extends IBasePalletSetup> extends CallPalletHandler<T> {
  protected addPayee({
    ctx,
    block,
    item: call,
    queue,
    data,
    stash,
    staker,
  }: { stash: string; staker: DeferredEntity<Staker>; data: ISetPayeeCallPalletData } & ICallHandlerParams) {
    let payeeId: string | undefined;
    let payee: DeferredEntity<Account> | undefined;
    let type = RewardDestination.None;

    switch (data.payee.type) {
      case 'Staked':
        type = RewardDestination.Staked;
        payeeId = stash;
        break;
      case 'Stash':
        type = RewardDestination.Stash;
        payeeId = stash;
        break;
      case 'Controller':
        type = RewardDestination.Controller;
        payeeId = data.controller || stash;
        break;
      case 'Account':
        type = RewardDestination.Account;
        payeeId = data.payee.account;
      default:
        type = RewardDestination.None;
        payeeId = undefined;
        break;
    }

    if (payeeId) {
      payeeId = this.encodeAddress(payeeId);
      payee = ctx.store.defer(Account, payeeId);

      queue.push(new EnsureAccount(block.header, call.extrinsic, { account: () => payee!.get(), id: payeeId, pk: this.decodeAddress(payeeId) }));
    }

    queue.push(
      new AddPayeeAction(block.header, call.extrinsic, {
        id: call.id,
        type: type,
        staker: () => staker.getOrFail(),
        account: payee ? () => payee!.getOrFail() : undefined,
      })
    );
  }
}
