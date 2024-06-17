import { Action } from './actions/base';
import { Block, Call, ProcessorContext, Event } from '../processor';
import * as ss58 from '@subsquid/ss58';

abstract class BasePalletHandler<Decoder> {
  constructor(
    protected decoder: Decoder,
    protected options: { chain: string }
  ) {}

  protected encodeAddress(address: string | Uint8Array) {
    return ss58.codec(this.options.chain).encode(address);
  }

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
