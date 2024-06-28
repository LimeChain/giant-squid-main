const fs = require('fs');

const ARCHIVES_JSON = 'assets/archives.json';
const SS58_JSON = 'assets/ss58.json';

const CHAIN_NAMES = [
  'polkadot',
  'kusama',
  'statemint',
  'statemine',
  'acala',
  'karura',
  'moonriver',
  'moonbeam',
  'shiden',
  'bifrost',
  'khala',
  'calamari',
  'astar',
  'efinity',
  'hydradx',
  'phala',
  'gm',
  'kilt',
  'equilibrium',
  'origintrail',
  'polkadex',
  'bajun',
  'amplitude',
  'pendulum',
  'kintsugi',
  'quartz',
  'robonomics',
  'interlay',
  'litmus',
  'unique',
  'litentry',
  'invarch',
  'integritee',
  'tanganika',
  'centrifuge',
  'altair',
  'basilisk',
  'bifrost',
  'bit.country',
  'clover',
  'composable',
  'darwinia',
  'darwinia',
  'dora',
  'parallel',
  'imbue',
  'kabocha',
  'kylin',
  'parallel',
  'pichiu',
  'picasso',
  'ternoa',
  'turing',
  'zeitgeist',
];
// Read data from file
const ss58Data = JSON.parse(fs.readFileSync(SS58_JSON)).registry as any[];
const archivesData = JSON.parse(fs.readFileSync(ARCHIVES_JSON)).archives as any[];

console.dir({ ss58Data: ss58Data[0], archivesData: archivesData[0] });

const newChains = CHAIN_NAMES.map((chainName) => {
  console.log(chainName);
  const ss58Chain = ss58Data.find((obj) => obj.network === chainName);
  const archiveChain = archivesData.find((obj) => obj.network === chainName);
  if (!ss58Chain) console.log('  | WARN -> No ss58 data');
  if (!archiveChain) console.log('  | WARN -> No archives data');
  const { prefix, network, displayName, symbols, decimals } = ss58Chain ?? {
    prefix: null,
    network: chainName,
    displayName: chainName.charAt(0).toUpperCase() + chainName.slice(1) + ' Chain',
    symbols: [],
    decimals: [],
  };
  const archiveName = archiveChain ? archiveChain.network : '';
  console.log('  | DONE\n');
  return { prefix, network, displayName, symbols, decimals, archiveName };
}).sort((chain1, chain2) => (chain1.network < chain2.network ? -1 : 1));

// Save filtered data to new file
const filteredDataJson = JSON.stringify(newChains, null, 2); // use 2 spaces for indentation
fs.writeFileSync('assets/chains-data.json', filteredDataJson);
