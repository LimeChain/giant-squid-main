import { Action } from "../../../../action/base";
import { ProcessorContext, Block, Event, ITransferEventPalletDecoder } from "../../../../processor";
import { PalletEventHandler } from "../../mapper";



export class TransferEventPalletHandler extends PalletEventHandler<ITransferEventPalletDecoder> {

    constructor(decoder: ITransferEventPalletDecoder, options: { chain: string }) {
        super(decoder, options)
    }

    handle(params: { ctx: ProcessorContext; queue: Action<unknown>[]; block: Block; item: Event }): void {

    }
}