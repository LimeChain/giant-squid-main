import { Event } from '@subsquid/substrate-processor'
import { UnknownVersionError } from '../../../../utils'
import { events } from '../../types'

const Transfer = {
  decode(event: Event) {
    const { transfer } = events.balances
    if (transfer.v932.is(event)) {
      return transfer.v932.decode(event)
    } else {
      throw new UnknownVersionError(transfer)
    }
  },
}

export default {
  Transfer,
}
