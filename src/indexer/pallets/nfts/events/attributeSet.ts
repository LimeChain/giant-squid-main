// @ts-ignore
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { TokenAttributeSetAction } from '@/indexer/actions/nfts/tokenAttributeSet';

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

    if (!data || !data.maybeItem) return;

    queue.push(
      new TokenAttributeSetAction(block.header, event.extrinsic, {
        collectionId: data.collection,
        tokenId: data.maybeItem,
        key: data.key,
        value: data.value,
      })
    );
  }
}
