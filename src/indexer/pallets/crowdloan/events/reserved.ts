// @ts-ignore
import { Account, Parachain, ParachainStatus } from '@/model';
import { EnsureAccount } from '@/indexer/actions';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { ChangeParachainStatusAction, CreateParachainAction } from '@/indexer/actions/crowdloan/parachain';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface IReservedParachainEventPalletDecoder extends IEventPalletDecoder<{ paraId: number; owner: string }> {}

interface IReservedParachainEventPalletSetup extends IBasePalletSetup {
  decoder: IReservedParachainEventPalletDecoder;
}

export class ReservedParachainEventPalletHandler extends EventPalletHandler<IReservedParachainEventPalletSetup> {
  constructor(setup: IReservedParachainEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const accountId = this.encodeAddress(data.owner);

    const account = ctx.store.defer(Account, accountId);
    const parachain = ctx.store.defer(Parachain, data.paraId.toString());

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, {
        id: accountId,
        pk: data.owner,
        account: () => account.get(),
      }),
      new CreateParachainAction(block.header, event.extrinsic, {
        id: data.paraId.toString(),
        manager: () => account.getOrFail(),
      }),
      new ChangeParachainStatusAction(block.header, event.extrinsic, {
        parachain: () => parachain.getOrFail(),
        status: ParachainStatus.Reserved,
      })
    );
  }
}
