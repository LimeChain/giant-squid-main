import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v1020 from '../v1020'

export const bondingDuration =  {
    /**
     *  Number of eras that staked funds must remain bonded for.
     */
    v1020: new ConstantType(
        'Staking.BondingDuration',
        v1020.EraIndex
    ),
}
