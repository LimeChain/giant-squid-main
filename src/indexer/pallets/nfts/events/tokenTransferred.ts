// @ts-ignore
import { Account, NFTCollection, NFTHolder } from '@/model';
import { EnsureAccount, EnsureNFTHolder, EnsureNftTransferAction, NftTokenTransfer, EnsureNFTCollection } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ITokenTransferredEventPalletDecoder extends IEventPalletDecoder<{ collectionId: string; item: number; from: string; to: string }> {}

interface ITokenTransferredEventPalletSetup extends IBasePalletSetup {
  decoder: ITokenTransferredEventPalletDecoder;
}

export class TokenTransferredEventPalletHandler extends EventPalletHandler<ITokenTransferredEventPalletSetup> {
  constructor(setup: ITokenTransferredEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data || !event.extrinsic) return;
    const accountFrom = ctx.store.defer(Account, data.from);
    const accountTo = ctx.store.defer(Account, data.to);
    const nftHolderFrom = ctx.store.defer(NFTHolder, this.composeId(data.from, data.collectionId));
    const nftHolderTo = ctx.store.defer(NFTHolder, this.composeId(data.to, data.collectionId));
    const nftCollection = ctx.store.defer(NFTCollection, data.collectionId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { id: data.from, account: () => accountFrom.get(), pk: this.decodeAddress(data.from) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => accountTo.get(), id: data.to, pk: this.decodeAddress(data.to) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.collectionId, nftCollection: () => nftCollection.get() }),
      new EnsureNFTHolder(block.header, event.extrinsic, {
        id: data.from,
        nftHolder: () => nftHolderFrom.get(),
        account: () => accountFrom.getOrFail(),
        nftCollection: () => nftCollection.getOrFail(),
      }),
      new EnsureNFTHolder(block.header, event.extrinsic, {
        id: data.to,
        nftHolder: () => nftHolderTo.get(),
        account: () => accountTo.getOrFail(),
        nftCollection: () => nftCollection.getOrFail(),
      }),
      new EnsureNftTransferAction(block.header, event.extrinsic, {
        id: event.extrinsic.hash,
        from: () => accountFrom.getOrFail(),
        to: () => accountTo.getOrFail(),
        collectionId: data.collectionId,
      }),
      new NftTokenTransfer(block.header, event.extrinsic, {
        collectionId: data.collectionId,
        token: data.item,
        from: () => accountFrom.getOrFail(),
        to: () => accountTo.getOrFail(),
      })
    );
  }
}
