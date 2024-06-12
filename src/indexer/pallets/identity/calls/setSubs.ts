import { Block, Call } from '../../../../processor';
import { EnsureAccount } from '../../../../action';
import { Action } from '../../../../action/base';
import { EnsureIdentityAction, EnsureIdentitySubAction, AddIdentitySubAction, RenameSubAction } from '../../../../action/identity';
import { Identity, Account, IdentitySub } from '../../../../model';
import { ProcessorContext } from '../../../../processor';
import { getOriginAccountId, unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { IIdentitySetSubsCallPalletDecoder } from '../../../registry';

export class IdentitySetSubsCallPalletHandler extends PalletCallHandler<IIdentitySetSubsCallPalletDecoder> {
  constructor(decoder: IIdentitySetSubsCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

    if (!call.success) return;

    const setSubsData = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;
    const identityId = this.encodeAddress(origin);
    const identity = params.ctx.store.defer(Identity, identityId);
    const identityAccount = params.ctx.store.defer(Account, identityId);

    for (const subData of setSubsData.subs) {
      const subId = this.encodeAddress(subData[0]);
      const subIdentity = params.ctx.store.defer(IdentitySub, subId);
      const subIdentityAccount = params.ctx.store.defer(Account, subId);

      params.queue.push(
        new EnsureAccount(params.block.header, call.extrinsic, {
          account: () => subIdentityAccount.get(),
          id: subId,
        }),
        new EnsureAccount(params.block.header, call.extrinsic, {
          account: () => identityAccount.get(),
          id: identityId,
        }),
        new EnsureIdentityAction(params.block.header, call.extrinsic, {
          identity: () => identity.get(),
          account: () => identityAccount.getOrFail(),
          id: identityId,
        }),
        new EnsureIdentitySubAction(params.block.header, call.extrinsic, {
          sub: () => subIdentity.get(),
          account: () => subIdentityAccount.getOrFail(),
          id: subId,
        }),
        new AddIdentitySubAction(params.block.header, call.extrinsic, {
          identity: () => identity.getOrFail(),
          sub: () => subIdentity.getOrFail(),
        }),
        new RenameSubAction(params.block.header, call.extrinsic, {
          sub: () => subIdentity.getOrFail(),
          name: unwrapData(subData[1]),
        })
      );
    }
  }
}
