import { Account } from '../../../../model';
import { EnsureAccount, SlashAction } from '../../../actions';
import { IEventPalletDecoder, IBasePalletSetup } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';

export interface ISlashEventPalletDecoder extends IEventPalletDecoder<{ staker: string; amount: bigint } | undefined> {}

interface ISlashEventPalletSetup extends IBasePalletSetup {
  decoder: ISlashEventPalletDecoder;
}

export class SlashEventPalletHandler extends EventPalletHandler<ISlashEventPalletSetup> {
  constructor(setup: ISlashEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    if (data == null) return;

    const accountId = this.encodeAddress(data.staker);

    const from = ctx.store.defer(Account, accountId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => from.get(), id: accountId, pk: data.staker }),
      new SlashAction(block.header, event.extrinsic, { id: event.id, account: () => from.getOrFail(), amount: data.amount })
    );
  }
}
