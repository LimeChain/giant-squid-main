import {sts, Result, Option, Bytes, BitSequence} from './support'

export type EraIndex = number

export type AccountId = Bytes

export interface StakingLedger {
    stash: AccountId
    total: bigint
    active: bigint
    unlocking: UnlockChunk[]
    claimedRewards: EraIndex[]
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

export const RewardDestination: sts.Type<RewardDestination> = sts.closedEnum(() => {
    return  {
        Account: AccountId,
        Controller: sts.unit(),
        None: sts.unit(),
        Staked: sts.unit(),
        Stash: sts.unit(),
    }
})

export type RewardDestination = RewardDestination_Account | RewardDestination_Controller | RewardDestination_None | RewardDestination_Staked | RewardDestination_Stash

export interface RewardDestination_Account {
    __kind: 'Account'
    value: AccountId
}

export interface RewardDestination_Controller {
    __kind: 'Controller'
}

export interface RewardDestination_None {
    __kind: 'None'
}

export interface RewardDestination_Staked {
    __kind: 'Staked'
}

export interface RewardDestination_Stash {
    __kind: 'Stash'
}

export const LookupSource = sts.bytes()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
