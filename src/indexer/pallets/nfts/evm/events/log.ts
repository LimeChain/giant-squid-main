// @ts-ignore
import { Account, HistoryElementType, NFTCollection, NFTHolder, NFTTokenStandard } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EvmLogEventPalletDecoder } from '@/chain/moonbeam/decoders/events/evm/log';
import { EnsureAccount, EnsureNFTCollection, EnsureNFTHolder, EnsureNftTransferAction, HistoryElementAction, NftTokensAction } from '@/indexer/actions';
import * as erc721 from '@/abi/erc721';
import * as erc1155 from '@/abi/erc1155';
import { getEvmLog } from '@subsquid/frontier';
import { Event } from '@/indexer';

export interface IEvmLogEventPalletDecoder
  extends IEventPalletDecoder<
    | {
        call: string;
        address: string;
        from: string;
        to: string;
        tokenIds: string[];
        amounts: number[];
        standard: NFTTokenStandard;
      }
    | undefined
  > {}

interface IEvmLogEventPalletSetup extends IBasePalletSetup {
  decoder: EvmLogEventPalletDecoder;
}

export class EvmLogEventPalletHandler extends EventPalletHandler<IEvmLogEventPalletSetup> {
  constructor(setup: IEvmLogEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (!data || !event.extrinsic) return;
    const accountFrom = ctx.store.defer(Account, data.from);
    const accountTo = ctx.store.defer(Account, data.to);
    const nftHolderFrom = ctx.store.defer(NFTHolder, this.composeId(data.from, data.address));
    const nftHolderTo = ctx.store.defer(NFTHolder, this.composeId(data.to, data.address));
    const nftCollection = ctx.store.defer(NFTCollection, data.address);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { id: data.from, account: () => accountFrom.get(), pk: this.decodeAddress(data.from) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => accountTo.get(), id: data.to, pk: this.decodeAddress(data.to) }),
      new EnsureNFTCollection(block.header, event.extrinsic, { id: data.address, nftCollection: () => nftCollection.get() }),
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
        id: event.id,
        from: () => accountFrom.getOrFail(),
        to: () => accountTo.getOrFail(),
        collectionId: data.address,
      }),
      new NftTokensAction(block.header, event.extrinsic, {
        tokenIds: data.tokenIds,
        transferId: event.id,
        newOwnerId: data.to,
        oldOwnerId: data.from,
        standard: data.standard,
        nftCollectionId: data.address,
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        account: () => accountFrom.getOrFail(),
      })
    );
  }
}

export function decodeNfts({ address, topics, event }: { address: string; topics: string[]; event: Event }) {
  // parse only correct erc721 Transfer events
  if (topics.length === 4 && topics[0]?.toLowerCase() === erc721.events.Transfer.topic) {
    const decoded = erc721.events.Transfer.decode(getEvmLog(event));

    return {
      call: 'erc721.Transfer',
      address,
      from: decoded.from,
      to: decoded.to,
      tokenIds: [decoded.tokenId.toString()],
      // unique nfts, always amount = 1
      amounts: [1],
      standard: NFTTokenStandard.ERC721,
    };
  } else if (topics[0]?.toLowerCase() === erc1155.events.TransferSingle.topic) {
    const decoded = erc1155.events.TransferSingle.decode(getEvmLog(event));

    return {
      call: 'erc1155.TransferSingle',
      address,
      from: decoded.from,
      to: decoded.to,
      tokenIds: [decoded.id.toString()],
      amounts: [Number(decoded.value)],
      standard: NFTTokenStandard.ERC1155,
    };
  } else if (topics[0]?.toLowerCase() === erc1155.events.TransferBatch.topic) {
    const decoded = erc1155.events.TransferBatch.decode(getEvmLog(event));

    return {
      call: 'erc1155.TransferSingle',
      address,
      from: decoded.from,
      to: decoded.to,
      tokenIds: decoded.ids.map((id) => id.toString()),
      amounts: decoded.values.map((value) => Number(value)),
      standard: NFTTokenStandard.ERC1155,
    };
  }
  // skip other evm logs
  else return undefined;
}
