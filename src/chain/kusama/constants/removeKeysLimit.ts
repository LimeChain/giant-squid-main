import { constants } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { IRemoveKeysLimitConstantGetter, BlockHeader } from '@/indexer';

export class RemoveKeysLimitConstantGetter implements IRemoveKeysLimitConstantGetter {
  get(blockHeader: BlockHeader) {
    const { removeKeysLimit } = constants.crowdloan;

    if (removeKeysLimit.v9010.is(blockHeader)) {
      return removeKeysLimit.v9010.get(blockHeader);
    }

    throw new UnknownVersionError(removeKeysLimit);
  }
}
