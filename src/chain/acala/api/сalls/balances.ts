import { Call } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../../../../utils'
import { calls } from '../../types'


const transfer = {
    decode(call: Call) {
        const { transfer } = calls.balances;
        if (transfer.v2000.is(call)) {
            return transfer.v2000.decode(call)
        } else {
            throw new UnknownVersionError(transfer)
        }
    },
}

const transfer_all = {
    decode(call: Call) {
        const { transferAll } = calls.balances;
        if (transferAll.v2000.is(call)) {
            return transferAll.v2000.decode(call)
        } else {
            throw new UnknownVersionError(transferAll)
        }
    },
}

const force_transfer = {
    decode(call: Call) {

        const { forceTransfer } = calls.balances;
        if (forceTransfer.v2000.is(call)) {
            return forceTransfer.v2000.decode(call)
        } else {
            throw new UnknownVersionError(forceTransfer)
        }
    },
}

const transfer_keep_alive = {
    decode(call: Call) {
        const { transferKeepAlive } = calls.balances;
        if (transferKeepAlive.v2000.is(call)) {
            return transferKeepAlive.v2000.decode(call)
        } else {
            throw new UnknownVersionError(transferKeepAlive)
        }
    },
}

export default {
    transfer,
    transfer_all,
    transfer_keep_alive,
    force_transfer,
}
