import {sts, Result, Option, Bytes, BitSequence} from './support'

export const Percent = sts.number()

export const DelegatorAdded: sts.Type<DelegatorAdded> = sts.closedEnum(() => {
    return  {
        AddedToBottom: sts.unit(),
        AddedToTop: sts.enumStruct({
            newTotal: sts.bigint(),
        }),
    }
})

export type DelegatorAdded = DelegatorAdded_AddedToBottom | DelegatorAdded_AddedToTop

export interface DelegatorAdded_AddedToBottom {
    __kind: 'AddedToBottom'
}

export interface DelegatorAdded_AddedToTop {
    __kind: 'AddedToTop'
    newTotal: bigint
}

export const AccountId32 = sts.bytes()
