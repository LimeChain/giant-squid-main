// import {UnknownVersionError} from '../../../../utils'
// import {
//     BalancesForceTransferCall,
//     BalancesTransferAllCall,
//     BalancesTransferCall,
//     BalancesTransferKeepAliveCall,
// } from '../../types/calls'
// import {Call, ChainContext} from '../../types/support'

// const transfer = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new BalancesTransferCall(ctx, call)
//         if (e.isV2000) {
//             return e.asV2000
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

// const transfer_all = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new BalancesTransferAllCall(ctx, call)
//         if (e.isV2000) {
//             return e.asV2000
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

// const force_transfer = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new BalancesForceTransferCall(ctx, call)
//         if (e.isV2000) {
//             return e.asV2000
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

// const transfer_keep_alive = {
//     decode(ctx: ChainContext, call: Call) {
//         let e = new BalancesTransferKeepAliveCall(ctx, call)
//         if (e.isV2000) {
//             return e.asV2000
//         } else {
//             throw new UnknownVersionError(e)
//         }
//     },
// }

// export default {
//     transfer,
//     transfer_all,
//     transfer_keep_alive,
//     force_transfer,
// }

export interface Calls {}

export const calls: Calls = {};
