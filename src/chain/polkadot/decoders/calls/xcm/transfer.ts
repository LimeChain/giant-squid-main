import {
  V2WeightLimit,
  VersionedMultiAssets_V0 as VersionedMultiAssets_V0_V9140,
  VersionedMultiAssets_V1 as VersionedMultiAssets_V1_V9140,
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9140,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9140,
} from '@/chain/polkadot/types/v9140';
import {
  VersionedMultiAssets_V0 as asVersionedMultiAssets_V0_V9370,
  VersionedMultiAssets_V1 as asVersionedMultiAssets_V1_V9370,
  VersionedMultiLocation_V0 as VersionedMultiLocation_V0_V9370,
  VersionedMultiLocation_V1 as VersionedMultiLocation_V1_V9370,
} from '@/chain/polkadot/types/v9370';
import {
  VersionedMultiAssets_V2 as VersionedMultiAssets_V2_V9420,
  VersionedMultiAssets_V3 as VersionedMultiAssets_V3_V9420,
  VersionedMultiLocation_V2 as VersionedMultiLocation_V2_V9420,
  VersionedMultiLocation_V3 as VersionedMultiLocation_V3_V9420,
} from '@/chain/polkadot/types/v9420';
import {
  V3WeightLimit,
  VersionedAssets_V2 as VersionedAssets_V2_V100200,
  VersionedAssets_V3 as VersionedAssets_V3_V100200,
  VersionedAssets_V4 as VersionedAssets_V4_V100200,
  VersionedLocation_V2 as VersionedLocation_V2_V100200,
  VersionedLocation_V3 as VersionedLocation_V3_V100200,
  VersionedLocation_V4 as VersionedLocation_V4_V100200,
} from '@/chain/polkadot/types/v1002000';

export function decodeV0Dest(dest: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): { parachainDestination: string } {
  let parachainDestination: string = '';

  // most common occuranace of V0 type calls = X1 + Parachain
  if (dest.value.__kind === 'X1' && dest.value.value.__kind === 'Parachain') {
    parachainDestination = dest.value.value.value.toString();
  }

  return { parachainDestination };
}

export function decodeV1ToV3Dest(
  dest:
    | VersionedMultiLocation_V1_V9140
    | VersionedMultiLocation_V1_V9370
    | VersionedMultiLocation_V2_V9420
    | VersionedLocation_V2_V100200
    | VersionedMultiLocation_V3_V9420
    | VersionedLocation_V3_V100200
): { parachainDestination: string } {
  let parachainDestination: string = '';

  // most common occuranace of V1 type calls = X1 + Parachain
  if (dest.value.interior.__kind === 'X1' && dest.value.interior.value.__kind === 'Parachain') {
    parachainDestination = dest.value.interior.value.value.toString();
  }

  return { parachainDestination };
}

export function decodeV4Dest(dest: VersionedLocation_V4_V100200): { parachainDestination: string } {
  let parachainDestination: string = '';

  // most common occuranace of V4 type calls = X1 + Parachain
  if (dest.value.interior.__kind === 'X1' && dest.value.interior.value[0].__kind === 'Parachain') {
    parachainDestination = dest.value.interior.value[0].value.toString();
  }

  return { parachainDestination };
}

export function decodeV0Beneficiary(_beneficiary: VersionedMultiLocation_V0_V9140 | VersionedMultiLocation_V0_V9370): {
  beneficiaryKey: string;
} {
  let beneficiaryKey: string = '';

  // only support X1 __kind
  if (_beneficiary.value.__kind === 'X1') {
    switch (_beneficiary.value.value.__kind) {
      case 'AccountId32':
        beneficiaryKey = _beneficiary.value.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey = _beneficiary.value.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey = _beneficiary.value.value.key;
        break;
    }
  }

  return { beneficiaryKey };
}

export function decodeV1ToV3Beneficiary(
  _beneficiary:
    | VersionedMultiLocation_V1_V9140
    | VersionedMultiLocation_V1_V9370
    | VersionedMultiLocation_V2_V9420
    | VersionedLocation_V2_V100200
    | VersionedMultiLocation_V3_V9420
    | VersionedLocation_V3_V100200
): { beneficiaryKey: string } {
  let beneficiaryKey: string = '';

  // only support X1 __kind
  if (_beneficiary.value.interior.__kind === 'X1') {
    switch (_beneficiary.value.interior.value.__kind) {
      case 'AccountId32':
        beneficiaryKey = _beneficiary.value.interior.value.id;
        break;
      case 'AccountIndex64':
        beneficiaryKey = _beneficiary.value.interior.value.index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey = _beneficiary.value.interior.value.key;
        break;
    }
  }

  return { beneficiaryKey };
}

export function decodeV4Beneficiary(_beneficiary: VersionedLocation_V4_V100200): {
  beneficiaryKey: string;
} {
  let beneficiaryKey: string = '';

  // only support X1 __kind
  if (_beneficiary.value.interior.__kind === 'X1') {
    switch (_beneficiary.value.interior.value[0].__kind) {
      case 'AccountId32':
        beneficiaryKey = _beneficiary.value.interior.value[0].id;
        break;
      case 'AccountIndex64':
        beneficiaryKey = _beneficiary.value.interior.value[0].index.toString();
        break;
      case 'AccountKey20':
        beneficiaryKey = _beneficiary.value.interior.value[0].key;
        break;
    }
  }

  return { beneficiaryKey };
}

export function decodeV0Assets(_assets: VersionedMultiAssets_V0_V9140 | asVersionedMultiAssets_V0_V9370): {
  amount: bigint;
} {
  let amount: bigint = 0n;

  // Only support ConcreteFungible __kind as it is the most common
  if (_assets.value[0].__kind === 'ConcreteFungible') {
    amount = _assets.value[0].amount;
  }

  return { amount };
}

export function decodeV1ToV3Assets(
  _assets:
    | VersionedMultiAssets_V1_V9140
    | asVersionedMultiAssets_V1_V9370
    | VersionedMultiAssets_V2_V9420
    | VersionedMultiAssets_V3_V9420
    | VersionedAssets_V2_V100200
    | VersionedAssets_V3_V100200
): { amount: bigint } {
  let amount: bigint = 0n;

  switch (_assets.__kind) {
    case 'V1':
    case 'V2':
    case 'V3':
      if (_assets.value[0].id.__kind === 'Concrete') {
        if (_assets.value[0].fun.__kind === 'Fungible') {
          amount = _assets.value[0].fun.value;
        }
      }
      break;
  }

  return { amount };
}

export function decodeV4Assets(_assets: VersionedAssets_V4_V100200): {
  amount: bigint;
} {
  let amount: bigint = 0n;

  // Only support __kind === 'Here' && fun.__kind === 'Fungible' (most common)
  if (_assets.value[0].id.interior.__kind === 'Here') {
    if (_assets.value[0].fun.__kind === 'Fungible') {
      amount = _assets.value[0].fun.value;
    }
  }

  return { amount };
}

export function decodeV2WeightLimit(_weightLimit: V2WeightLimit): { limit: bigint | null } {
  let limit: bigint | null = null;

  if (_weightLimit.__kind === 'Limited') {
    limit = _weightLimit.value;
  } else {
    limit = null;
  }

  return { limit };
}

export function decodeV3WeightLimit(_weightLimit: V3WeightLimit): { limit: bigint | null } {
  let limit: bigint | null = null;

  if (_weightLimit.__kind === 'Limited') {
    limit = _weightLimit.value.proofSize;
  } else {
    limit = null;
  }

  return { limit };
}
