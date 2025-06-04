import {sts, Result, Option, Bytes, BitSequence} from './support'

export const EvmLog: sts.Type<EvmLog> = sts.struct(() => {
    return  {
        address: H160,
        topics: sts.array(() => H256),
        data: sts.bytes(),
    }
})

export const H256 = sts.bytes()

export const H160 = sts.bytes()

export interface EvmLog {
    address: H160
    topics: H256[]
    data: Bytes
}

export type H256 = Bytes

export type H160 = Bytes

export const BalanceOf = sts.bigint()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
