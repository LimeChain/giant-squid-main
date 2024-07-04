import { storage } from '@/chain/kusama/types';
import { UnknownVersionError } from '@/utils';
import { BlockHeader, ILedgerStorageLoader } from '@/indexer';

export class LedgerStorageLoader implements ILedgerStorageLoader {
  async load(blockHeader: BlockHeader, controller: string) {
    const { ledger } = storage.staking;

    if (ledger.v1020.is(blockHeader)) {
      const l = await ledger.v1020.get(blockHeader, controller);
      return l ? { stash: l.stash } : undefined;
    }

    if (ledger.v1050.is(blockHeader)) {
      const l = await ledger.v1050.get(blockHeader, controller);
      return l ? { stash: l.stash.toString() } : undefined;
    }

    if (ledger.v1058.is(blockHeader)) {
      const l = await ledger.v1058.get(blockHeader, controller);
      return l ? { stash: l.stash.toString() } : undefined;
    }

    if (ledger.v1002000.is(blockHeader)) {
      const l = await ledger.v1002000.get(blockHeader, controller);
      return l ? { stash: l.stash.toString() } : undefined;
    }

    throw new UnknownVersionError(ledger);
  }
}
