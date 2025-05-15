import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
// @ts-ignore
import { Account, HistoryElementType, IdentitySub } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { EnsureIdentitySubAction, RemoveIdentitySubAction } from '@/indexer/actions/identity';
import { getOriginAccountId } from '@/utils';

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
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);
    const subId = this.encodeAddress(subRemovedData.sub);
    const subAccount = ctx.store.defer(Account, subId);
    const subIdentity = ctx.store.defer(IdentitySub, subId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
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
      }),
      new HistoryElementAction(block.header, event.extrinsic, {
        id: event.id,
        name: event.name,
        type: HistoryElementType.Event,
        account: () => account.getOrFail(),
      })
    );
  }
}
