import { storage } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { BlockHeader, ICurrentEraStorageLoader } from '@/indexer';

export class CurrentEraStorageLoader implements ICurrentEraStorageLoader {
  load(blockHeader: BlockHeader) {
    const { currentEra } = storage.staking;

    if (currentEra.v0.is(blockHeader)) {
      return currentEra.v0.get(blockHeader);
    }

    throw new UnknownVersionError(currentEra);
  }
}
