// @ts-ignore
import { Account } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { PolkadotXcmTransferAction } from '@/indexer/actions/polkadot-xcm/transfer';
import { EnsureAccount } from '@/indexer/actions';
import assert from 'assert';

export interface ISentEventPalletDecoder extends IEventPalletDecoder<any> {}
// TODO: add type
// extends IEventPalletDecoder<
//   | {
//       from?: string;
//       to?: {
//         type: string;
//         value: string;
//       };
//       toChain?: string;
//       asset?: {
//         parents: number;
//         pallet: string | null;
//         assetId: string | null;
//         parachain?: string | null;
//         fullPath?: string[];
//         error?: string;
//       };
//       amount?: { type: string; value: string | null };
//       weightLimit?: bigint | null;
//       contractCalled?: string;
//       contractInput?: string;
//     }
//   | undefined
// > {}

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

    if (data.asset?.error) {
      console.error(`HASH: ${event.extrinsic?.hash} ASSET ERROR: ${data.asset.error}`);
      return;
    }

    try {
      const { amount, weightLimit, to, toChain, from, contractCalled, contractInput, asset } = data;
      assert(from, `Caller Pubkey is undefined at ${event.extrinsic?.hash}`);

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
          amount,
          to,
          toChain,
          call: event.call.name,
          weightLimit,
          contractCalled,
          contractInput,
          asset,
        })
      );
    } catch (error) {
      console.error({
        error,
        data,
        fullPath: data.asset?.fullPath,
        extrinsic: event.extrinsic?.hash,
        message: 'Error decoding PolkadotXcm.Sent event',
      });
    }
  }
}
