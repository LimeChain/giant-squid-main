// @ts-ignore
import { Account, HistoryElementType } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import assert from 'assert';
import { XTokensTransferAction } from '@/indexer/actions/x-tokens/transfer';
import { jsonStringify } from '@/utils';

export interface ITransferredAssetsEventPalletDecoder
  extends IEventPalletDecoder<
    | {
        from?: string;
        to?: {
          type: string;
          value: string | null;
        };
        toChain?: string | null;
        assets?: {
          parents?: number | null;
          pallet?: string | null;
          assetId?: string | null;
          parachain?: string | null;
          fullPath?: string[];
          error?: string | null;
        }[];
        amount?: { type: string; value: string | null }[];
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
    if (!event?.extrinsic?.call?.success) return;

    const data = this.decoder.decode(event);
    // Return on unsupported event types
    if (!data) return;

    // Skip on origin caller error
    if (!data.from) {
      console.error(`
          TRANSFERRED ASSETS ERROR:
          HASH: ${event.extrinsic?.hash}
          ORIGIN CALLER ERROR: ${jsonStringify(data)}
        `);
      return;
    }

    // Skip on asset error
    data.assets?.forEach((asset: any) => {
      if (asset.error) {
        console.error(`
            TRANSFERRED ASSETS ERROR:
            HASH: ${event.extrinsic?.hash}
            ASSET ERROR: ${jsonStringify(data)}
          `);
        return;
      }
    });

    const { amount, to, toChain, from, assets } = data;
    assert(from, `Caller Pubkey is undefined at ${event.extrinsic?.hash}`);

    const fromPubKey = this.encodeAddress(from);
    const account = ctx.store.defer(Account, fromPubKey);

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
        call: event.extrinsic.call.name,
        assets,
      })
    );

    if (amount) {
      queue.push(
        new HistoryElementAction(block.header, event.extrinsic, {
          id: event.id,
          amount: amount.reduce((acc, cur) => acc + BigInt(cur.value || 0), BigInt(0)),
          name: event.name,
          type: HistoryElementType.Event,
          account: () => account.getOrFail(),
        })
      );
    }
  }
}
