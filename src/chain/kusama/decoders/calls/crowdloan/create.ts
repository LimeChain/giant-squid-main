import { calls } from '@/chain/kusama/types'
import { Call, ICreateCallPalletDecoder } from '@/indexer';
import { UnknownVersionError } from '@/utils';

export class CreateCallPalletDecoder implements ICreateCallPalletDecoder {

    decode(call: Call) {
        const { create } = calls.crowdloan;

        if (create.v9010.is(call)) {
            return create.v9010.decode(call);
        }

        throw new UnknownVersionError(create);
    }
}