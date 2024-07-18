import { Parachain } from '@/model';
import { Action, ActionContext } from '../base';

// interface AddParachainTimelineData {
//     id: string;
//     action: ParachainTimelineAction;
//     parachain: () => Promise<Parachain>;
// }

// export class AddParachainTimelineAction extends Action<AddParachainTimelineData> {
//     protected async _perform(ctx: ActionContext): Promise<void> {
//         const parachain = await this.data.parachain();

//         const timeline = new ParachainTimeline({
//             id: this.data.id,
//             action: this.data.action,
//             parachain: parachain,
//             blockNumber: this.block.height,
//             extrinsicHash: this.extrinsic?.hash,
//             timestamp: new Date(this.block.timestamp ?? 0),
//         })

//         await ctx.store.insert(timeline);
//     }
// }
