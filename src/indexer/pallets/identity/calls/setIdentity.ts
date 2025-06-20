import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
// @ts-ignore
import { Account, HistoryElementType, Identity, Judgement } from '@/model';
import { getOriginAccountId, unwrapData } from '@/utils';
import { ICallHandlerParams, IHandlerOptions, CallPalletHandler } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, IdentityInfoData, WrappedData } from '@/indexer/types';
import { EnsureIdentityAction, GiveJudgementAction, SetIdentityAction } from '@/indexer/actions/identity';

export interface ISetIdentityCallPalletDecoder extends ICallPalletDecoder<IdentityInfoData> {}
interface ISetIdentityCallPalletSetup extends IBasePalletSetup {
  decoder: ISetIdentityCallPalletDecoder;
}

export class SetIdentityCallPalletHandler extends CallPalletHandler<ISetIdentityCallPalletSetup> {
  constructor(setup: ISetIdentityCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const data = this.decoder.decode(call);
    const identityId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, identityId);
    const identity = ctx.store.defer(Identity, identityId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => account.get(),
        id: identityId,
        pk: this.decodeAddress(identityId),
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
      }),
      new HistoryElementAction(block.header, call.extrinsic, {
        id: call.id,
        name: call.name,
        type: HistoryElementType.Extrinsic,
        account: () => account.getOrFail(),
      })
    );
  }
}
