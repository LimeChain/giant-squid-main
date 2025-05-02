import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_372: sts.Type<Type_372> = sts.closedEnum(() => {
    return  {
        Noop: sts.unit(),
        Remove: sts.unit(),
        Set: AccountId32,
    }
})

export type Type_372 = Type_372_Noop | Type_372_Remove | Type_372_Set

export interface Type_372_Noop {
    __kind: 'Noop'
}

export interface Type_372_Remove {
    __kind: 'Remove'
}

export interface Type_372_Set {
    __kind: 'Set'
    value: AccountId32
}

export type AccountId32 = Bytes

export const PoolState: sts.Type<PoolState> = sts.closedEnum(() => {
    return  {
        Blocked: sts.unit(),
        Destroying: sts.unit(),
        Open: sts.unit(),
    }
})

export type PoolState = PoolState_Blocked | PoolState_Destroying | PoolState_Open

export interface PoolState_Blocked {
    __kind: 'Blocked'
}

export interface PoolState_Destroying {
    __kind: 'Destroying'
}

export interface PoolState_Open {
    __kind: 'Open'
}

export const AccountId32 = sts.bytes()
