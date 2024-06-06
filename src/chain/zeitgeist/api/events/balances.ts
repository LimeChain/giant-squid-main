import { Event } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../../../../utils'
import { events } from '../../types'

const Transfer = {
    decode(event: Event) {
        const { transfer } = events.balances
        if (transfer.v26.is(event)) {
            let [from, to, amount] = transfer.v26.decode(event)
            return { from, to, amount }
        } else if (transfer.v34.is(event)) {
            return transfer.v34.decode(event)
        } else {
            throw new UnknownVersionError(transfer)
        }
    },
}

export default {
    Transfer,
}
