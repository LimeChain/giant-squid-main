import {UnknownVersionError} from '@gs/util/errors'
import {BalancesTransferEvent} from '../../types/events'
import {ChainContext, Event} from '../../types/support'

const Transfer = {
    decode(event: Event) {
        let e = new BalancesTransferEvent(event)
        if (e.isV21) {
            let [from, to, amount] = e.asV21
            return {from, to, amount}
        } else if (e.isV10400) {
            return e.asV10400
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export default {
    Transfer,
}
