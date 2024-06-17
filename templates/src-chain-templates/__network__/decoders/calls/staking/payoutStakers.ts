// import { Call } from '@subsquid/substrate-processor';
// import { UnknownVersionError } from '../../../../../utils';
// import { calls } from '../../../types';
// import { IStakingPayoutStakersCallPalletDecoder } from '../../../../../indexer/registry';

// export class PayoutStakersCallPalletDecoder implements IStakingPayoutStakersCallPalletDecoder {
//   decode(event: Call) {
//     let call = calls.staking.payoutStakers;

//     if (call.v1058.is(event)) {
//       return call.v1058.decode(event);
//     } else {
//       throw new UnknownVersionError(event);
//     }
//   }
// }
