import assert from 'assert';
import { Action } from '../../../../action/base';
import { chain } from '../../../../chain/index';
import { Block, Call, ProcessorContext } from '../../../../processor';
import { encodeAddress, getOriginAccountId, unwrapData } from '../../../../utils';
import { PalletCallHandler } from '../../../handler';
import { Account, Identity, Judgement } from '../../../../model';
import { EnsureAccount } from '../../../../action';
import { EnsureIdentityAction, GiveJudgementAction, SetIdentityAction } from '../../../../action/identity';
import { IIdentitySetIdentityCallPalletDecoder } from '../../../registry';

// TODO: implement the decoder andd change the return type
export class SetIdentityCallPalletDecoder implements IIdentitySetIdentityCallPalletDecoder {
  decode(call: Call): { name: string } {
    console.log('IdentitySetIdentityCallPalletDecoder', call);
    return { name: '0x' };
  }
}

export class SetIdentityCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
  constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.calls);

    const call = params.item as Call;

    if (!call.success) return;

    // const data = this.decoder.decode(call);

    const data = chain.api.calls.identity.set_identity.decode(call);

    const origin = getOriginAccountId(call.origin);

    if (origin == null) return;

    const identityId = encodeAddress(origin);
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
        additional: data.additional.map((a) => ({
          name: unwrapData(a[0])!,
          value: unwrapData(a[1]),
        })),
      })
    );
  }
}
