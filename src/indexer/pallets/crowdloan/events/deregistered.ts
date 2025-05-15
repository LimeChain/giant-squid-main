// @ts-ignore
import { Account, HistoryElementType, Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { ChangeParachainStatusAction } from '@/indexer/actions/crowdloan/parachain';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';

export interface IDeregisteredParachainEventPalletDecoder extends IEventPalletDecoder<{ paraId: number }> {}

interface IDeregisteredParachainEventPalletSetup extends IBasePalletSetup {
  decoder: IDeregisteredParachainEventPalletDecoder;
}

export class DeregisteredParachainEventPalletHandler extends EventPalletHandler<IDeregisteredParachainEventPalletSetup> {
  constructor(setup: IDeregisteredParachainEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const origin = getOriginAccountId(event.call?.origin);

    if (!origin) return;

    const accountId = this.encodeAddress(origin);
    const account = ctx.store.defer(Account, accountId);
    const parachain = ctx.store.defer(Parachain, data.paraId.toString());

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: accountId, pk: this.decodeAddress(accountId) }),
      new ChangeParachainStatusAction(block.header, event.extrinsic, {
        parachain: () => parachain.getOrFail(),
        status: ParachainStatus.Deregistered,
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
