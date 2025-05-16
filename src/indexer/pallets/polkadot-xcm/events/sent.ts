// @ts-ignore
import { Account } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { PolkadotXcmTransferAction } from '@/indexer/actions/polkadot-xcm/transfer';
import { EnsureAccount } from '@/indexer/actions';
import assert from 'assert';

export interface ISentEventPalletDecoder
  extends IEventPalletDecoder<
    | {
        from?: string;
        to?: string;
        toChain?: string;
        amount?: bigint;
        weightLimit?: bigint;
        contractCalled?: string;
        contractInput?: string;
      }
    | undefined
  > {}

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

    try {
      const data = this.decoder.decode(event);
      // Return on unsupported event types
      if (!data) return;

      const { amount, weightLimit, to, toChain, from, contractCalled, contractInput } = data;
      assert(from, `Caller Pubkey is undefined at ${event.extrinsic?.hash}`);

      if (!amount) console.log({ amount, hash: event.extrinsic?.hash });
      if (!to) console.log({ to, hash: event.extrinsic?.hash });
      if (!toChain) console.log({ toChain, hash: event.extrinsic?.hash });

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
        })
      );
    } catch (error) {
      console.log({ error, hash: event.extrinsic?.hash });
    }
  }
}
