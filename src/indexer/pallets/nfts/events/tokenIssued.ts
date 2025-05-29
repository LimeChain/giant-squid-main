import { Account, NftCollection } from '@/model';
import { CreateNftAction, EnsureAccount } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IssueNftToken } from '@/indexer/actions/nfts/tokenIssued';

export interface ITokenIssuedEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: number; owner: string }> {}

interface ITokenIssuedEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenIssuedEventPalletDecoder;
}

export class TokenIssuedEventPalletHandler extends EventPalletHandler<ITokenIssuedEventPalletSetup> {
  constructor(setup: ITokenIssuedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const ownerId = data.owner;

    const nftCollection = ctx.store.defer(NftCollection, data.collectionId);
    const owner = ctx.store.defer(Account, ownerId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: ownerId, pk: this.decodeAddress(ownerId) }),
      new IssueNftToken(block.header, event.extrinsic, {
        id: event.id,
        item: data.item,
        extrinsicHash: event.extrinsic,
        collection: () => nftCollection.getOrFail(),
        owner: () => owner.getOrFail(),
      })
    );
  }
}
