import { storage } from '@/chain/polkadot/types';
import { UnknownVersionError } from '@/utils';
import { BlockHeader, ILedgerStorageLoader } from '@/indexer';

export class LedgerStorageLoader implements ILedgerStorageLoader {
  async load(blockHeader: BlockHeader, controller: string) {
    const { ledger } = storage.staking;

    if (ledger.v0.is(blockHeader)) {
      const l = await ledger.v0.get(blockHeader, controller);
      return l ? { stash: l.stash } : undefined;
    }

    if (ledger.v1002000.is(blockHeader)) {
      const l = await ledger.v1002000.get(blockHeader, controller);
      return l ? { stash: l.stash.toString() } : undefined;
    }

    throw new UnknownVersionError(ledger);
  }
}
