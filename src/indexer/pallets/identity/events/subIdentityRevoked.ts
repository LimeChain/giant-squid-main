import { EnsureAccount } from '../../../actions';
import { Account, IdentitySub } from '../../../../model';
import { IBasePalletSetup, IEventPalletDecoder } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '../../../actions/identity';

export interface ISubIdentityRevokedEventPalletDecoder extends IEventPalletDecoder<{ sub: string; main: string; deposit: bigint }> { }
interface ISubIdentityRevokedEventPalletSetup extends IBasePalletSetup {
  decoder: ISubIdentityRevokedEventPalletDecoder;
}

export class SubIdentityRevokedEventPalletHandler extends EventPalletHandler<ISubIdentityRevokedEventPalletSetup> {
  constructor(setup: ISubIdentityRevokedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const subRevokedData = this.decoder.decode(event);

    const subId = this.encodeAddress(subRevokedData.sub);
    const subAccount = ctx.store.defer(Account, subId);
    const subIdentity = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        account: () => subAccount.get(),
        id: subId,
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
