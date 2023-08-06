import {UnknownVersionError} from '@gs/util/errors'
import {BalancesTransferEvent} from '../../types/events'
import {ChainContext, Event} from '../../types/support'

export const Transfer = {
    decode(event: Event) {
        let e = new BalancesTransferEvent(event)
        if (e.isV100) {
            let [from, to, amount] = e.asV100
            return {from, to, amount}
        } else if (e.isV104) {
            return e.asV104
        } else {
            throw new UnknownVersionError(e)
        }
    },
}

export default {
    Transfer,
}
