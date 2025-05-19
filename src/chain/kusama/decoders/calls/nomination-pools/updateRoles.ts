import { calls, v9230, v9420 } from '@/chain/kusama/types';
import { Call, INominationPoolsUpdateRolesCallPalletDecoder } from '@/indexer';
import { DataNotDecodableError } from '@/utils';

const decodeRole = (role: v9230.Type_487 | v9420.Type_312) => {
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

    if (updateRoles.v9230.is(call)) {
      const { poolId, newRoot, newNominator, newStateToggler } = updateRoles.v9230.decode(call);

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
    } else if (updateRoles.v9220.is(call)) {
      const { poolId, root, nominator, stateToggler } = updateRoles.v9220.decode(call);
      return {
        poolId: poolId.toString(),
        root,
        nominator,
        toggler: stateToggler,
      };
    }

    throw new DataNotDecodableError(updateRoles, call);
  }
}
