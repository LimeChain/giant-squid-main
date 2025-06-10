#!usr/bin/env node
require('dotenv').config();
import 'module-alias/register';

import fs from 'fs';
import path from 'path';
import { ensureEnvVariable } from '../utils';

export const generateSchema = async () => {
  const name = ensureEnvVariable('CHAIN');
  const indexerFile = path.join(__dirname, '../chain', name, '/main.js');

  const { indexer } = await import(indexerFile);

  const eventKeys: string[] = [...indexer.mapper.events.keys()];
  const callKeys: string[] = [...indexer.mapper.calls.keys()];

  const combinedKeysSorted: string[] = [...eventKeys, ...callKeys].sort();
  const schemaPath = path.resolve(__dirname, '../../schema.graphql');

  buildSchema(combinedKeysSorted, schemaPath);
};

// NOTE: This is done to determine if the file is being run directly or being imported as a module
if (require.main === module) {
  generateSchema().catch((error) => {
    console.error(error);
    process.exit(1);
  });
}

const buildSchema = (chainPalletKeys: string[], schemaPath: string) => {
  const commentsInSchema = `# This is an auto-generated file used by the graphiQL explorer to define the tables and relationships between them.\n# This file will be auto-populated based on the pallets used in src/chain/{chainName}/main.ts\n# See generateSchema.ts for more information on how this file is generated.\n\n`;
  const queryLogs = fs.readFileSync(path.join(__dirname, 'queryLogs.graphql'), 'utf8');

  // Clear the file before starting the loop and add essential files and comments
  fs.writeFileSync(schemaPath, '');
  fs.appendFileSync(schemaPath, commentsInSchema);
  fs.appendFileSync(schemaPath, queryLogs);
  fs.appendFileSync(schemaPath, '\n');

  const appendedSchemaParts = new Set<string>();
  const accountSchema = [`type Account @entity {\nid: ID!\npublicKey: ID! @index\n`];

  for (const key of chainPalletKeys) {
    const lowerCaseKey = key.toLowerCase();

    // Balances pallet
    if (lowerCaseKey.includes('balances.transfer') && !appendedSchemaParts.has('balances.transfer')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'transfer.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`transfers: [Transfer!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('balances.transfer');
    }

    // Crowdloan pallet
    if (lowerCaseKey === 'crowdloan.create' && !appendedSchemaParts.has('crowdloan.create')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'crowdloan.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      appendedSchemaParts.add('crowdloan.create');
    }

    // Identity pallet
    if (lowerCaseKey === 'identity.set_identity' && !appendedSchemaParts.has('identity.set_identity')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'identity.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`sub: IdentitySub @derivedFrom(field: "account")\n`);
      accountSchema.push(`identity: Identity @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('identity.set_identity');
    }

    // Only parachain staking rewarded as some chains have only support for that
    if (lowerCaseKey.includes('parachainstaking.rewarded') && !appendedSchemaParts.has('parachainstaking.rewarded')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'parachainStakingRewarded.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`staker: Staker @derivedFrom(field: "stash")\n`);
      appendedSchemaParts.add('parachainstaking.rewarded');
    }

    // Parachain staking pallet
    if (lowerCaseKey === 'parachainstaking.compounded' && !appendedSchemaParts.has('parachainstaking.rewarded')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'parachainStaking.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`staker: Staker @derivedFrom(field: "stash")\n`);
      appendedSchemaParts.add('parachainstaking.rewarded');
      appendedSchemaParts.add('parachainstaking.compounded');
    }

    // Staking pallet
    if (lowerCaseKey === 'staking.bonded' && !appendedSchemaParts.has('staking.bonded')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'staking.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`staker: Staker @derivedFrom(field: "stash")\n`);
      accountSchema.push(`rewards: [StakingReward!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('staking.reward');
      appendedSchemaParts.add('staking.bonded');
    }

    // Only staking rewarded as some chains have only support for that
    if ((lowerCaseKey === 'staking.reward' || lowerCaseKey === 'staking.rewarded') && !appendedSchemaParts.has('staking.reward')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'stakingRewarded.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`staker: Staker @derivedFrom(field: "stash")\n`);
      accountSchema.push(`rewards: [StakingReward!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('staking.reward');
    }

    // XcmPallet for relay chains
    if (
      (lowerCaseKey === 'xcmpallet.limited_reserve_transfer_assets' ||
        lowerCaseKey === 'xcmpallet.limited_teleport_assets' ||
        lowerCaseKey === 'xcmpallet.reserve_transfer_assets' ||
        lowerCaseKey === 'xcmpallet.transfer_assets' ||
        lowerCaseKey === 'xcmpallet.transfer_assets_using_type_and_then.transfer_assets') &&
      !appendedSchemaParts.has('xcmpallet')
    ) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'xcmTransfer.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`xcmTransfers: [XcmTransfer!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('xcmpallet');
    }

    // PolkadotXcm for parachains
    if (lowerCaseKey === 'polkadotxcm.sent' && !appendedSchemaParts.has('polkadotxcm')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'polkadotXcmTransfer.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`polkadotXcmTransfers: [PolkadotXcmTransfer!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('polkadotxcm');
    }

    // XTokens for parachains
    if ((lowerCaseKey === 'xtokens.transferredassets' || lowerCaseKey === 'xtokens.transferredmultiassets') && !appendedSchemaParts.has('xtokens')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'XTokensTransfer.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      accountSchema.push(`xTokenTransfers: [XTokensTransfer!] @derivedFrom(field: "account")\n`);
      appendedSchemaParts.add('xtokens');
    }

    // Conviction Voting pallet
    if (
      (lowerCaseKey === 'convictionvoting.delegate' ||
        lowerCaseKey === 'convictionvoting.undelegate' ||
        lowerCaseKey === 'convictionvoting.unlock' ||
        lowerCaseKey === 'convictionvoting.vote') &&
      !appendedSchemaParts.has('convictionvoting')
    ) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'convictionVoting.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      appendedSchemaParts.add('convictionvoting');
    }

    // Nomination pool pallet
    if (lowerCaseKey === 'nominationpools.bonded' && !appendedSchemaParts.has('nominationpools')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'nominationPools.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      appendedSchemaParts.add('nominationpools');
    }

    if (!appendedSchemaParts.has('historyelements')) {
      const schemaPart = fs.readFileSync(path.join(__dirname, 'historyElements.graphql'), 'utf8');
      fs.appendFileSync(schemaPath, schemaPart + '\n');
      appendedSchemaParts.add('historyelements');
    }
  }

  accountSchema.push(`\n}\n`);

  const accountSchemaString = accountSchema.join('');

  fs.appendFileSync(schemaPath, accountSchemaString);
};
