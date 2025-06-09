// @ts-ignore
import { Account, NFTCollection, NftCollection, NFTHolder, NFTTokenStandard } from '@/model';
import { EnsureAccount } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { IssueNftToken } from '@/indexer/actions/nfts/tokenIssued';
import { EnsureNFTCollection } from '@/indexer/actions/nfts/nftCollection';
import { EnsureNFTHolder } from '@/indexer/actions/nfts/evm/nftHolder';
import { NftTokensAction } from '@/indexer/actions/nfts/evm/nftToken';

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

    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);
    const owner = ctx.store.defer(Account, data.owner);
    const nftHolder = ctx.store.defer(NFTHolder, this.composeId(data.owner, data.collectionId));

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: data.owner, pk: this.decodeAddress(data.owner) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collectionId, nftCollection: () => nftCollection.get() }),
      new EnsureNFTHolder(block.header, event.extrinsic, {
        id: data.owner,
        nftHolder: () => nftHolder.get(),
        account: () => owner.getOrFail(),
        nftCollection: () => nftCollection.getOrFail(),
      }),
      new IssueNftToken(block.header, event.extrinsic, {
        id: data.item.toString(),
        collection: () => nftCollection.getOrFail(),
        owner: () => owner.getOrFail(),
      })
    );
  }
}
