import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import { Action, LazyAction } from '@/indexer/actions/base';
// @ts-ignore
import { Judgement, Account, Identity, HistoryElementType } from '@/model';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IBasePalletSetup, ICallPalletDecoder, JudgementData } from '@/indexer/types';
import { EnsureIdentityAction, GiveJudgementAction } from '@/indexer/actions/identity';

export interface IProvideJudgementCallPalletDecoder extends ICallPalletDecoder<{ regIndex: number; judgement: JudgementData; target: string }> {}
interface IProvideJudgementCallPalletSetup extends IBasePalletSetup {
  decoder: IProvideJudgementCallPalletDecoder;
}

export class ProvideJudgementCallPalletHandler extends CallPalletHandler<IProvideJudgementCallPalletSetup> {
  constructor(setup: IProvideJudgementCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (!call.success) return;

    const judgementGivenData = this.decoder.decode(call);

    const identityId = this.encodeAddress(judgementGivenData.target);

    const getJudgment = () => {
      const kind = judgementGivenData.judgement.__kind;
      switch (kind) {
        case Judgement.Erroneous:
        case Judgement.FeePaid:
        case Judgement.KnownGood:
        case Judgement.LowQuality:
        case Judgement.OutOfDate:
        case Judgement.Reasonable:
        case Judgement.Unknown:
          return kind as Judgement;
        default:
          throw new Error(`Unknown judgement: ${kind}`);
      }
    };
    const judgement = getJudgment();
    const account = ctx.store.defer(Account, identityId);
    const identity = ctx.store.defer(Identity, identityId);

    queue.push(
      new LazyAction(block.header, call.extrinsic, async (ctx) => {
        const action: Action[] = [];

        if (block.header.specName.startsWith('kusama') || block.header.specName.startsWith('polkadot')) {
          //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

          action.push(
            new EnsureAccount(block.header, call.extrinsic, {
              account: () => account.get(),
              id: identityId,
              pk: identityId,
            }),
            new EnsureAccount(block.header, call.extrinsic, {
              account: () => account.get(),
              id: identityId,
              pk: judgementGivenData.target,
            }),
            new EnsureIdentityAction(block.header, call.extrinsic, {
              identity: () => identity.get(),
              account: () => account.getOrFail(),
              id: identityId,
            }),
            new HistoryElementAction(block.header, call.extrinsic, {
              id: call.id,
              name: call.name,
              type: HistoryElementType.Extrinsic,
              account: () => account.getOrFail(),
            })
          );
        }

        return action;
      }),
      new GiveJudgementAction(block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement,
      })
    );
  }
}
