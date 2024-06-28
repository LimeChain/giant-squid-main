import {sts, Result, Option, Bytes, BitSequence} from './support'

export type AccountId32 = Bytes

export interface StakingLedger {
    stash: AccountId32
    total: bigint
    active: bigint
    unlocking: UnlockChunk[]
    legacyClaimedRewards: number[]
}

export interface UnlockChunk {
    value: bigint
    era: number
}

export const StakingLedger: sts.Type<StakingLedger> = sts.struct(() => {
    return  {
        stash: AccountId32,
        total: sts.bigint(),
        active: sts.bigint(),
        unlocking: sts.array(() => UnlockChunk),
        legacyClaimedRewards: sts.array(() => sts.number()),
    }
})

export const UnlockChunk: sts.Type<UnlockChunk> = sts.struct(() => {
    return  {
        value: sts.bigint(),
        era: sts.number(),
    }
})

export const AccountId32 = sts.bytes()
