import { EnsureAccount } from '../../../actions';
import { Account, IdentitySub } from '../../../../model';
import { IBasePalletSetup, IEventPalletDecoder } from '../../../types';
import { EventPalletHandler, IEventHandlerParams } from '../../handler';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '../../../actions/identity';

export interface ISubIdentityRemovedEventPalletDecoder extends IEventPalletDecoder<{ sub: string; main: string; deposit: bigint }> {}
interface ISubIdentityRemovedEventPalletSetup extends IBasePalletSetup {
  decoder: ISubIdentityRemovedEventPalletDecoder;
}

export class SubIdentityRemovedEventPalletHandler extends EventPalletHandler<ISubIdentityRemovedEventPalletSetup> {
  constructor(decoder: ISubIdentityRemovedEventPalletSetup, options: { chain: string }) {
    super(decoder, options);
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
