import { constants } from '../types'
import { UnknownVersionError } from '../../../utils';
import { IBondingDurationConstantGetter, BlockHeader } from "../../../indexer";

export class BondingDurationConstantGetter implements IBondingDurationConstantGetter {
  get(blockHeader: BlockHeader) {
    const { bondingDuration } = constants.staking;

    if (bondingDuration.v0.is(blockHeader)) {
      return bondingDuration.v0.get(blockHeader);
    }

    throw new UnknownVersionError(bondingDuration);
  }
}