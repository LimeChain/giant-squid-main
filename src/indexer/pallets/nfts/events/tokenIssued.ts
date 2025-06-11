// @ts-ignore
import { Account, HistoryElementType, NFTCollection, NFTHolder } from '@/model';
import { EnsureAccount, EnsureNFTCollection, EnsureNFTHolder, HistoryElementAction, IssueNftToken } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';

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
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);
    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);
    const owner = ctx.store.defer(Account, data.owner);
    const nftHolder = ctx.store.defer(NFTHolder, this.composeId(data.owner, data.collectionId));

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
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
