import { Action } from '../../../actions/base';
import { Block, Call, ProcessorContext } from '../../../../processor';
import { getOriginAccountId, unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { Account, Identity, Judgement } from '../../../../model';
import { EnsureAccount } from '../../../actions';
import { EnsureIdentityAction, GiveJudgementAction, SetIdentityAction } from '../../../actions/identity';
import { IIdentitySetIdentityCallPalletDecoder } from '../../../registry';
import { WrappedData } from '../../../types';

export class SetIdentityCallPalletHandler extends PalletCallHandler<IIdentitySetIdentityCallPalletDecoder> {
  constructor(decoder: IIdentitySetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

    if (!call.success) return;

    const data = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;

    const identityId = this.encodeAddress(origin);
    const account = params.ctx.store.defer(Account, identityId);
    const identity = params.ctx.store.defer(Identity, identityId);

    params.queue.push(
      new EnsureAccount(params.block.header, call.extrinsic, {
        account: () => account.get(),
        id: identityId,
      }),
      new EnsureIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.get(),
        account: () => account.getOrFail(),
        id: identityId,
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new SetIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        web: unwrapData(data.web),
        display: unwrapData(data.display),
        legal: unwrapData(data.legal),
        email: unwrapData(data.email),
        image: unwrapData(data.image),
        pgpFingerprint: data.pgpFingerprint ?? null,
        riot: unwrapData(data.riot),
        twitter: unwrapData(data.twitter),
        additional: data.additional.map((a: WrappedData[]) => ({
          name: unwrapData(a[0])!,
          value: unwrapData(a[1]),
        })),
      })
    );
  }
}
