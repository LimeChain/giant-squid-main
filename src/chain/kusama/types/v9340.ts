import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_144: sts.Type<Type_144> = sts.closedEnum(() => {
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

export type Type_144 = Type_144_Split | Type_144_SplitAbstain | Type_144_Standard

export interface Type_144_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_144_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_144_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
