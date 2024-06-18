import { Block, Call } from '../../../processor';
import { EnsureAccount } from '../../../actions';
import { Action, LazyAction } from '../../../actions/base';
import { EnsureIdentityAction, GiveJudgementAction } from '../../../actions/identity';
import { Judgement, Account, Identity } from '../../../../model';
import { ProcessorContext } from '../../../processor';
import { PalletCallHandler } from '../../handler';
import { IIdentityProvideJudgementCallPalletDecoder } from '../../../registry';

export class IdentityProvideJudgementCallPalletHandler extends PalletCallHandler<IIdentityProvideJudgementCallPalletDecoder> {
  constructor(decoder: IIdentityProvideJudgementCallPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call }): any {
    const call = params.item as Call;

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
    const account = params.ctx.store.defer(Account, identityId);
    const identity = params.ctx.store.defer(Identity, identityId);

    params.queue.push(
      new LazyAction(params.block.header, call.extrinsic, async (ctx) => {
        const action: Action[] = [];

        if (params.block.header.specName.startsWith('kusama') || params.block.header.specName.startsWith('polkadot')) {
          //[2018825, 3409356, 5926842, 5965153].includes(block.height) &&

          action.push(
            new EnsureAccount(params.block.header, call.extrinsic, {
              account: () => account.get(),
              id: identityId,
            }),
            new EnsureIdentityAction(params.block.header, call.extrinsic, {
              identity: () => identity.get(),
              account: () => account.getOrFail(),
              id: identityId,
            })
          );
        }

        return action;
      }),
      new GiveJudgementAction(params.block.header, call.extrinsic, {
        identity: () => identity.getOrFail(),
        judgement,
      })
    );
  }
}
