import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'
import * as v0 from '../v0'

export const bondingDuration =  {
    /**
     *  Number of eras that staked funds must remain bonded for.
     */
    v0: new ConstantType(
        'Staking.BondingDuration',
        v0.EraIndex
    ),
}
