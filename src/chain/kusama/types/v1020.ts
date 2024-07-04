import {sts, Result, Option, Bytes, BitSequence} from './support'

export type EraIndex = number

export const EraIndex = sts.number()

export type AccountId = Bytes

export interface StakingLedger {
    stash: AccountId
    total: bigint
    active: bigint
    unlocking: UnlockChunk[]
}

export interface UnlockChunk {
    value: bigint
    era: number
}

export const StakingLedger: sts.Type<StakingLedger> = sts.struct(() => {
    return  {
        stash: AccountId,
        total: sts.bigint(),
        active: sts.bigint(),
        unlocking: sts.array(() => UnlockChunk),
    }
})

export const UnlockChunk: sts.Type<UnlockChunk> = sts.struct(() => {
    return  {
        value: sts.bigint(),
        era: sts.number(),
    }
})

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
