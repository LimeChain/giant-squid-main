import { getOriginAccountId } from '@/utils';
// @ts-ignore
import { Identity, Judgement } from '@/model';
import { Action, LazyAction } from '@/indexer/actions/base';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';
import { ClearIdentityAction, GiveJudgementAction, RemoveIdentitySubAction, KillIdentityAction } from '@/indexer/actions/identity';

export interface IKillIdentityCallPalletDecoder extends ICallPalletDecoder<{ target: string | WrappedData }> {}
interface IKillIdentityCallPalletSetup extends IBasePalletSetup {
  decoder: IKillIdentityCallPalletDecoder;
}

export class KillIdentityCallPalletHandler extends CallPalletHandler<IKillIdentityCallPalletSetup> {
  constructor(setup: IKillIdentityCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const identityId = this.encodeAddress(origin);
    const identity = ctx.store.defer(Identity, { id: identityId, relations: { subs: true } });
    queue.push(
      new ClearIdentityAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      }),
      new GiveJudgementAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement: Judgement.Unknown,
      }),
      new LazyAction(block.header, call.extrinsic, async () => {
        const a: Action[] = [];

        const i = await identity.getOrFail();

        for (const s of i.subs) {
          new RemoveIdentitySubAction(block.header, call.extrinsic, {
            sub: () => Promise.resolve(s),
          });
        }

        return a;
      }),
      new KillIdentityAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
      })
    );
  }
}
