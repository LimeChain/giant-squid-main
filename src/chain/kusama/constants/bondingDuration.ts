import { constants } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { IBondingDurationConstantGetter, BlockHeader } from '@/indexer';

export class BondingDurationConstantGetter implements IBondingDurationConstantGetter {
  get(blockHeader: BlockHeader) {
    const { bondingDuration } = constants.staking;

    if (bondingDuration.v1020.is(blockHeader)) {
      return bondingDuration.v1020.get(blockHeader);
    }

    throw new UnknownVersionError(bondingDuration);
  }
}
