// @ts-ignore
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { SetTokenMetadataAction } from '@/indexer/actions';

export interface ITokenMetadataSetEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: string; data: string }> {}

interface ITokenMetadataSetEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenMetadataSetEventPalletDecoder;
}

export class TokenMetadataSetEventPalletHandler extends EventPalletHandler<ITokenMetadataSetEventPalletSetup> {
  constructor(setup: ITokenMetadataSetEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    queue.push(
      new SetTokenMetadataAction(block.header, event.extrinsic, {
        collectionId: data.collectionId,
        tokenId: data.item,
        metadata: data.data,
      })
    );
  }
}
