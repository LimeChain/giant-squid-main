// @ts-ignore
import { PoolStatus } from '@/model';
import { events, v9280 } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { Event, INominationPoolsStateChangedEventPalletDecoder } from '@/indexer';

const decodeNewState = (newState: v9280.PoolState) => {
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

    if (stateChanged.v9280.is(event)) {
      const { poolId, newState } = stateChanged.v9280.decode(event);

      return {
        poolId: poolId.toString(),
        newState: decodeNewState(newState),
      };
    }

    throw new UnknownVersionError(stateChanged);
  }
}
