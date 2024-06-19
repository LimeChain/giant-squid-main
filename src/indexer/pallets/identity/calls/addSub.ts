import { EnsureAccount } from '../../../actions';
import { Identity, Account, IdentitySub } from '../../../../model';
import { getOriginAccountId, unwrapData } from '../../../../utils';
import { CallPalletHandler, ICallHandlerParams } from '../../handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '../../../types';
import { EnsureIdentitySubAction, AddIdentitySubAction, RenameSubAction } from '../../../actions/identity';

export interface IAddSubCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> {}
interface ISubCallPalletSetup extends IBasePalletSetup {
  decoder: IAddSubCallPalletDecoder;
}

export class AddSubCallPalletHandler extends CallPalletHandler<ISubCallPalletSetup> {
  constructor(decoder: ISubCallPalletSetup, options: { chain: string }) {
    super(decoder, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const subAddedCallData = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = this.encodeAddress(origin);
    const subId = this.encodeAddress(subAddedCallData.sub);

    const identity = ctx.store.defer(Identity, identityId);
    const subIdentityAccount = ctx.store.defer(Account, subId);
    const subIdentity = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => subIdentityAccount.get(),
        id: subId,
      }),
      new EnsureIdentitySubAction(block.header, call.extrinsic, {
        sub: () => subIdentity.get(),
        account: () => subIdentityAccount.getOrFail(),
        id: subId,
      }),
      new AddIdentitySubAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        sub: () => subIdentity.getOrFail(),
      }),
      new RenameSubAction(block.header, call.extrinsic, {
        sub: () => subIdentity.getOrFail(),
        name: unwrapData(subAddedCallData.data),
      })
    );
  }
}
