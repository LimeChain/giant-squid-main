import { storage } from '../types';
import { UnknownVersionError } from '../../../utils';
import { ILedgerStorageLoader } from '../../../indexer/pallets/staking/storage';
import { BlockHeader } from '../../../indexer';

export class LedgerStorageLoader implements ILedgerStorageLoader {
  load(blockHeader: BlockHeader, accountId: string) {
    const { ledger } = storage.staking;

    if (ledger.v0.is(blockHeader)) {
      return ledger.v0.get(blockHeader, accountId);
    } else if (ledger.v1002000.is(blockHeader)) {
      return ledger.v1002000.get(blockHeader, accountId);
    }

    throw new UnknownVersionError(ledger);
  }
}
