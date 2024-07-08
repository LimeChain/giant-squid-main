import { ICallPalletDecoder, IBasePalletSetup } from '@/indexer/types';

import { CallPalletHandler, ICallHandlerParams, IHandlerOptions } from '@/indexer/pallets/handler';
import { getOriginAccountId } from '@/utils';

export interface IBondCallPalletDecoder extends ICallPalletDecoder<{ amount: bigint; payee?: string; controller?: string }> {}

interface IRebondCallPalletSetup extends IBasePalletSetup {
  decoder: IBondCallPalletDecoder;
}

export class BondCallPalletHandler extends CallPalletHandler<IRebondCallPalletSetup> {
  constructor(setup: IRebondCallPalletSetup, options: IHandlerOptions) {
    super(setup, options);
  }

  handle({ ctx, queue, block, item: call }: ICallHandlerParams) {
    if (call.success === false) return;
    const origin = getOriginAccountId(call.origin);

    if (!origin) return;

    const stashId = this.encodeAddress(origin);
    const data = this.decoder.decode(call);
    if (stashId === 'HjZrUHN1oiEJhHetU44unLsVqcNeSMPu1iZyJoyNK749R3D') {
      console.log('Bonding from Stash found');
    }
    if (data.payee === 'HjZrUHN1oiEJhHetU44unLsVqcNeSMPu1iZyJoyNK749R3D') {
      console.log('Bonding to Payee found');
    }
    if (data.controller === 'HjZrUHN1oiEJhHetU44unLsVqcNeSMPu1iZyJoyNK749R3D') {
      console.log('Bonding to Controller found');
    }
  }
}
