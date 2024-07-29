import * as Utils from '@/utils/misc';
import { Action } from '@/indexer/actions/base';
import { IBasePalletSetup } from '@/indexer/types';
import { Block, Call, ProcessorContext, Event } from '@/indexer/processor';

export interface IHandlerOptions {
  chain: string;
  prefix?: number;
}

export interface IEventHandlerParams {
  ctx: ProcessorContext;
  queue: Action<unknown>[];
  block: Block;
  item: Event;
}

export interface ICallHandlerParams {
  ctx: ProcessorContext;
  queue: Action<unknown>[];
  block: Block;
  item: Call;
}

abstract class BasePalletHandler<ISetup extends IBasePalletSetup> {
  protected decoder: ISetup['decoder'];
  protected options: IHandlerOptions;

  constructor(setup: ISetup, options: IHandlerOptions) {
    this.decoder = setup.decoder;
    this.options = options;
  }

  protected encodeAddress(address: string | Uint8Array) {
    return Utils.encodeAddress(address, this.options.prefix ?? this.options.chain);
  }

  protected decodeAddress(address: string) {
    return Utils.decodeAddress(address, this.options.prefix ?? this.options.chain);
  }

  abstract handle(params: IEventHandlerParams | ICallHandlerParams): void;
}

export abstract class EventPalletHandler<Setup extends IBasePalletSetup> extends BasePalletHandler<Setup> {
  constructor(setup: Setup, options: IHandlerOptions) {
    super(setup, options);
  }

  abstract handle(params: IEventHandlerParams): void;
}

export abstract class CallPalletHandler<Setup extends IBasePalletSetup> extends BasePalletHandler<Setup> {
  constructor(setup: Setup, options: IHandlerOptions) {
    super(setup, options);
  }

  abstract handle(params: ICallHandlerParams): void;
}
