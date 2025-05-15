import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, HistoryElementAction, VoteConvictionVotingAction } from '@/indexer/actions';
import { Account, HistoryElementType } from '@/model';
import { getOriginAccountId } from '@/utils';

export interface IVoteCallPalletDecoder
  extends ICallPalletDecoder<{
    pollIndex: number;
    vote: {
      aye?: bigint;
      nay?: bigint;
      balance?: bigint;
      vote?: number;
      abstain?: bigint;
    };
  }> {}

interface IVoteCallPalletSetup {
  decoder: IVoteCallPalletDecoder;
}

export class VoteCallPalletHandler extends CallPalletHandler<IVoteCallPalletSetup> {
  constructor(setup: IVoteCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
    if (!call.success) return;
    const data = this.decoder.decode(call);
    const origin = getOriginAccountId(call.origin);
    if (!origin) return;

    let whoId: string;

    try {
      // Covers substrate based chains
      whoId = this.encodeAddress(origin);
    } catch (e) {
      // Workaround for evm parachains
      whoId = call.origin.value.value;
    }

    const whoAccount = ctx.store.defer(Account, whoId);

    queue.push(
      new EnsureAccount(block.header, call.extrinsic, {
        account: () => whoAccount.get(),
        id: whoId,
        pk: this.decodeAddress(whoId),
      }),

      new VoteConvictionVotingAction(block.header, call.extrinsic, {
        id: call.id,
        extrinsicHash: call.extrinsic?.hash,
        who: () => whoAccount.getOrFail(),
        pollIndex: data.pollIndex,
        vote: data.vote,
      }),
      new HistoryElementAction(block.header, call.extrinsic, {
        id: call.id,
        name: call.name,
        type: HistoryElementType.Extrinsic,
        account: () => whoAccount.getOrFail(),
      })
    );
  }
}
