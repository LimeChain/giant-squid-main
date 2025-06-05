// @ts-ignore
import { NFTTokenStandard } from '@/model';
import { events } from '@/chain/moonriver/types';
import { getEvmLog } from '@subsquid/frontier';
import { UnknownVersionError } from '@/utils';
import { IEvmLogEventPalletDecoder, Event } from '@/indexer';
import * as erc721 from '@/abi/erc721';
import * as erc1155 from '@/abi/erc1155';

export class EvmLogEventPalletDecoder implements IEvmLogEventPalletDecoder {
  decode(event: Event) {
    const { log } = events.evm;
    if (log.v49.is(event)) {
      const { address, topics } = log.v49.decode(event);

      return decodeNfts({ address, topics, event });
    } else if (log.v1801.is(event)) {
      const { log: _log } = log.v1801.decode(event);
      const { address, topics } = _log;

      return decodeNfts({ address, topics, event });
    }

    throw new UnknownVersionError(log);
  }
}

function decodeNfts({ address, topics, event }: { address: string; topics: string[]; event: Event }) {
  // parse only correct erc721 Transfer events
  if (topics.length === 4 && topics[0].toLowerCase() === erc721.events.Transfer.topic) {
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
  } else if (topics[0].toLowerCase() === erc1155.events.TransferSingle.topic) {
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
  } else if (topics[0].toLowerCase() === erc1155.events.TransferBatch.topic) {
    const decoded = erc1155.events.TransferBatch.decode(getEvmLog(event));

    return {
      call: 'erc1155.TransferSingle',
      address,
      from: decoded.from,
      to: decoded.to,
      tokenIds: decoded.ids.map((id) => id.toString()),
      amounts: decoded.values.map((value) => Number(value)),
      standard: NFTTokenStandard.ERC1155,
      // metadata,
    };
  }
  // skip other evm logs
  else return undefined;
}
