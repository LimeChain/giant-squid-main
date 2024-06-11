import assert from 'assert';
import { Action } from '../../../../action/base';
import { ProcessorContext, Block, Event } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { IIdentitySubIdentityRemovedEventPalletDecoder } from '../../../registry';
import { chain } from '../../../../chain/index';
import { EnsureAccount } from '../../../../action';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '../../../../action/identity';
import { encodeAddress } from '../../../../utils';
import { Account, IdentitySub } from '../../../../model';

export class IdentitySubIdentityRemovedEventPalletDecoder implements IIdentitySubIdentityRemovedEventPalletDecoder {
  decode(event: Event): { sub: string; main: string; deposit: bigint } {
    console.log('IdentitySubIdentityRemovedEventPalletHandler', event);
    return { sub: 'sub', main: 'main', deposit: BigInt(0) };
  }
}

export class IdentitySubIdentityRemovedEventPalletHandler extends PalletEventHandler<IdentitySubIdentityRemovedEventPalletDecoder> {
  constructor(decoder: IdentitySubIdentityRemovedEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.events);

    const event = params.item as Event;
    const subRemovedData = chain.api.events.identity.IdentitySubRemoved.decode(event);

    const subId = encodeAddress(subRemovedData.sub);
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

export class IdentitySubIdentityRevokedEventPalletHandler extends PalletEventHandler<IdentitySubIdentityRemovedEventPalletDecoder> {
  constructor(decoder: IdentitySubIdentityRemovedEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  // TODO: fix the return type
  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    assert('calls' in chain.api);
    assert('identity' in chain.api.events);

    const event = params.item as Event;
    const subRevokedData = chain.api.events.identity.IdentitySubRevoked.decode(event);

    const subId = encodeAddress(subRevokedData.sub);
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
