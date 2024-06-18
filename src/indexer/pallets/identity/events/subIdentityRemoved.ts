import { Action } from '../../../actions/base';
import { ProcessorContext, Block, Event } from '../../../processor';
import { EventPalletHandler } from '../../handler';
import { IIdentitySubIdentityRemovedEventPalletDecoder } from '../../../registry';

import { EnsureAccount } from '../../../actions';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '../../../actions/identity';
import { Account, IdentitySub } from '../../../../model';

export class IdentitySubIdentityRemovedEventPalletHandler extends EventPalletHandler<IIdentitySubIdentityRemovedEventPalletDecoder> {
  constructor(decoder: IIdentitySubIdentityRemovedEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    const event = params.item as Event;

    const subRemovedData = this.decoder.decode(event);

    const subId = this.encodeAddress(subRemovedData.sub);
    const subAccount = params.ctx.store.defer(Account, subId);
    const subIdentity = params.ctx.store.defer(IdentitySub, subId);

    params.queue.push(
      new EnsureAccount(params.block.header, event.extrinsic, {
        account: () => subAccount.get(),
        id: subId,
      }),
      new EnsureIdentitySubAction(params.block.header, event.extrinsic, {
        sub: () => subIdentity.get(),
        account: () => subAccount.getOrFail(),
        id: subId,
      }),
      new RemoveIdentitySubAction(params.block.header, event.extrinsic, {
        sub: () => subIdentity.getOrFail(),
      })
    );
  }
}
