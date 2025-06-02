import { events, v9220 } from '@/chain/kusama/types';
import { DataNotDecodableError, UnknownVersionError } from '@/utils';
import { Event, INominationPoolsStateChangedEventPalletDecoder } from '@/indexer';
// @ts-ignore
import { PoolStatus } from '@/model';

const decodeNewState = (newState: v9220.PoolState) => {
  switch (newState.__kind) {
    case 'Open':
      return PoolStatus.Open;
    case 'Blocked':
      return PoolStatus.Blocked;
    case 'Destroying':
      return PoolStatus.Destroying;

    default:
      throw new Error(`Unknown state: ${newState}`);
  }
};
export class NominationPoolsStateChangedEventPalletDecoder implements INominationPoolsStateChangedEventPalletDecoder {
  decode(event: Event) {
    const { stateChanged } = events.nominationPools;

    if (stateChanged.v9220.is(event)) {
      const { poolId, newState } = stateChanged.v9220.decode(event);

      return {
        poolId: poolId.toString(),
        newState: decodeNewState(newState),
      };
    }

    throw new UnknownVersionError(stateChanged);
  }
}
