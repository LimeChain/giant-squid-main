import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
// @ts-ignore
import { Identity, Account, IdentitySub, HistoryElementType } from '@/model';
import { getOriginAccountId, unwrapData } from '@/utils';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';
import { EnsureIdentitySubAction, AddIdentitySubAction, RenameSubAction } from '@/indexer/actions/identity';

export interface IAddSubCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> {}
interface ISubCallPalletSetup extends IBasePalletSetup {
  decoder: IAddSubCallPalletDecoder;
}

export class AddSubCallPalletHandler extends CallPalletHandler<ISubCallPalletSetup> {
  constructor(setup: ISubCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const subAddedCallData = this.decoder.decode(call);

    const identityId = this.encodeAddress(origin);
    const subId = this.encodeAddress(subAddedCallData.sub);

    const identity = ctx.store.defer(Identity, identityId);
    const identityAccount = ctx.store.defer(Account, identityId);
    const subIdentityAccount = ctx.store.defer(Account, subId);
    const subIdentity = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => identityAccount.get(),
        id: identityId,
        pk: identityId,
      }),
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => subIdentityAccount.get(),
        id: subId,
        pk: subAddedCallData.sub,
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
      }),
      new HistoryElementAction(block.header, call.extrinsic, {
        id: call.id,
        name: call.name,
        type: HistoryElementType.Extrinsic,
        account: () => identityAccount.getOrFail(),
      })
    );
  }
}
