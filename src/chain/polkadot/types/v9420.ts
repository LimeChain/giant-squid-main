import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_153: sts.Type<Type_153> = sts.closedEnum(() => {
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

export type Type_153 = Type_153_Locked1x | Type_153_Locked2x | Type_153_Locked3x | Type_153_Locked4x | Type_153_Locked5x | Type_153_Locked6x | Type_153_None

export interface Type_153_Locked1x {
    __kind: 'Locked1x'
}

export interface Type_153_Locked2x {
    __kind: 'Locked2x'
}

export interface Type_153_Locked3x {
    __kind: 'Locked3x'
}

export interface Type_153_Locked4x {
    __kind: 'Locked4x'
}

export interface Type_153_Locked5x {
    __kind: 'Locked5x'
}

export interface Type_153_Locked6x {
    __kind: 'Locked6x'
}

export interface Type_153_None {
    __kind: 'None'
}

export const Type_151: sts.Type<Type_151> = sts.closedEnum(() => {
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

export type Type_151 = Type_151_Split | Type_151_SplitAbstain | Type_151_Standard

export interface Type_151_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_151_SplitAbstain {
    __kind: 'SplitAbstain'
    aye: bigint
    nay: bigint
    abstain: bigint
}

export interface Type_151_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}

export const MultiAddress: sts.Type<MultiAddress> = sts.closedEnum(() => {
    return  {
        Address20: sts.bytes(),
        Address32: sts.bytes(),
        Id: AccountId32,
        Index: sts.unit(),
        Raw: sts.bytes(),
    }
})

export const AccountId32 = sts.bytes()

export type MultiAddress = MultiAddress_Address20 | MultiAddress_Address32 | MultiAddress_Id | MultiAddress_Index | MultiAddress_Raw

export interface MultiAddress_Address20 {
    __kind: 'Address20'
    value: Bytes
}

export interface MultiAddress_Address32 {
    __kind: 'Address32'
    value: Bytes
}

export interface MultiAddress_Id {
    __kind: 'Id'
    value: AccountId32
}

export interface MultiAddress_Index {
    __kind: 'Index'
}

export interface MultiAddress_Raw {
    __kind: 'Raw'
    value: Bytes
}

export type AccountId32 = Bytes
