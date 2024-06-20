import path from 'path';
import { Indexer } from './indexer';
import { ensureEnvVariable } from './utils';

async function run() {
  try {
    const name = ensureEnvVariable('CHAIN');
    const indexerFile = path.join(__dirname, '/chain', name, '/main.js');

    const { indexer } = await import(indexerFile);

    if (!indexer) {
      throw new Error(`Indexer is not exported for chain: "${name}". Please, check the file at: ${indexerFile}.`);
    }

    if (!(indexer instanceof Indexer)) {
      throw new Error(`Indexer for chain: "${name}" is not an instance of class Indexer.`);
    }

    indexer.start();
  } catch (error: any) {
    console.error(error.message);
  }
}

run();