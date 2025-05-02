import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_212: sts.Type<Type_212> = sts.closedEnum(() => {
    return  {
        Locked1x: sts.unit(),
        Locked2x: sts.unit(),
        Locked3x: sts.unit(),
        Locked4x: sts.unit(),
        Locked5x: sts.unit(),
        Locked6x: sts.unit(),
        None: sts.unit(),
    }
})

export type Type_212 = Type_212_Locked1x | Type_212_Locked2x | Type_212_Locked3x | Type_212_Locked4x | Type_212_Locked5x | Type_212_Locked6x | Type_212_None

export interface Type_212_Locked1x {
    __kind: 'Locked1x'
}

export interface Type_212_Locked2x {
    __kind: 'Locked2x'
}

export interface Type_212_Locked3x {
    __kind: 'Locked3x'
}

export interface Type_212_Locked4x {
    __kind: 'Locked4x'
}

export interface Type_212_Locked5x {
    __kind: 'Locked5x'
}

export interface Type_212_Locked6x {
    __kind: 'Locked6x'
}

export interface Type_212_None {
    __kind: 'None'
}

export const AccountId20 = sts.bytes()

export const Type_210: sts.Type<Type_210> = sts.closedEnum(() => {
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

export type Type_210 = Type_210_Split | Type_210_SplitAbstain | Type_210_Standard

export interface Type_210_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_210_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_210_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
