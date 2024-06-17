import { PayoutStakersCallPalletDecoder as KusamaPayoutStakersCallPalletDecoder } from '../../../../chain/kusama/decoders/calls/staking/payoutStakers';
import { PayoutStakersCallPalletDecoder as PolkadotPayoutStakersCallPalletDecoder } from '../../../../chain/polkadot/decoders/calls/staking/payoutStakers';
import { PayoutStakersCallPalletDecoder as PolkadexPayoutStakersCallPalletDecoder } from '../../../../chain/polkadex/decoders/calls/staking/payoutStakers';
import { PayoutStakersCallPalletDecoder as TernoaPayoutStakersCallPalletDecoder } from '../../../../chain/ternoa/decoders/calls/staking/payoutStakers';
import { ChainPayoutStakersDecoder } from '../../../types';

export const payoutStakersDecoders: Map<string, ChainPayoutStakersDecoder> = new Map([
  ['kusama', { payoutStakerDecoder: KusamaPayoutStakersCallPalletDecoder }],
  ['polkadot', { payoutStakerDecoder: PolkadotPayoutStakersCallPalletDecoder }],
  ['polkadex', { payoutStakerDecoder: PolkadexPayoutStakersCallPalletDecoder }],
  ['ternoa', { payoutStakerDecoder: TernoaPayoutStakersCallPalletDecoder }],
]);
