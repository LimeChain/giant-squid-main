import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_203: sts.Type<Type_203> = sts.closedEnum(() => {
    return  {
        Split: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
        }),
        SplitAbstain: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
            abstain: sts.bigint(),
        }),
        Standard: sts.enumStruct({
            vote: sts.number(),
            balance: sts.bigint(),
        }),
    }
})

export type Type_203 = Type_203_Split | Type_203_SplitAbstain | Type_203_Standard

export interface Type_203_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_203_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_203_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
