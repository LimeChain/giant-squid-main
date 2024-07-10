import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';
import { BondAction, EnsureAccount, EnsureStaker } from '@/indexer/actions';
import { Account, BondingType, RewardDestination, Staker } from '@/model';
import { SetPayeeAction } from '@/indexer/actions/staking/payee';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint; payee: { type: string; account?: string } }> { }

interface IRebondCallPalletSetup extends IBasePalletSetup {
    decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
    constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
        super(setup, options);
    }

    handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
        if (call.success === false) return;
        // Make sure the call is not already handled in the Bonded event handler
        if (call.extrinsic?.events.some((e) => e.name === 'Staking.Bonded')) return;

        const origin = getOriginAccountId(call.origin);
        const data = this.decoder.decode(call);

        if (!origin) return;

        const stashId = this.encodeAddress(origin);

        const stash = ctx.store.defer(Account, stashId);
        const staker = ctx.store.defer(Staker, stashId);

        queue.push(
            new EnsureAccount(block.header, call.extrinsic, { account: () => stash.get(), id: stashId, pk: this.decodeAddress(stashId) }),
            new EnsureStaker(block.header, call.extrinsic, { id: stashId, account: () => stash.getOrFail(), staker: () => staker.get() }),
            new BondAction(block.header, call.extrinsic, {
                id: call.id,
                type: BondingType.Bond,
                amount: data.amount,
                account: () => stash.getOrFail(),
                staker: () => staker.getOrFail(),
            })
        );

        let payeeAccount: Promise<Account> | undefined;

        if (data.payee.account) {
            const payeeId = this.encodeAddress(data.payee.account);
            const payee = ctx.store.defer(Account, payeeId);

            payeeAccount = payee.getOrFail();
            queue.push(
                new EnsureAccount(block.header, call.extrinsic, { account: () => payee.get(), id: payeeId, pk: this.decodeAddress(payeeId) }),
            );
        }

        queue.push(
            new SetPayeeAction(block.header, call.extrinsic, {
                staker: () => staker.getOrFail(),
                payeeType: data.payee.type as RewardDestination,
                account: payeeAccount ? () => payeeAccount : undefined,
            })
        );
    }
}
