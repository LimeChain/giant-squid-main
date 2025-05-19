import { calls, v9280, v9420 } from '@/chain/polkadot/types';
import { Call, INominationPoolsUpdateRolesCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

const decodeRole = (role: v9280.Type_372 | v9420.Type_302) => {
  switch (role.__kind) {
    case 'Set':
      return role.value;

    default:
      return;
  }
};

export class UpdateRolesCallPalletDecoder implements INominationPoolsUpdateRolesCallPalletDecoder {
  decode(call: Call) {
    const { updateRoles } = calls.nominationPools;

    if (updateRoles.v9280.is(call)) {
      const { poolId, newRoot, newNominator, newStateToggler } = updateRoles.v9280.decode(call);

      return {
        poolId: poolId.toString(),
        root: decodeRole(newRoot),
        nominator: decodeRole(newNominator),
        toggler: decodeRole(newStateToggler),
      };
    } else if (updateRoles.v9420.is(call)) {
      const { poolId, newRoot, newNominator, newBouncer } = updateRoles.v9420.decode(call);

      return {
        poolId: poolId.toString(),
        root: decodeRole(newRoot),
        nominator: decodeRole(newNominator),
        toggler: decodeRole(newBouncer),
      };
    }

    throw new DataNotDecodableError(updateRoles, call);
  }
}
