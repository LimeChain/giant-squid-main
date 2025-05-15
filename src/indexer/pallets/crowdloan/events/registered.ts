// @ts-ignore
import { Account, HistoryElementType, Parachain, ParachainStatus } from '@/model';
import { IBasePalletSetup, IEventPalletDecoder } from '@/indexer/types';
import { ChangeParachainStatusAction, CreateParachainAction } from '@/indexer/actions/crowdloan/parachain';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { Action, LazyAction } from '@/indexer/actions/base';
import { EnsureAccount, HistoryElementAction } from '@/indexer/actions';
import { getOriginAccountId } from '@/utils';

export interface IRegisteredParachainEventPalletDecoder extends IEventPalletDecoder<{ paraId: number; owner: string }> {}

interface IRegisteredParachainEventPalletSetup extends IBasePalletSetup {
  decoder: IRegisteredParachainEventPalletDecoder;
}

export class RegisteredParachainEventPalletHandler extends EventPalletHandler<IRegisteredParachainEventPalletSetup> {
  constructor(setup: IRegisteredParachainEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, block, queue, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const accountId = this.encodeAddress(data.owner);
    const accountDef = ctx.store.defer(Account, accountId);
    const parachainDef = ctx.store.defer(Parachain, data.paraId.toString());

    queue.push(
      new LazyAction(block.header, event.extrinsic, async () => {
        const queue: Action[] = [];
        const origin = getOriginAccountId(event.call?.origin);

        if (!origin) return [];

        const originId = this.encodeAddress(origin);
        const originAccount = ctx.store.defer(Account, originId);
        const parachain = await parachainDef.get();

        // Some parachains are directly registered, so we must ensure the parachain exist in the database
        if (!parachain) {
          queue.push(
            new EnsureAccount(block.header, event.extrinsic, {
              id: accountId,
              pk: data.owner,
              account: () => accountDef.get(),
            }),
            new CreateParachainAction(block.header, event.extrinsic, {
              id: data.paraId.toString(),
              manager: () => accountDef.getOrFail(),
            })
          );
        }

        queue.push(
          new EnsureAccount(block.header, event.extrinsic, { account: () => originAccount.get(), id: originId, pk: this.decodeAddress(originId) }),
          new ChangeParachainStatusAction(block.header, event.extrinsic, {
            parachain: () => parachainDef.getOrFail(),
            status: ParachainStatus.Registered,
          }),
          new HistoryElementAction(block.header, event.extrinsic, {
            id: event.id,
            name: event.name,
            type: HistoryElementType.Event,
            account: () => originAccount.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
