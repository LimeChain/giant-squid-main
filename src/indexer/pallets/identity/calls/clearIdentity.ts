import { getOriginAccountId } from '@/utils';
// @ts-ignore
import { Account, HistoryElementType, Identity, Judgement } from '@/model';
import { Action, LazyAction } from '@/indexer/actions/base';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, WrappedData } from '@/indexer/types';
import { ClearIdentityAction, GiveJudgementAction, RemoveIdentitySubAction } from '@/indexer/actions/identity';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';

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
    const identityAccount = ctx.store.defer(Account, identityId);
    const identity = ctx.store.defer(Identity, { id: identityId, relations: { subs: true } });

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => identityAccount.get(),
        id: identityId,
        pk: identityId,
      }),
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
