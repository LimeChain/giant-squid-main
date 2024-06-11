import { chain } from '../../../../chain/index';
import { IStakingRewardEventPalletDecoder } from '../../../registry';
import { Block, Event, ProcessorContext } from '../../../../processor';
import { PalletEventHandler } from '../../../handler';
import { Action } from '../../../../action/base';
import assert from 'assert';
import { encodeAddress } from '../../../../utils';
import { Account } from '../../../../model';
import { EnsureAccount, RewardAction } from '../../../../action';

export class StakingRewardEventPalletDecoder implements IStakingRewardEventPalletDecoder {
  decode(event: Event): {
    stash: string;
    amount: bigint;
  } {
    assert('staking' in chain.api.events);

    const data = chain.api.events.staking.Rewarded.decode(event);

    if (data == null) return { stash: '', amount: BigInt(0) }; // old format rewards skipped

    return { stash: data.stash, amount: data.amount };
  }
}

export class StakingRewardPalletHandler extends PalletEventHandler<IStakingRewardEventPalletDecoder> {
  constructor(decoder: IStakingRewardEventPalletDecoder, options: { chain: string }) {
    super(decoder, options);
  }

  handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): any {
    assert('calls' in chain.api);
    assert('staking' in chain.api.calls);
    assert('staking' in chain.api.events);
    const event = params.item as Event;

    const data = chain.api.events.staking.Rewarded.decode(event);

    // cannot be in separate decoder as when its a falsy value it continues
    if (data == null) return; // old format rewards skipped

    // const { stash, amount } = this.decoder.decode(event);

    let accountId = encodeAddress(data.stash);

    let validatorId: string | undefined;
    let era: number | undefined;
    if (event.call?.name === 'Staking.payout_stakers') {
      const c = chain.api.calls.staking.payout_stakers.decode(event.call);
      validatorId = encodeAddress(c.validatorStash);
      era = c.era;
    }

    const from = params.ctx.store.defer(Account, accountId);

    params.queue.push(
      new EnsureAccount(params.block.header, event.extrinsic, {
        account: () => from.get(),
        id: accountId,
      }),
      new RewardAction(params.block.header, event.extrinsic, {
        id: event.id,
        account: () => from.getOrFail(),
        amount: data.amount,
        era,
        validatorId,
      })
    );
  }
}
