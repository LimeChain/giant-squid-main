// @ts-ignore
import { Account } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { PolkadotXcmTransferAction } from '@/indexer/actions/polkadotXcm/transfer';
import { EnsureAccount } from '@/indexer/actions';
import assert from 'assert';

export interface ISentEventPalletDecoder
  extends IEventPalletDecoder<{
    from: string | null;
    to: string | null;
    toChain: string | null;
    amount: bigint | null;
    feeAssetItem: number;
    weightLimit: bigint | null;
    contractCalled: string | null;
    contractInput: string | null;
  } | null> {}

interface ISentEventPalletSetup extends IBasePalletSetup {
  decoder: ISentEventPalletDecoder;
}

export class SentEventPalletHandler extends EventPalletHandler<ISentEventPalletSetup> {
  constructor(setup: ISentEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    // Return on failed calls
    if (!event?.call?.success) return;

    const data = this.decoder.decode(event);
    // Return on unsupported event types
    if (!data) return;

    const { amount, feeAssetItem, weightLimit, to, toChain, from, contractCalled, contractInput } = data;
    assert(from, 'Caller Pubkey is undefined');

    const fromPubKey = this.encodeAddress(from);
    const account = ctx.store.defer(Account, fromPubKey);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => account.get(),
        id: fromPubKey,
        pk: this.decodeAddress(fromPubKey),
      }),
      new PolkadotXcmTransferAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => account.getOrFail(),
        feeAssetItem,
        amount,
        to,
        toChain,
        call: event.call.name,
        weightLimit,
        contractCalled,
        contractInput,
      })
    );
  }
}
