#!usr/bin/env node
require('dotenv').config();

import fs from 'fs';
import path from 'path';
import { ensureEnvVariable } from '../utils/misc';

export async function generateSchema() {
  const name = ensureEnvVariable('CHAIN');
  const indexerFile = path.join(__dirname, '../chain', name, '/main.js');

  const { indexer } = await import(indexerFile);

  const eventKeys = [...indexer.mapper.events.keys()];
  const callKeys = [...indexer.mapper.calls.keys()];

  const combinedKeys: string[] = [...eventKeys, ...callKeys];

  let accountSchema = `type Account @entity {
  id: ID!
  publicKey: ID! @index\n\t`;

  const schemaPath = path.resolve(__dirname, '../../schema.graphql');

  // Clear the file before starting the loop
  fs.writeFileSync(schemaPath, '');

  const appendedSchemaParts = new Set();

  for (const key of combinedKeys) {
    const lowerCaseKey = key.toLowerCase();

    if (lowerCaseKey.includes('balances.transfer') && !appendedSchemaParts.has('balances.transfer')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'transfer.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema += `transfers: [Transfer!] @derivedFrom(field: "account")\n\t`;
      appendedSchemaParts.add('balances.transfer');
    }

    if (lowerCaseKey.includes('staking.reward') && !appendedSchemaParts.has('staking.reward')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'staking.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema += `rewards: [StakingReward!] @derivedFrom(field: "account")\n\t`;
      appendedSchemaParts.add('staking.reward');
    }

    if (lowerCaseKey.includes('identity.set_identity') && !appendedSchemaParts.has('identity.set_identity')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'identity.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema += `identity: Identity @derivedFrom(field: "account")\n\t`;
      appendedSchemaParts.add('identity.set_identity');
    }
    if (
      (lowerCaseKey.includes('identity.set_subs') ||
        lowerCaseKey.includes('identity.add_sub') ||
        lowerCaseKey.includes('identity.rename_sub') ||
        lowerCaseKey.includes('identity.provide_judgement')) &&
      !appendedSchemaParts.has('identity.set_subs') &&
      !appendedSchemaParts.has('identity.add_sub') &&
      !appendedSchemaParts.has('identity.rename_sub') &&
      !appendedSchemaParts.has('identity.provide_judgement')
    ) {
      accountSchema += `sub: IdentitySub @derivedFrom(field: "account")`;
      appendedSchemaParts.add('identity.set_subs');
      appendedSchemaParts.add('identity.add_sub');
      appendedSchemaParts.add('identity.rename_sub');
      appendedSchemaParts.add('identity.provide_judgement');
    }
  }

  accountSchema += `\n}\n`;

  fs.appendFileSync(schemaPath, accountSchema);
  const schemaString = fs.readFileSync(schemaPath, 'utf8');

  fs.writeFileSync(schemaPath, schemaString);
}

if (require.main === module) {
  generateSchema().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}
