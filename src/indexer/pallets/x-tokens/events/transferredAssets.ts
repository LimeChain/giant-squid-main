// @ts-ignore
import { Account } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount } from '@/indexer/actions';
import assert from 'assert';
import { XTokensTransferAction } from '@/indexer/actions/x-tokens/transfer';

export interface ITransferredAssetsEventPalletDecoder
  extends IEventPalletDecoder<
    | {
        from?: string;
        to?: string;
        toChain?: string;
        assets?: (string | undefined)[];
        amount?: (string | undefined)[];
      }
    | undefined
  > {}

interface ITransferredAssetsEventPalletSetup extends IBasePalletSetup {
  decoder: ITransferredAssetsEventPalletDecoder;
}

export class TransferredAssetsEventPalletHandler extends EventPalletHandler<ITransferredAssetsEventPalletSetup> {
  constructor(setup: ITransferredAssetsEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    // Return on failed calls
    if (!event?.call?.success) return;

    const data = this.decoder.decode(event);
    // Return on unsupported event types
    if (!data) return;

    const { amount, to, toChain, from, assets } = data;
    assert(from, `Caller Pubkey is undefined at ${event.extrinsic?.hash}`);

    if (amount?.includes(undefined)) console.log({ amount, hash: event.extrinsic?.hash });
    if (!to) console.log({ to, hash: event.extrinsic?.hash });
    if (!toChain) console.log({ toChain, hash: event.extrinsic?.hash });
    if (assets?.includes(undefined)) console.log({ assets, hash: event.extrinsic?.hash });

    const fromPubKey = this.encodeAddress(from);
    const account = ctx.store.defer(Account, fromPubKey);

    console.log({ hash: event.extrinsic?.hash });

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => account.get(),
        id: fromPubKey,
        pk: this.decodeAddress(fromPubKey),
      }),
      new XTokensTransferAction(block.header, event.extrinsic, {
        id: event.id,
        account: () => account.getOrFail(),
        amount,
        to,
        toChain,
        call: event.call.name,
        assets,
      })
    );
  }
}
