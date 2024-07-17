import { Account } from "@/model";
import { getOriginAccountId } from "@/utils";
import { EnsureAccount } from "@/indexer/actions";
import { IBasePalletSetup, ICallPalletDecoder } from "@/indexer/types";
import { CreateCrowdloanAction } from "@/indexer/actions/crowdloan.ts/create";
import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from "@/indexer/pallets/handler";


export interface ICreateCallPalletDecoder extends ICallPalletDecoder<{ index: number, cap: bigint, end: number, firstPeriod: number, lastPeriod: number }> { }

interface ICreateCallPalletSetup extends IBasePalletSetup {
    decoder: ICreateCallPalletDecoder;
}

export class CreateCallPalletHandler extends CallPalletHandler<ICreateCallPalletSetup> {
    constructor(setup: ICreateCallPalletSetup, options: IHandlerOptions) {
        super(setup, options);
    }

    handle({ ctx, block, queue, item: call }: ICallHandlerParams) {
        if (!call.success) return;

        const origin = getOriginAccountId(call.origin);

        if (!origin) return;

        const data = this.decoder.decode(call);
        const managerId = this.encodeAddress(origin);

        const manager = ctx.store.defer(Account, managerId);

        queue.push(
            new EnsureAccount(block.header, call.extrinsic, {
                id: managerId,
                account: () => manager.get(),
                pk: this.decodeAddress(managerId)
            }),
            new CreateCrowdloanAction(block.header, call.extrinsic, {
                paraId: data.index.toString(),
                cap: data.cap,
                end: data.end,
                firstPeriod: data.firstPeriod,
                lastPeriod: data.lastPeriod,
                manager: () => manager.getOrFail()
            })
        )
    }
}