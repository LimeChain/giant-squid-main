import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const removeKeysLimit =  {
    v9010: new ConstantType(
        'Crowdloan.RemoveKeysLimit',
        sts.number()
    ),
}
