import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Type_204: sts.Type<Type_204> = sts.closedEnum(() => {
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

export type Type_204 = Type_204_Locked1x | Type_204_Locked2x | Type_204_Locked3x | Type_204_Locked4x | Type_204_Locked5x | Type_204_Locked6x | Type_204_None

export interface Type_204_Locked1x {
    __kind: 'Locked1x'
}

export interface Type_204_Locked2x {
    __kind: 'Locked2x'
}

export interface Type_204_Locked3x {
    __kind: 'Locked3x'
}

export interface Type_204_Locked4x {
    __kind: 'Locked4x'
}

export interface Type_204_Locked5x {
    __kind: 'Locked5x'
}

export interface Type_204_Locked6x {
    __kind: 'Locked6x'
}

export interface Type_204_None {
    __kind: 'None'
}

export const AccountId20 = sts.bytes()

export const Type_202: sts.Type<Type_202> = sts.closedEnum(() => {
    return  {
        Split: sts.enumStruct({
            aye: sts.bigint(),
            nay: sts.bigint(),
        }),
        Standard: sts.enumStruct({
            vote: sts.number(),
            balance: sts.bigint(),
        }),
    }
})

export type Type_202 = Type_202_Split | Type_202_Standard

export interface Type_202_Split {
    __kind: 'Split'
    aye: bigint
    nay: bigint
}

export interface Type_202_Standard {
    __kind: 'Standard'
    vote: number
    balance: bigint
}
