import {sts, Block, Bytes, Option, Result, ConstantType, RuntimeCtx} from '../support'

export const removeKeysLimit =  {
    /**
     *  Max number of storage keys to remove per extrinsic call.
     */
    v9110: new ConstantType(
        'Crowdloan.RemoveKeysLimit',
        sts.number()
    ),
}
