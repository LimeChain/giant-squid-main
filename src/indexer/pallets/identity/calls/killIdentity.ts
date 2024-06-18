import { Block, Call } from '../../../processor';
import { Action, LazyAction } from '../../../actions/base';
import { ClearIdentityAction, GiveJudgementAction, RemoveIdentitySubAction, KillIdentityAction } from '../../../actions/identity';
import { Identity, Judgement } from '../../../../model';
import { ProcessorContext } from '../../../processor';
import { getOriginAccountId } from '../../../../utils';
import { PalletCallHandler } from '../../handler';
import { IIdentityKillIdentityCallPalletDecoder } from '../../../registry';

export class IdentityKillIdentityCallPalletHandler extends PalletCallHandler<IIdentityKillIdentityCallPalletDecoder> {
  constructor(decoder: IIdentityKillIdentityCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  //TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);
    if (origin == null) return;

    const identityId = this.encodeAddress(origin);
    const identity = params.ctx.store.defer(Identity, { id: identityId, relations: { subs: true } });
    params.queue.push(
      new ClearIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new LazyAction(params.block.header, call.extrinsic, async () => {
        const a: Action[] = [];

        const i = await identity.getOrFail();

        for (const s of i.subs) {
          new RemoveIdentitySubAction(params.block.header, call.extrinsic, {
            sub: () => Promise.resolve(s),
          });
        }

        return a;
      }),
      new KillIdentityAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      })
    );
  }
}
