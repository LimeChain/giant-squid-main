import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_487: sts.Type<Type_487> = sts.closedEnum(() => {
    return  {
        Noop: sts.unit(),
        Remove: sts.unit(),
        Set: AccountId32,
    }
})

export type Type_487 = Type_487_Noop | Type_487_Remove | Type_487_Set

export interface Type_487_Noop {
    __kind: 'Noop'
}

export interface Type_487_Remove {
    __kind: 'Remove'
}

export interface Type_487_Set {
    __kind: 'Set'
    value: AccountId32
}

export type AccountId32 = Bytes

export const AccountId32 = sts.bytes()

export const Id = sts.number()
