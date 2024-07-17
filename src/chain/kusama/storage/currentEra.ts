import { storage } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { BlockHeader, ICurrentEraStorageLoader } from '@/indexer';

export class CurrentEraStorageLoader implements ICurrentEraStorageLoader {
  load(blockHeader: BlockHeader) {
    const { currentEra } = storage.staking;

    if (currentEra.v1020.is(blockHeader)) {
      return currentEra.v1020.get(blockHeader);
    } else if (currentEra.v1050.is(blockHeader)) {
      return currentEra.v1050.get(blockHeader);
    }

    throw new UnknownVersionError(currentEra);
  }
}
