// @ts-ignore
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { TokenAttributeSetAction } from '@/indexer/actions/nfts/tokenAttributeSet';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import { Account, HistoryElementType } from '@/model';
import { getOriginAccountId } from '@/utils';

export interface IAttributeSetEventPalletDecoder extends IEventPalletDecoder<{ collection: string; maybeItem: string | null; key: string; value: string }> {}

interface IAttributeSetEventPalletSetup extends IBasePalletSetup {
  decoder: IAttributeSetEventPalletDecoder;
}

export class AttributeSetEventPalletHandler extends EventPalletHandler<IAttributeSetEventPalletSetup> {
  constructor(setup: IAttributeSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);

    if (!data || !data.maybeItem) return;

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new TokenAttributeSetAction(block.header, event.extrinsic, {
        collectionId: data.collection,
        tokenId: data.maybeItem,
        key: data.key,
        value: data.value,
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        account: () => account.getOrFail(),
      })
    );
  }
}
