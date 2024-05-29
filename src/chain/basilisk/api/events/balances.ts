import { Event } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../../../../utils'
import { events } from '../../types'

const Transfer = {
    decode(event: Event) {
        const { transfer } = events.balances
        if (transfer.v16.is(event)) {
            let [from, to, amount] = transfer.v16.decode(event)
            return { from, to, amount }
        } else if (transfer.v38.is(event)) {
            return transfer.v38.decode(event)
        } else {
            throw new UnknownVersionError(transfer)
        }
    },
}

export default {
    Transfer,
}
