import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId = Bytes

export interface StakingLedger {
    stash: AccountId
    total: bigint
    active: bigint
    unlocking: UnlockChunk[]
    claimedRewards: EraIndex[]
}

export type EraIndex = number

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
        claimedRewards: sts.array(() => EraIndex),
    }
})

export const UnlockChunk: sts.Type<UnlockChunk> = sts.struct(() => {
    return  {
        value: sts.bigint(),
        era: sts.number(),
    }
})

export const EraIndex = sts.number()

export const AccountId = sts.bytes()
