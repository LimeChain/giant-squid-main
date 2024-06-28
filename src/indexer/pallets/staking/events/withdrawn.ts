import { Account, Staker } from '../../../../model';
import { EnsureAccount, EnsureStaker, WithdrawnAction } from '../../../actions';
import { Action, LazyAction } from '../../../actions/base';
import { IBasePalletSetup, IEventPalletDecoder } from '../../../types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '../../handler';
import { IBondingDurationConstantGetter } from '../constants';
import { ICurrentEraStorageLoader, ILedgerStorageLoader } from '../storage';

export interface IWithdrawnEventPalletDecoder extends IEventPalletDecoder<{ stash: string; amount: bigint }> {}

interface IWithdrawnEventPalletSetup extends IBasePalletSetup {
  decoder: IWithdrawnEventPalletDecoder;
  constants: {
    bondingDuration: IBondingDurationConstantGetter;
  };
  storage: {
    currentEra: ICurrentEraStorageLoader;
    ledger: ILedgerStorageLoader;
  };
}

export class WithdrawnEventPalletHandler extends EventPalletHandler<IWithdrawnEventPalletSetup> {
  private constants: IWithdrawnEventPalletSetup['constants'];
  private storage: IWithdrawnEventPalletSetup['storage'];

  constructor(setup: IWithdrawnEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);

    this.constants = setup.constants;
    this.storage = setup.storage;
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);
    const stakerId = this.encodeAddress(data.stash);

    const account = ctx.store.defer(Account, stakerId);
    const staker = ctx.store.defer(Staker, { id: stakerId, relations: { unlockings: true } });

    // const staker = ctx.store.getOrFail(Staker, {
    //   where: { id: stakerId },
    //   relations: { unlockings: true },
    // }),

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => account.get(), id: stakerId, pk: data.stash }),
      new EnsureStaker(block.header, event.extrinsic, { id: stakerId, account: () => account.getOrFail(), staker: () => staker.get() }),
      new LazyAction(block.header, event.extrinsic, async (ctx) => {
        const queue: Action[] = [];

        const bondingDuration = this.constants.bondingDuration.get(block.header);
        const currentEra = await this.storage.currentEra.load(block.header);
        //TODO: maybe this isnt needed
        //TODO: remove ledger from metadata if not needed
        const ledger = await this.storage.ledger.load(block.header, data.stash);

        if (!currentEra) return [];

        queue.push(
          new WithdrawnAction(block.header, event.extrinsic, {
            id: event.id,
            amount: data.amount,
            currentEra: currentEra,
            lockedUntilEra: currentEra + bondingDuration,
            staker: () => staker.getOrFail(),
          })
        );

        return queue;
      })
    );
  }
}
