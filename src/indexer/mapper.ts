import { PalletCallHandler, PalletEventHandler } from './handler';
import { PalletTypes, registry } from './registry';

export type DecodersMap = {
  [K in keyof PalletTypes]?: {
    [P in keyof PalletTypes[K]]?: PalletTypes[K][P] extends { decoder: infer D } ? D : never;
  };
};

// TODO: Implement this
export type HandlersMap = {
  [K in keyof PalletTypes]: {
    [P in keyof PalletTypes[K]]: PalletTypes[K][P] extends { handler: infer D } ? D : never;
  };
};

export class PalletMapper {
  // TODO: fix any
  private events: Map<string, PalletEventHandler<any>> = new Map();
  private calls: Map<string, PalletCallHandler<any>> = new Map();

  constructor(decoders: DecodersMap, options: { chain: string }) {
    decoders.events &&
      Object.entries(decoders.events).forEach(([key, decoder]) => {
        const Pallet = registry.get(key);

        if (!Pallet) {
          throw new Error(`Pallet event ${key} not found`);
        }

        this.events.set(key, new Pallet(decoder, options));
      });
    decoders.calls &&
      Object.entries(decoders.calls).forEach(([key, decoder]) => {
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
