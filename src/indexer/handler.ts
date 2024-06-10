import { Action } from '../action/base';
import { Block, Call, ProcessorContext, Event } from '../processor';

abstract class BasePalletHandler<Decoder> {
  constructor(
    protected decoder: Decoder,
    protected options: { chain: string }
  ) {}

  abstract handle(params: { ctx: ProcessorContext; queue: Action[]; block: Block; item: Call | Event }): void;
}

export abstract class PalletEventHandler<Decoder> extends BasePalletHandler<Decoder> {
  constructor(decoder: Decoder, options: { chain: string }) {
    super(decoder, options);
  }

  abstract handle(params: { ctx: ProcessorContext; queue: Action[]; block: Block; item: Event }): void;
}

export abstract class PalletCallHandler<Decoder> extends BasePalletHandler<Decoder> {
  constructor(decoder: Decoder, options: { chain: string }) {
    super(decoder, options);
  }

  abstract handle(params: { ctx: ProcessorContext; queue: Action[]; block: Block; item: Call }): void;
}
