import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_312: sts.Type<Type_312> = sts.closedEnum(() => {
    return  {
        Noop: sts.unit(),
        Remove: sts.unit(),
        Set: AccountId32,
    }
})

export const AccountId32 = sts.bytes()

export type Type_312 = Type_312_Noop | Type_312_Remove | Type_312_Set

export interface Type_312_Noop {
    __kind: 'Noop'
}

export interface Type_312_Remove {
    __kind: 'Remove'
}

export interface Type_312_Set {
    __kind: 'Set'
    value: AccountId32
}

export type AccountId32 = Bytes

export const MultiAddress: sts.Type<MultiAddress> = sts.closedEnum(() => {
    return  {
        Address20: sts.bytes(),
        Address32: sts.bytes(),
        Id: AccountId32,
        Index: sts.unit(),
        Raw: sts.bytes(),
    }
})

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
