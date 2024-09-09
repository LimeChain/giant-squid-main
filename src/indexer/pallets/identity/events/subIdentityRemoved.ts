import { EnsureAccount } from '@/indexer/actions';
// @ts-ignore
import { Account, IdentitySub } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '@/indexer/actions/identity';

export interface ISubIdentityRemovedEventPalletDecoder extends IEventPalletDecoder<{ sub: string; main: string; deposit: bigint }> {}
interface ISubIdentityRemovedEventPalletSetup extends IBasePalletSetup {
  decoder: ISubIdentityRemovedEventPalletDecoder;
}

export class SubIdentityRemovedEventPalletHandler extends EventPalletHandler<ISubIdentityRemovedEventPalletSetup> {
  constructor(setup: ISubIdentityRemovedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const subRemovedData = this.decoder.decode(event);

    const subId = this.encodeAddress(subRemovedData.sub);
    const subAccount = ctx.store.defer(Account, subId);
    const subIdentity = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => subAccount.get(),
        id: subId,
        pk: subRemovedData.sub,
      }),
      new EnsureIdentitySubAction(block.header, event.extrinsic, {
        sub: () => subIdentity.get(),
        account: () => subAccount.getOrFail(),
        id: subId,
      }),
      new RemoveIdentitySubAction(block.header, event.extrinsic, {
        sub: () => subIdentity.getOrFail(),
      })
    );
  }
}
