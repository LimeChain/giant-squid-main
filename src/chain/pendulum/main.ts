import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/pendulum/decoders/events/balances/transfer';
import { ParachainStakingRewardEventPalletDecoder } from '@/chain/pendulum/decoders/events/parachain-staking/rewarded';
import { SentEventPalletDecoder } from '@/chain/pendulum/decoders/events/polkadotXcm/sent';
import { TransferredMultiAssetsEventPalletDecoder } from '@/chain/pendulum/decoders/events/xTokens/transferredMultiAssets';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      'ParachainStaking.Rewarded': setupPallet({ decoder: new ParachainStakingRewardEventPalletDecoder() }),
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
      'XTokens.TransferredMultiAssets': setupPallet({ decoder: new TransferredMultiAssetsEventPalletDecoder() }),
    },
  },
});
