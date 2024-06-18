import { getOriginAccountId, unwrapData } from '../../../../utils';
import { IHandlerCallParams, IHandlerOptions, PalletCallHandler } from '../../handler';
import { Account, Identity, Judgement } from '../../../../model';
import { EnsureAccount } from '../../../actions';
import { EnsureIdentityAction, GiveJudgementAction, SetIdentityAction } from '../../../actions/identity';
import { IBasePalletSetup, ICallPalletDecoder, IdentityInfo, WrappedData } from '../../../types';

export interface ISetIdentityCallPalletDecoder extends ICallPalletDecoder<IdentityInfo> { }
interface ISetIdentityCallPalletSetup extends IBasePalletSetup {
  decoder: ISetIdentityCallPalletDecoder;
}

export class SetIdentityCallPalletHandler extends PalletCallHandler<ISetIdentityCallPalletSetup> {
  constructor(setup: ISetIdentityCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: IHandlerCallParams) {
    if (!call.success) return;

    const data = this.decoder.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;

    const identityId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, identityId);
    const identity = ctx.store.defer(Identity, identityId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => account.get(),
        id: identityId,
      }),
      new EnsureIdentityAction(block.header, call.extrinsic, {
        identity: () => identity.get(),
        account: () => account.getOrFail(),
        id: identityId,
      }),
      new GiveJudgementAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new SetIdentityAction(block.header, call.extrinsic, {
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
