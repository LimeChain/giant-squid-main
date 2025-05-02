import {sts, Result, Option, Bytes, BitSequence} from './support'

export const AccountId20 = sts.bytes()

export const Type_121: sts.Type<Type_121> = sts.closedEnum(() => {
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

export type Type_121 = Type_121_Split | Type_121_SplitAbstain | Type_121_Standard

export interface Type_121_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_121_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_121_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
