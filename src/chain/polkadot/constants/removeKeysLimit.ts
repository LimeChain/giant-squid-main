import { constants } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { IRemoveKeysLimitConstantGetter, BlockHeader } from '@/indexer';

export class RemoveKeysLimitConstantGetter implements IRemoveKeysLimitConstantGetter {
  get(blockHeader: BlockHeader) {
    const { removeKeysLimit } = constants.crowdloan;

    if (removeKeysLimit.v9110.is(blockHeader)) {
      return removeKeysLimit.v9110.get(blockHeader);
    }

    throw new UnknownVersionError(removeKeysLimit);
  }
}
