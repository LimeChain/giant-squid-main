import { EnsureAccount } from '@/indexer/actions';
import { Identity, Account, IdentitySub } from '@/model';
import { getOriginAccountId, unwrapData } from '@/utils';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';
import { EnsureIdentityAction, EnsureIdentitySubAction, AddIdentitySubAction, RenameSubAction } from '@/indexer/actions/identity';

export interface ISetSubsCallPalletDecoder extends ICallPalletDecoder<{ subs: [string, WrappedData][] }> {}
interface ISetSubsCallPalletSetup extends IBasePalletSetup {
  decoder: ISetSubsCallPalletDecoder;
}

export class SetSubsCallPalletHandler extends CallPalletHandler<ISetSubsCallPalletSetup> {
  constructor(setup: ISetSubsCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const setSubsData = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const identityId = this.encodeAddress(origin);
    const identity = ctx.store.defer(Identity, identityId);
    const identityAccount = ctx.store.defer(Account, identityId);

    for (const subData of setSubsData.subs) {
      const subId = this.encodeAddress(subData[0]);
      const subIdentity = ctx.store.defer(IdentitySub, subId);
      const subIdentityAccount = ctx.store.defer(Account, subId);

      queue.push(
        new EnsureAccount(block.header, call.extrinsic, {
          account: () => subIdentityAccount.get(),
          id: subId,
          pk: subData[0]
        }),
        new EnsureAccount(block.header, call.extrinsic, {
          account: () => identityAccount.get(),
          id: identityId,
          pk: this.decodeAddress(identityId)
        }),
        new EnsureIdentityAction(block.header, call.extrinsic, {
          identity: () => identity.get(),
          account: () => identityAccount.getOrFail(),
          id: identityId,
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
          name: unwrapData(subData[1]),
        })
      );
    }
  }
}
