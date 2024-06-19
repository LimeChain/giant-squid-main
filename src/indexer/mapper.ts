import { IHandlerOptions } from './pallets/handler';
import { PalletSetups, RegistryCall, RegistryEvent, registry } from './registry';

type IEventPalletKey = keyof RegistryEvent;
type ICallPalletKey = keyof RegistryCall;
type IEventPalletHandler = RegistryEvent[IEventPalletKey];
type ICallPalletHandler = RegistryCall[ICallPalletKey];

export class PalletMapper {
  private events: Map<IEventPalletKey, InstanceType<IEventPalletHandler>> = new Map();
  private calls: Map<ICallPalletKey, InstanceType<ICallPalletHandler>> = new Map();

  constructor(pallets: PalletSetups, options: IHandlerOptions) {
    pallets.events &&
      Object.entries(pallets.events).forEach(([key, palletSetup]) => {
        if (!palletSetup) return;

        const name = key as IEventPalletKey;
        const handler = this.getEventPalletInstance(name, palletSetup, options);

        this.events.set(name, handler);
      });

    pallets.calls &&
      Object.entries(pallets.calls).forEach(([key, palletSetup]) => {
        if (!palletSetup) return;

        const name = key as ICallPalletKey;
        const handler = this.getCallPalletInstance(name, palletSetup, options);

        this.calls.set(name, handler);
      });
  }

  private getEventPalletInstance<Setup>(key: IEventPalletKey, palletSetup: Setup, options: IHandlerOptions): InstanceType<IEventPalletHandler> {
    const PalletHandler = registry.events[key];

    if (!PalletHandler) {
      throw new Error(`Pallet event ${key} not found`);
    }

    // Use a type assertion to tell TypeScript that `PalletHandler` is a newable type
    const Pallet = PalletHandler as new (setup: typeof palletSetup, options: IHandlerOptions) => InstanceType<IEventPalletHandler>;

    return new Pallet(palletSetup, options);
  }

  private getCallPalletInstance<Setup>(key: ICallPalletKey, palletSetup: Setup, options: IHandlerOptions): InstanceType<ICallPalletHandler> {
    const PalletHandler = registry.calls[key];

    if (!PalletHandler) {
      throw new Error(`Pallet event ${key} not found`);
    }

    // Use a type assertion to tell TypeScript that `PalletHandler` is a newable type
    const Pallet = PalletHandler as new (setup: typeof palletSetup, options: IHandlerOptions) => InstanceType<ICallPalletHandler>;

    return new Pallet(palletSetup, options);
  }

  getEvents(): string[] {
    return Array.from(this.events.keys());
  }

  getCalls(): string[] {
    return Array.from(this.calls.keys());
  }

  getEventPallet(name: string) {
    return this.events.get(name as keyof RegistryEvent);
  }

  getCallPallet(name: string) {
    return this.calls.get(name as keyof RegistryCall);
  }
}
