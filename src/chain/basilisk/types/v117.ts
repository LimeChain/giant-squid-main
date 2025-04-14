import {sts, Result, Option, Bytes, BitSequence} from './support'

export const AccountId32 = sts.bytes()

export const Type_194: sts.Type<Type_194> = sts.closedEnum(() => {
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

export type Type_194 = Type_194_Split | Type_194_SplitAbstain | Type_194_Standard

export interface Type_194_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_194_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_194_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
