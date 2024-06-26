import { getOriginAccountId } from '../../../../utils';
import { Identity, Judgement } from '../../../../model';
import { Action, LazyAction } from '../../../actions/base';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '../../handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '../../../types';
import { ClearIdentityAction, GiveJudgementAction, RemoveIdentitySubAction } from '../../../actions/identity';

export interface IClearIdentityCallPalletDecoder extends ICallPalletDecoder<{ sub: string; data: WrappedData }> {}
interface IClearIdentityCallPalletSetup extends IBasePalletSetup {
  decoder: IClearIdentityCallPalletDecoder;
}

export class ClearIdentityCallPalletHandler extends CallPalletHandler<IClearIdentityCallPalletSetup> {
  constructor(setup: IClearIdentityCallPalletSetup, options: IHandlerOptions) {
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
      new LazyAction(block.header, call.extrinsic, async (ctx) => {
        const a: Action[] = [];

        const i = await identity.getOrFail();

        for (const s of i.subs) {
          new RemoveIdentitySubAction(block.header, call.extrinsic, {
            sub: () => Promise.resolve(s),
          });
        }

        return a;
      })
    );
  }
}
