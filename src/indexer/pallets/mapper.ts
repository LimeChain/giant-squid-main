import { Action } from "../../action/base";
import { Block, Call, Event, ProcessorContext } from "../../processor";
import * as ss58 from '@subsquid/ss58';
import { TransferEventPalletHandler } from "./balances/events/transfer";


export interface PalletEventDecoder<T> {
    decode(event: Event): T;
}

export interface PalletCallDecoder<T> {
    decode(call: Call): T;
}

export abstract class BasePalletHandler<Decoder> {
    constructor(protected decoder: Decoder, protected options: { chain: string }) { }

    protected encodeAddress(address: string | Uint8Array) {
        return ss58.codec(this.options.chain).encode(address);
    }

    abstract handle(params: { ctx: ProcessorContext, queue: Action[], block: Block, item: Call | Event }): void
}

export abstract class PalletEventHandler<Decoder> extends BasePalletHandler<Decoder> {
    constructor(decoder: Decoder, options: { chain: string }) {
        super(decoder, options)
    }

    abstract handle(params: { ctx: ProcessorContext, queue: Action[], block: Block, item: Event }): void
}

export abstract class PalletCallHandler<Decoder> extends BasePalletHandler<Decoder> {
    constructor(decoder: Decoder, options: { chain: string }) {
        super(decoder, options)
    }

    abstract handle(params: { ctx: ProcessorContext, queue: Action[], block: Block, item: Call }): void
}

export interface ITransferEventPalletDecoder extends PalletEventDecoder<{ from: string }> { };

type PalletEvent<Dto> = {
    decoder: PalletEventDecoder<Dto>;
    handler: PalletEventHandler<PalletEventDecoder<Dto>>;
}
type PalletCall<Dto> = {
    decoder: PalletCallDecoder<Dto>;
    handler: PalletCallHandler<PalletCallDecoder<Dto>>;
}
type PalletTypes = {
    events: {
        'Balances.Transfer': PalletEvent<{ from: string }>;
        'Staking.Reward': PalletEvent<{ stash: string, amount: string }>;
    },
    calls: {
        'Identity.set_identity': PalletCall<{ name: string }>
    }
}

export type DecodersMap = {
    [K in keyof PalletTypes]?: {
        [P in keyof PalletTypes[K]]?: PalletTypes[K][P] extends { decoder: infer D } ? D : never;
    };
};

type HandlersMap = {
    [K in keyof PalletTypes]: {
        [P in keyof PalletTypes[K]]: PalletTypes[K][P] extends { handler: infer D } ? D : never;
    };
};


class SetIdentityCallPalletDecoder implements PalletCallDecoder<{ name: string }> {
    decode(call: Call): { name: string; } {
        console.log('IdentitySetIdentityCallPalletDecoder', call);
        return { name: '0x' };
    }
}
class SetIdentityCallPalletHandler extends PalletCallHandler<SetIdentityCallPalletDecoder> {
    constructor(decoder: SetIdentityCallPalletDecoder, options: { chain: string }) {
        super(decoder, options)
    }

    handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Call; }): void {
        console.log('DummyTransferCallPalletHandler', params);

        const data = this.decoder.decode(params.item);

        this.encodeAddress(data.name)
    }
}

const registry: Map<string, any> = new Map()
    .set('Balances.Transfer', TransferEventPalletHandler)
    .set('Identity.set_identity', SetIdentityCallPalletHandler)

// .set('Staking.Reward', TransferEventPalletHandler)
// .set('Staking.Rewarded', TransferEventPalletHandler)
// .set('Identity.SubIdentityRemoved', TransferEventPalletHandler)
// .set('Identity.SubIdentityRevoked', TransferEventPalletHandler)
// .set('Identity.set_identity', TransferEventPalletHandler)
// .set('Identity.provide_judgement', TransferEventPalletHandler)
// .set('Identity.set_subs', TransferEventPalletHandler)
// .set('Identity.rename_sub', TransferEventPalletHandler)
// .set('Identity.add_sub', TransferEventPalletHandler)
// .set('Identity.clear_identity', TransferEventPalletHandler)
// .set('Identity.kill_identity', TransferEventPalletHandler)


export class PalletMapper {
    private events: Map<string, TransferEventPalletHandler> = new Map();
    private calls: Map<string, SetIdentityCallPalletHandler> = new Map();

    constructor(decoders: DecodersMap, options: { chain: string }) {
        decoders.events && Object.entries(decoders.events).forEach(([key, decoder]) => {
            const Pallet = registry.get(key);

            if (!Pallet) {
                throw new Error(`Pallet event ${key} not found`);
            }

            this.events.set(key, new Pallet(decoder, options));
        });
        decoders.calls && Object.entries(decoders.calls).forEach(([key, decoder]) => {
            const Pallet = registry.get(key);

            if (!Pallet) {
                throw new Error(`Pallet call ${key} not found`);
            }

            this.calls.set(key, new Pallet(decoder, options));
        });
    }

    getEvents(): string[] {
        return Array.from(this.events.keys());
    }

    getCalls(): string[] {
        return Array.from(this.calls.keys());
    }

    getEventPallet(name: string) {
        return this.events.get(name);
    }

    getCallPallet(name: string) {
        return this.calls.get(name);
    }
}