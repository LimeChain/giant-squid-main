import { ensureEnvVariable } from '@/utils';
import { Indexer, setupPallet } from '@/indexer';
import { TransferEventPalletDecoder } from '@/chain/kilt/decoders/events/balances/transfer';
import { ParachainStakingRewardEventPalletDecoder } from '@/chain/kilt/decoders/events/parachain-staking/rewarded';
import { SentEventPalletDecoder } from '@/chain/kilt/decoders/events/polkadotXcm/sent';

export const indexer = new Indexer({
  config: {
    chain: ensureEnvVariable('CHAIN'),
    endpoint: ensureEnvVariable('CHAIN_RPC_ENDPOINT'),
  },
  pallets: {
    events: {
      // 'Balances.Transfer': setupPallet({ decoder: new TransferEventPalletDecoder() }),
      // 'ParachainStaking.Rewarded': setupPallet({ decoder: new ParachainStakingRewardEventPalletDecoder() }),
      'PolkadotXcm.Sent': setupPallet({ decoder: new SentEventPalletDecoder() }),
    },
  },
});
