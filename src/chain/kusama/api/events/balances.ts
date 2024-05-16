import { Event } from '@subsquid/substrate-processor';
import { UnknownVersionError } from '../../../../utils'
import { events } from '../../types';

const Transfer = {
    decode(event: Event) {
        let transfer = events.balances.transfer;

        if (transfer.v1020.is(event)) {
            const [from, to, amount] = transfer.v1020.decode(event)
            return { from, to, amount }
        } else if (transfer.v1050.is(event)) {
            const [from, to, amount] = transfer.v1050.decode(event)
            return { from, to, amount }
        } else if (transfer.v9130.is(event)) {
            return transfer.v9130.decode(event)
        } else {
            throw new UnknownVersionError(event);
        }
    },
}

export default {
    Transfer,
}
