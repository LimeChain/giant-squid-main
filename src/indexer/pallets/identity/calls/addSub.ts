import { Block, Call } from '../../../../processor';
import { EnsureAccount } from '../../../actions';
import { Action } from '../../../actions/base';
import { EnsureIdentitySubAction, AddIdentitySubAction, RenameSubAction } from '../../../actions/identity';
import { Identity, Account, IdentitySub } from '../../../../model';
import { ProcessorContext } from '../../../../processor';
import { getOriginAccountId, unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { IIdentityAddSubCallPalletDecoder } from '../../../registry';

export class IdentityAddSubCallPalletHandler extends PalletCallHandler<IIdentityAddSubCallPalletDecoder> {
  constructor(decoder: IIdentityAddSubCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

    if (!call.success) return;

    const subAddedCallData = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = this.encodeAddress(origin);
    const subId = this.encodeAddress(subAddedCallData.sub);

    const identity = params.ctx.store.defer(Identity, identityId);
    const subIdentityAccount = params.ctx.store.defer(Account, subId);
    const subIdentity = params.ctx.store.defer(IdentitySub, subId);

    params.queue.push(
      new EnsureAccount(params.block.header, call.extrinsic, {
        account: () => subIdentityAccount.get(),
        id: subId,
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
        name: unwrapData(subAddedCallData.data),
      })
    );
  }
}
