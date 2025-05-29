import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/turing/decoders/events/balances/transfer';
import { ParachainStakingRewardEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/rewarded';
import { ParachainStakingCandidateBondedLessEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/candidateBondedLess';
import { ParachainStakingCandidateBondedMoreEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/candidateBondedMore';
import { ParachainStakingCandidateLeftEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/candidateLeft';
import { ParachainStakingCompoundEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/compounded';
import { ParachainStakingDelegationEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/delegation';
import { ParachainStakingDelegationDecreasedEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/delegationDecreased';
import { ParachainStakingDelegationIncreasedEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/delegationIncreased';
import { ParachainStakingDelegationKickedEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/delegationKicked';
import { ParachainStakingDelegationRevokedEventPalletDecoder } from '@/chain/turing/decoders/events/parachain-staking/delegationRevoked';
import { SentEventPalletDecoder } from '@/chain/turing/decoders/events/polkadotXcm/sent';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/turing/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    prefix: 51,
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
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
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
    },
  },
});
