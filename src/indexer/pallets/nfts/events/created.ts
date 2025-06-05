import { Account } from '@/model';
import { CreateNftAction, EnsureAccount } from '@/indexer/actions';
import { IEventPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { EventPalletHandler, IEventHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';

export interface ICreatedEventPalletDecoder extends IEventPalletDecoder<{ collection: number; creator: string; owner: string }> {}

interface ICreatedEventPalletSetup extends IBasePalletSetup {
  decoder: ICreatedEventPalletDecoder;
}

export class CreatedEventPalletHandler extends EventPalletHandler<ICreatedEventPalletSetup> {
  constructor(setup: ICreatedEventPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: event }: IEventHandlerParams) {
    const data = this.decoder.decode(event);

    const ownerId = this.encodeAddress(data.owner);
    const creatorId = this.encodeAddress(data.creator);

    const owner = ctx.store.defer(Account, ownerId);
    const creator = ctx.store.defer(Account, creatorId);

    queue.push(
      new EnsureAccount(block.header, event.extrinsic, { account: () => owner.get(), id: ownerId, pk: this.decodeAddress(ownerId) }),
      new EnsureAccount(block.header, event.extrinsic, { account: () => creator.get(), id: creatorId, pk: this.decodeAddress(creatorId) }),
      new CreateNftAction(block.header, event.extrinsic, {
        id: event.id,
        collection: data.collection,
        owner: () => owner.getOrFail(),
        creator: () => creator.getOrFail(),
      })
    );
  }
}
