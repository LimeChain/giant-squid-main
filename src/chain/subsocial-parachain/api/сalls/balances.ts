import { Call } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../../../../utils'
import { calls } from '../../types'

const transfer = {
    decode(call: Call) {
        const { transfer } = calls.balances
        if (transfer.v1.is(call)) {
            return transfer.v1.decode(call)
        } else {
            throw new UnknownVersionError(transfer)
        }
    },
}

const transfer_all = {
    decode(call: Call) {
        const { transferAll } = calls.balances
        if (transferAll.v1.is(call)) {
            return transferAll.v1.decode(call)
        } else {
            throw new UnknownVersionError(transferAll)
        }
    },
}

const force_transfer = {
    decode(call: Call) {
        const { forceTransfer } = calls.balances
        if (forceTransfer.v1.is(call)) {
            return forceTransfer.v1.decode(call)
        } else {
            throw new UnknownVersionError(forceTransfer)
        }
    },
}

const transfer_keep_alive = {
    decode(call: Call) {
        const { transferKeepAlive } = calls.balances
        if (transferKeepAlive.v1.is(call)) {
            return transferKeepAlive.v1.decode(call)
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
