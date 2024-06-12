import { Action } from '../../../../action/base';
import { ProcessorContext, Block, Event } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { IIdentitySubIdentityRemovedEventPalletDecoder } from '../../../registry';

import { EnsureAccount } from '../../../../action';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '../../../../action/identity';
import { Account, IdentitySub } from '../../../../model';

export class IdentitySubIdentityRemovedEventPalletHandler extends PalletEventHandler<IIdentitySubIdentityRemovedEventPalletDecoder> {
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
