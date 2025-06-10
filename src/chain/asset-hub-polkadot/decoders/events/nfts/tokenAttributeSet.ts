import { events } from '@/chain/asset-hub-polkadot/types';
import { decodeHexToUTF8, UnknownVersionError } from '@/utils';
import { Event, IAttributeSetEventPalletDecoder } from '@/indexer';

export class AttributeSetEventPalletDecoder implements IAttributeSetEventPalletDecoder {
  decode(event: Event) {
    const attributeSet = events.nfts.attributeSet;

    if (attributeSet.v9430.is(event)) {
      const decoded = attributeSet.v9430.decode(event);

      return {
        collection: decoded.collection.toString(),
        maybeItem: decoded.maybeItem?.toString() || null,
        key: decodeHexToUTF8(decoded.key),
        value: decodeHexToUTF8(decoded.value),
      };
    } else {
      throw new UnknownVersionError(attributeSet);
    }
  }
}
