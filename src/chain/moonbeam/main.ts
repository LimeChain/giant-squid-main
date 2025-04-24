import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { SUBSQUID_NETWORK_URL } from '@/utils/constants';
import { TransferEventPalletDecoder } from '@/chain/moonbeam/decoders/events/balances/transfer';
import { ParachainStakingRewardEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/rewarded';
import { ParachainStakingCompoundEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/compounded';
import { ParachainStakingDelegationEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/delegation';
import { ParachainStakingDelegationRevokedEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/delegationRevoked';
import { ParachainStakingDelegationIncreasedEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/delegationIncreased';
import { ParachainStakingDelegationDecreasedEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/delegationDecreased';
import { ParachainStakingDelegationKickedEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/delegationKicked';
import { ParachainStakingCandidateLeftEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/candidateLeft';
import { ParachainStakingCandidateBondedMoreEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/candidateBondedMore';
import { ParachainStakingCandidateBondedLessEventPalletDecoder } from '@/chain/moonbeam/decoders/events/parachain-staking/candidateBondedLess';
import { TransferAssetsCallDecoder } from '@/chain/moonbeam/decoders/calls/xcm/transferAssets';
import { LimitedReserveTransferAssetsCallDecoder } from './decoders/calls/xcm/limitedReserveTransferAssets';
import { LimitedTeleportAssetsCallDecoder } from './decoders/calls/xcm/limitedTeleportAssets';
import { ReserveTransferAssetsCallDecoder } from './decoders/calls/xcm/reserveTransferAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: `${SUBSQUID_NETWORK_URL}/moonbeam-substrate`,
  },
  pallets: {
    calls: {
      'PolkadotXcm.transfer_assets': setupPallet({ decoder: new TransferAssetsCallDecoder(), isEvmCompatable: true }),
      'PolkadotXcm.limited_reserve_transfer_assets': setupPallet({ decoder: new LimitedReserveTransferAssetsCallDecoder(), isEvmCompatable: true }),
      'PolkadotXcm.limited_teleport_assets': setupPallet({ decoder: new LimitedTeleportAssetsCallDecoder(), isEvmCompatable: true }),
      'PolkadotXcm.reserve_transfer_assets': setupPallet({ decoder: new ReserveTransferAssetsCallDecoder(), isEvmCompatable: true }),
      'PolkadotXcm.transfer_assets_using_type_and_then': setupPallet({ decoder: new TransferAssetsCallDecoder(), isEvmCompatable: true }),
    },
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'ParachainStaking.Rewarded': setupPallet({ decoder: new ParachainStakingRewardEventPalletDecoder() }),
      'ParachainStaking.Compounded': setupPallet({ decoder: new ParachainStakingCompoundEventPalletDecoder() }),
      'ParachainStaking.Delegation': setupPallet({ decoder: new ParachainStakingDelegationEventPalletDecoder() }),
      'ParachainStaking.DelegationRevoked': setupPallet({ decoder: new ParachainStakingDelegationRevokedEventPalletDecoder() }),
      'ParachainStaking.DelegationIncreased': setupPallet({ decoder: new ParachainStakingDelegationIncreasedEventPalletDecoder() }),
      'ParachainStaking.DelegationDecreased': setupPallet({ decoder: new ParachainStakingDelegationDecreasedEventPalletDecoder() }),
      'ParachainStaking.DelegationKicked': setupPallet({ decoder: new ParachainStakingDelegationKickedEventPalletDecoder() }),
      'ParachainStaking.CandidateLeft': setupPallet({ decoder: new ParachainStakingCandidateLeftEventPalletDecoder() }),
      'ParachainStaking.CandidateBondedMore': setupPallet({ decoder: new ParachainStakingCandidateBondedMoreEventPalletDecoder() }),
      'ParachainStaking.CandidateBondedLess': setupPallet({ decoder: new ParachainStakingCandidateBondedLessEventPalletDecoder() }),
    },
  },
});
