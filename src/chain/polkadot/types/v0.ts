import {sts, Result, Option, Bytes, BitSequence} from './support'

export type EraIndex = number

export const EraIndex = sts.number()

export const Balance = sts.bigint()

export const AccountId = sts.bytes()
