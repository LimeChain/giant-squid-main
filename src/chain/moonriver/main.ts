import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/moonriver/decoders/events/balances/transfer';
import { SUBSQUID_NETWORK_URL } from '@/utils/constants';
import { ParachainStakingCandidateBondedLessEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/candidateBondedLess';
import { ParachainStakingCandidateBondedMoreEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/candidateBondedMore';
import { ParachainStakingCandidateLeftEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/candidateLeft';
import { ParachainStakingCompoundEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/compounded';
import { ParachainStakingDelegationEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/delegation';
import { ParachainStakingDelegationDecreasedEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/delegationDecreased';
import { ParachainStakingDelegationIncreasedEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/delegationIncreased';
import { ParachainStakingDelegationKickedEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/delegationKicked';
import { ParachainStakingDelegationRevokedEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/delegationRevoked';
import { ParachainStakingRewardEventPalletDecoder } from '@/chain/moonriver/decoders/events/parachain-staking/rewarded';
import { DelegateCallPalletDecoder } from '@/chain/moonriver/decoders/calls/conviction-voting/delegate';
import { RemoveVoteCallPalletDecoder } from '@/chain/moonriver/decoders/calls/conviction-voting/removeVote';
import { UndelegateCallPalletDecoder } from '@/chain/moonriver/decoders/calls/conviction-voting/undelegate';
import { UnlockCallPalletDecoder } from '@/chain/moonriver/decoders/calls/conviction-voting/unlock';
import { VoteCallPalletDecoder } from '@/chain/moonriver/decoders/calls/conviction-voting/vote';
import { SentEventPalletDecoder } from '@/chain/moonriver/decoders/events/polkadotXcm/sent';
import { TransferredAssetsEventPalletDecoder } from '@/chain/moonriver/decoders/events/xTokens/transferredAssets';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/moonriver/decoders/events/xTokens/transferredMultiAssets';
import { EvmLogEventPalletDecoder } from '@/chain/moonriver/decoders/events/evm/log';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
    gateway: `${SUBSQUID_NETWORK_URL}/moonriver-substrate`,
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
      'XTokens.TransferredAssets': setupPallet({ decoder: new TransferredAssetsEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
      'EVM.Log': setupPallet({ decoder: new EvmLogEventPalletDecoder() }),
    },
    calls: {
      'ConvictionVoting.unlock': setupPallet({ decoder: new UnlockCallPalletDecoder() }),
      'ConvictionVoting.delegate': setupPallet({ decoder: new DelegateCallPalletDecoder() }),
      'ConvictionVoting.undelegate': setupPallet({ decoder: new UndelegateCallPalletDecoder() }),
      'ConvictionVoting.vote': setupPallet({ decoder: new VoteCallPalletDecoder() }),
      'ConvictionVoting.remove_vote': setupPallet({ decoder: new RemoveVoteCallPalletDecoder() }),
    },
  },
});
